# 运行 hardhat 本地测试环境

```bash
# 注意: 每次重新启动会清空之前的block, 需要重新 执行发布代币
cd ./hardhat
yarn install
yarn serve
```

# 发布代币 「cpbox」

```bash
# 重新起一个命令行「hardhat 目录中」
# 默认采用私钥列表第一个发布
cd ./hardhat
yarn deploy
```

# 执行测试

```bash
# 回到根目录
yarn test
```
