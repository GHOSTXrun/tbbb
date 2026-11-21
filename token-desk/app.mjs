import { brand, tokens } from './config.mjs';

const byId = (id) => document.getElementById(id);
const mintPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const sol = 'So11111111111111111111111111111111111111112';
const requested = new URLSearchParams(location.search).get('mint');
const mint = requested && mintPattern.test(requested) ? requested : tokens[0].mint;
const savedToken = tokens.find((token) => token.mint === mint);
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 7 });

document.title = brand.name + ' · 代币工作台';
byId('brand').textContent = brand.name;
Object.entries({ '--accent': brand.accent, '--bg': brand.background, '--surface': brand.surface })
  .forEach(([name, value]) => document.documentElement.style.setProperty(name, value));
if (brand.logo) {
  byId('logo').src = brand.logo;
  byId('logo').hidden = false;
  byId('mark').hidden = true;
}

const assetUrl = (address) => '?mint=' + encodeURIComponent(address);
for (const token of tokens) {
  const link = document.createElement('a');
  link.href = assetUrl(token.mint);
  link.textContent = token.name;
  if (token.mint === mint) link.setAttribute('aria-current', 'page');
  byId('tokens').append(link);
}

const input = byId('mint-input');
input.addEventListener('input', () => input.setCustomValidity(''));
byId('find').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!mintPattern.test(value)) {
    input.setCustomValidity('请输入有效格式的 Solana Mint 地址。');
    input.reportValidity();
    return;
  }
  location.assign(assetUrl(value));
});

byId('token-title').textContent = savedToken?.name ?? '自选代币';
byId('avatar').textContent = (savedToken?.name ?? '?').slice(0, 1);
byId('address').textContent = mint;
byId('explorer').href = 'https://solscan.io/token/' + mint;
byId('pump').href = 'https://pump.fun/coin/' + mint;
byId('dex').href = 'https://dexscreener.com/solana/' + mint;
byId('copy').addEventListener('click', async () => {
  const button = byId('copy');
  if (button.disabled) return;
  button.disabled = true;
  try {
    await navigator.clipboard.writeText(mint);
    button.textContent = '已复制';
  } catch {
    button.textContent = '请手动复制';
  }
  setTimeout(() => {
    button.disabled = false;
    button.textContent = '复制';
  }, 1600);
});

const amount = (value) => value != null && value !== '' && Number.isFinite(Number(value)) ? usd.format(Number(value)) : '—';
async function refreshMarket() {
  const refresh = byId('refresh');
  const status = byId('market-status');
  refresh.disabled = true;
  status.textContent = '正在读取 DexScreener 行情…';
  try {
    const response = await fetch('https://api.dexscreener.com/tokens/v1/solana/' + mint, {
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error('Market request failed');
    const pairs = await response.json();
    const pair = pairs.filter((item) => item.baseToken?.address === mint)
      .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
    byId('price').textContent = amount(pair?.priceUsd);
    byId('volume').textContent = amount(pair?.volume?.h24);
    byId('liquidity').textContent = amount(pair?.liquidity?.usd);
    const change = pair?.priceChange?.h24;
    byId('change').textContent = typeof change === 'number' ? change + '%' : '—';
    if (pair) {
      byId('token-title').textContent = pair.baseToken.name || savedToken?.name || '自选代币';
      byId('symbol').textContent = pair.baseToken.symbol || 'SOLANA TOKEN';
      if (typeof pair.info?.imageUrl === 'string' && pair.info.imageUrl.startsWith('https://')) {
        const picture = new Image();
        picture.alt = '';
        picture.referrerPolicy = 'no-referrer';
        picture.onload = () => byId('avatar').replaceChildren(picture);
        picture.src = pair.info.imageUrl;
      }
    }
    status.textContent = pair ? 'DexScreener · 流动性最高的可用交易对 · ' + new Date().toLocaleTimeString('zh-CN') : 'DexScreener 暂无此 Mint 的行情。';
  } catch {
    status.textContent = '行情暂时无法刷新。可以重试或直接打开 DexScreener。';
  } finally {
    refresh.disabled = false;
  }
}
byId('refresh').addEventListener('click', refreshMarket);
void refreshMarket();

const wallet = byId('wallet');
const phantom = window.phantom?.solana;
function showWallet(key) {
  const address = key?.toBase58();
  wallet.textContent = address ? '断开 Phantom' : '连接 Phantom';
  byId('wallet-status').textContent = address ? '已连接：' + address : '';
}
phantom?.on('accountChanged', showWallet);
phantom?.on('disconnect', () => showWallet(null));
wallet.addEventListener('click', async () => {
  wallet.disabled = true;
  try {
    if (!phantom?.isPhantom) {
      byId('wallet-status').textContent = '请安装 Phantom，或在 Phantom 内置浏览器打开。';
    } else if (phantom.isConnected) {
      await phantom.disconnect();
      showWallet(null);
    } else {
      showWallet((await phantom.connect()).publicKey);
    }
  } catch {
    byId('wallet-status').textContent = '钱包连接操作已取消或失败。';
  } finally {
    wallet.disabled = false;
  }
});

const swap = byId('swap');
swap.addEventListener('click', async () => {
  const status = byId('swap-status');
  byId('swap-section').hidden = false;
  swap.disabled = true;
  status.textContent = '正在加载 Jupiter。兑换需在钱包中确认。';
  try {
    if (!window.Jupiter?.init) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://plugin.jup.ag/plugin-v1.js';
        const timer = setTimeout(() => {
          script.remove();
          reject(new Error('Jupiter load timed out'));
        }, 12000);
        script.onload = () => { clearTimeout(timer); resolve(); };
        script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('Jupiter load failed')); };
        document.head.append(script);
      });
    }
    window.Jupiter.init({
      displayMode: 'integrated',
      integratedTargetId: 'jupiter-container',
      formProps: {
        initialInputMint: mint === sol ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' : sol,
        initialOutputMint: mint,
      },
    });
    status.textContent = '报价和可用路由由 Jupiter 提供。';
    swap.hidden = true;
  } catch {
    status.textContent = '无法加载站内兑换。可打开 ';
    const fallback = document.createElement('a');
    fallback.href = 'https://jup.ag/swap/SOL-' + mint;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = 'Jupiter 官网';
    status.append(fallback);
  } finally {
    swap.disabled = false;
  }
});
