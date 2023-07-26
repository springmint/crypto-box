

 ╔═╗ ╦═╗ ╦ ╦ ╦═╗ ╔╦╗ ╔═╗
 ║   ╠╦╝ ╚╦╝ ╠═╝  ║  ║ ║ 
 ╚═╝ ╩╚═  ╩  ╩    ╩  ╚═╝
 
# Crypto box tool

Crypto box tool 是一个cpbox.io开源的的web3代码工具集合，致力于让你写更少的代码，更加专注于自身的业务！

---

## Website

查看[官网](httpw://www.cpbox.io)

## 联系邮箱we@cpbox.io

## 安装

```
npm install cpbox
```

## 教程

### Batch send token

```typescript
import { BatchSendToken, SUPPORTED_CHAIN_MAP } from "cpbox";
import { parseEther } from "viem"; // Need install

const batchSendToken = new BatchSendToken(SUPPORTED_CHAIN_MAP.goerli.id, <privateKey>, [erc20TokenAddress]);

const sendList = [
  { address: '0x8258fa56642a8b9AD770272972004EC9Dc1fC4e7', amount: parseEther('0.1', 'wei') },
  {
    address: "0x2192c4C8842D7650aC63613F20a0De7ab9F9c63a",
    amount: parseEther("0.01", "wei"),
  },
]

// send native token
await batchSendToken.sendNativeToken(sendList);

// send erc20 token, you must input erc20TokenAddress
await batchSendToken.sendErc20Token(sendList);
```

### Batch generate wallet

```typescript
import { BatchGenerateWallet, MnemonicLen, defaultPath } from "cpbox";

const batchGenerateWallet = new BatchGenerateWallet(
  MnemonicLen.len_12,
  defaultPath
);

// generate wallet with mnemonic, you can input a RegExp to match a special address
await batchGenerateWallet.generateWithMnemonic();
/**
 * {
    privateKey: string;
    address: string;
    publicKey: string;
    mnemonic: string;
 * }
 */
// or
const rule = /^0x666AAA/i;
await batchGenerateWallet.generateWithMnemonic(rule);

// generate wallet
const rule = /^0x666AAA/i;
await batchGenerateWallet.generate(rule);
/**
 * {
    privateKey: string;
    address: string;
    publicKey: string;
 * }
 */
```

## dev 运行
控制台1执行
```bash 
yarn dev
```
会在当前目录下生成dist目录

```bash 
node dist/bin/cpbox -h
```


## 命令行使用

```bash
# help
npx cpbox -h

# batch send token
npx cpbox batchSend -c 5 -f 1.txt 2.txt

# generate wallet
npx cpbox generate -c 100 -f out.txt

# more info
npx cpbox help batchSend
# or
npx cpbox help generate
```

## 全局install