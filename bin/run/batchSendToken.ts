import { privateKeyToAccount } from 'viem/accounts'
import { Address, parseEther, parseUnits } from 'viem'
import { BatchSendToken } from 'src/main'
import { CONTRACT_MAP_TRANSFER } from 'src/constants'
import { LikeErc20 } from 'src/contracts'
import {
  beautifyJsonOfReceipt,
  readFiles,
  enterPrivateKey,
  enterErc20TokenAddress,
  toConfirm,
} from './utils'
import logger from './logger'

export enum SendType {
  erc20 = 'erc20',
  native = 'native',
}

export interface BatchSendTokenParams {
  chainId: number
  type?: SendType
  privateKey?: Address
  tokenAddress?: Address
  autoApprove?: boolean
  files: Array<string>
}

export const FORMAT = 'address,amount'

const verifyApprove = async (
  autoApprove: boolean,
  total: bigint,
  chainId: number,
  tokenAddress: Address,
  privateKey: Address
) => {
  const erc20 = new LikeErc20(tokenAddress, chainId, privateKey)
  const { address } = privateKeyToAccount(privateKey)
  const allowance = await erc20.getAllowce(address, CONTRACT_MAP_TRANSFER[chainId])
  if (allowance < total) {
    if (autoApprove) {
      logger.loading('Approve')
      const hash = await erc20.approve(CONTRACT_MAP_TRANSFER[chainId], total)
      await erc20.publicClient.waitForTransactionReceipt({ hash })
      logger.success('Approve Success')
      return true
    } else {
      const confirm = await toConfirm()
      if (confirm) {
        logger.loading('Approve')
        const hash = await erc20.approve(CONTRACT_MAP_TRANSFER[chainId], total)
        await erc20.publicClient.waitForTransactionReceipt({ hash })
        logger.success('Approve Success')
        return true
      }
    }
    logger.error('You must approve')
    return false
  }
  logger.info('Approved')
  return true
}

const sendErc20Token = async (
  addressAndAmounts: Array<{ address: Address; amount: string }>,
  chainId: number,
  privateKey: Address,
  tokenAddress?: Address,
  autoApprove?: boolean
) => {
  if (!tokenAddress) tokenAddress = await enterErc20TokenAddress()
  const batchSendToken = new BatchSendToken(chainId, privateKey, tokenAddress)
  const erc20 = new LikeErc20(tokenAddress, chainId)

  const deicmals = await erc20.getDecimals()
  const _addressAndAmounts = addressAndAmounts.map(({ address, amount }) => ({
    address,
    amount: parseUnits(amount, deicmals),
  }))
  const total = _addressAndAmounts.reduce((sum, { amount }) => sum + amount, BigInt(0))
  const isApproved = await verifyApprove(!!autoApprove, total, chainId, tokenAddress, privateKey)
  if (!isApproved) return
  logger.loading('Sending...')
  const hash = await batchSendToken.batchTransferErc20Token(tokenAddress, _addressAndAmounts)
  logger.success('Transaction submited')
  logger.print('Txn', logger.dye('info', hash))
  logger.loading('Transaction wait confirm...')
  const receipt = await batchSendToken.publicClient.waitForTransactionReceipt({
    hash,
  })
  logger.success('Transaction confirmed')
  logger.print('Receipt\n', logger.dye('info', beautifyJsonOfReceipt(receipt)))
}

const sendNativeToken = async (
  addressAndAmounts: Array<{ address: Address; amount: string }>,
  chainId: number,
  privateKey: Address,
  tokenAddress?: Address
) => {
  const batchSendToken = new BatchSendToken(chainId, privateKey, tokenAddress)
  logger.loading('Sending...')
  const hash = await batchSendToken.batchTransferNativeToken(
    addressAndAmounts.map(({ address, amount }) => ({
      address,
      amount: parseEther(amount, 'wei'),
    }))
  )
  logger.success('Transaction submited')
  logger.print('Txn', logger.dye('info', hash))
  logger.loading('Transaction wait confirm...')
  const receipt = await batchSendToken.publicClient.waitForTransactionReceipt({
    hash,
  })
  logger.success('Transaction confirmed')
  logger.print('Receipt\n', logger.dye('info', beautifyJsonOfReceipt(receipt)))
}

export default async function (type: string, params: BatchSendTokenParams) {
  const { chainId, files } = params
  let { privateKey, tokenAddress, autoApprove } = params

  if (!privateKey) privateKey = await enterPrivateKey()

  let addressAndAmounts = (await readFiles(files, FORMAT)) as Array<{
    address: Address
    amount: string
  }>

  if (type === 'erc20') {
    logger.info('Batch send erc20 token')
    await sendErc20Token(addressAndAmounts, chainId, privateKey, tokenAddress, autoApprove)
  } else {
    logger.info('Batch send native token')
    await sendNativeToken(addressAndAmounts, chainId, privateKey, tokenAddress)
  }
  process.exit()
}
