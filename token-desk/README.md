# Token Desk

可独立部署的 Solana 代币工作台，包含三个预置 Mint 和自选 Mint 查询。

- `config.mjs` 配置项目名称、标志路径、主题色和预置代币。将标志文件放在此目录并填写相对路径。
- 通过 DexScreener 读取实时市场数据，按流动性选择行情交易对。
- 通过 Phantom 扩展连接钱包。兑换由官方 Jupiter Plugin 提供，报价、支持的资产与可用流动性以 Jupiter 返回结果为准。
- 隐私金库尚未实现。Privacy Rings 注册、存取款和隐私转账需要独立集成 Helius SDK、配置 RPC 并测试。本站没有发币或 P2P 结算逻辑。

## 本地运行

需要 Node.js 20 或更新版本。在此目录运行 `node serve.mjs`，然后打开 `http://localhost:4173/`。无需安装依赖。Phantom 需要 HTTPS 或 localhost 环境。

## 部署

将此目录作为静态内容发布，通过 HTTPS 访问。在 tbbb 仓库中，从 main 的根目录发布 GitHub Pages 后，工作台位于 `/tbbb/token-desk/`。
