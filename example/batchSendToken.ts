import { Address, parseEther } from "viem";
import { SUPPORTED_CHAIN_MAP } from "../src/main";
import BatchSendToken from "../src/tools/batchSendToken";

const chainId = SUPPORTED_CHAIN_MAP.goerli.id; // goerli
const privateKey =
  "0xffb202cacbf8b8230b08ca27c8c970a130851c4e78f22e48d2544de5fc8c9f08";
const sendParams = [
  {
    address: "0x8258fa56642a8b9AD770272972004EC9Dc1fC4e7" as Address,
    amount: parseEther("0.002", "wei"),
    balance: BigInt(0),
  },
  {
    address: "0x2192c4C8842D7650aC63613F20a0De7ab9F9c63a" as Address,
    amount: parseEther("0.0001", "wei"),
    balance: BigInt(0),
  },
];

// native token
!(async () => {
  const batchSendToken = new BatchSendToken(chainId, privateKey);
  const hash = await batchSendToken.sendNativeToken(sendParams);
  const transaction =
    await batchSendToken.publicClient.waitForTransactionReceipt({ hash });

  console.log(transaction);
})();

// erc20
!(async () => {
  const erc20TokenAddress = "0xe953BC62104880eab3130f317C95EacEFb19a40D";
  const batchSendToken = new BatchSendToken(
    chainId,
    privateKey,
    erc20TokenAddress
  );

  const hash = await batchSendToken.sendErc20Token(sendParams);
  const transaction =
    await batchSendToken.publicClient.waitForTransactionReceipt({ hash });

  console.log(transaction);
})();
