(() => {
  const script = document.currentScript;
  const site = new URL('./', script.src);
  const path = location.pathname.slice(site.pathname.length).split('/')[0];
  const sections = {
    launch: {
      title: '发行代币',
      intro: '通过 Pump.fun 公开创建 Solana 代币。发行完成后，可单独为符合条件的代币启用 Privacy Rings。',
      items: [
        ['准备代币资料', '填写名称、Ticker、图标和简介。钱包确认前核对元数据、交易网络和预计费用。'],
        ['确认发行结果', '交易确认后保存 Mint 地址。它是代币在 Solana 上的唯一标识，可以用来查看链上记录或分享代币。'],
        ['接入隐私环', '发行和隐私环注册是两笔独立交易。注册需要通过链上确认。代币发行记录公开可查。'],
      ],
      status: '当前归档前端需要配置发行服务、钱包和主网 RPC，才能在站内提交发行交易。',
      links: [['浏览代币', 'explore/'], ['查看发行流程', 'docs/']],
    },
    explore: {
      title: '探索公开发行的代币',
      intro: '使用代币的完整 Mint 地址区分同名代币。详情页可以用来核对资产、查看公开市场信息和访问链上浏览器。',
      items: [
        ['市场数据', '价格、成交量和流动性依赖公开交易对的数据。新代币可能尚未被索引，缺失的数据不代表数值为零。'],
        ['隐私环状态', '查看链上注册记录，确认资产能否存入相应的隐私环。金库内余额不会出现在公开市场列表中。'],
      ],
      status: '归档中的发行列表和注册标签来自保存时的页面。当前状态以链上记录和数据服务为准。',
      links: [['了解隐私边界', 'how-it-works/'], ['查看金库', 'vault/']],
    },
    vault: {
      title: '私人金库',
      intro: '私人金库是项目的核心。通过 Helius Privacy Rings，符合条件的资产可从公开钱包转入加密余额。',
      items: [
        ['存入', '钱包签名后，将资产从公开账户存入隐私环。存款交易和进入环时的金额可公开观察。'],
        ['环内管理', '在已接入的隐私环内查看余额、转账，以及按需要拆分或合并加密凭证。默认隐私环隐藏资产和金额，收发地址仍可见。'],
        ['取回和备份', '资产可取回指定的公开钱包。取款记录公开。原版金库的恢复依赖加密备份和口令，请妥善保管。'],
      ],
      status: '归档前端尚未接通隐私环 RPC、索引和证明服务，无法办理存取与环内转账。',
      links: [['查看安全说明', 'security/'], ['了解工作原理', 'how-it-works/']],
    },
    trade: {
      title: '使用独立钱包交易',
      intro: '原项目通过独立交易钱包和 Jupiter 完成兑换。交易资金可从金库拨出，兑换后再按需存回。',
      items: [
        ['准备资金', '确认交易钱包地址和用于支付网络费用的 SOL 余额。资产从金库提出时会留下公开记录。'],
        ['核对报价并签名', '用 Mint 地址选择代币，核对报价、最低到账数量与滑点，再由交易钱包确认。可用路由取决于流动性。'],
        ['查看成交', '用交易签名核对成交状态。独立交易钱包的公开兑换仍然可以在链上查询。'],
      ],
      status: '当前归档前端需要配置 Jupiter 和钱包相关服务，才能在站内获取实时报价及提交兑换。',
      links: [['查看金库', 'vault/'], ['浏览代币', 'explore/']],
    },
    p2p: {
      title: '点对点报价与交割',
      intro: '原项目用加密链接分享报价，由双方核对交易并签名。买卖两边的资产在同一笔 Solana 交易中结算。',
      items: [
        ['发出报价', '填写出售资产、目标资产、数量和有效期。可限制特定交易对手，并通过私密渠道分享链接。'],
        ['核对条款', '双方用 Mint 地址确认资产，核对数量与收款地址，再审核钱包中的交易内容。'],
        ['原子结算', '只有整笔交易成功时双方才同时收到资产。报价内容可以加密，链上结算仍会留下公开记录。'],
      ],
      status: '当前归档前端需要报价存储和结算服务，才能在站内创建有效报价或提交交割。',
      links: [['查看操作说明', 'docs/'], ['查看安全说明', 'security/']],
    },
    'how-it-works': {
      title: '资产如何在公开账户与隐私环之间流动',
      intro: '项目以 Solana 的公开执行能力为基础，用 Helius Privacy Rings 为金库余额和环内转账提供保密。',
      items: [
        ['公开入口', '代币发行、普通转账、公开兑换和金库存取在 Solana 链上留下记录。'],
        ['加密余额与证明', '隐私环中的资产和金额以加密凭证表示。零知识证明让程序验证交易是否有效，同时保持金额字段加密。'],
        ['可见的关联信息', '默认隐私环的收发地址、交易时间和费用支付方仍可被观察。公开存取记录也可能被关联。'],
      ],
      links: [['查看金库', 'vault/'], ['查看安全说明', 'security/']],
    },
    docs: {
      title: '使用与部署指南',
      intro: '按实际使用场景选择入口。当前发布版本为原站前端归档，各模块接通服务后才可办理对应链上操作。',
      items: [
        ['发行及展示', '先完成代币发行，再用 Mint 核对发行记录和市场数据。需要金库支持时单独核验隐私环注册状态。'],
        ['金库、交易与报价', '金库接入 Helius Privacy Rings。公开兑换接入 Jupiter。P2P 需要报价数据服务和双方签名才能完成结算。'],
        ['部署检查', '将前端部署到 HTTPS 地址。按模块配置钱包、Solana RPC、元数据存储、隐私环服务及报价接口，并逐一测试交易确认与错误处理。'],
      ],
      links: [['了解工作原理', 'how-it-works/'], ['查看安全说明', 'security/']],
    },
  };
  const content = sections[path];

  function applyBrand() {
    if (!document.title.startsWith('KYVEXA')) {
      document.title = document.title.replace(/NULL(?:CRYPTED)?/gi, 'KYVEXA');
    }
    const icon = document.querySelector('link[rel="icon"]') || document.head.appendChild(document.createElement('link'));
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = new URL('icon.svg?v=transparent', site).href;
    const home = document.querySelector('header a[aria-label$=" home"]');
    home?.setAttribute('aria-label', 'KYVEXA home');
    for (const area of [home, document.querySelector('footer')]) {
      if (!area) continue;
      const wordmark = [...area.querySelectorAll('span')].find((item) => /^(?:NULL|KYVEXA)$/.test(item.textContent.trim()));
      if (!wordmark) continue;
      const previousMark = wordmark.previousElementSibling;
      if (previousMark?.matches('svg')) {
        const logo = document.createElement('img');
        logo.className = 'kyvexa-logo';
        logo.src = icon.href;
        logo.alt = '';
        previousMark.replaceWith(logo);
      }
      wordmark.textContent = 'KYVEXA';
    }
    for (const button of document.querySelectorAll('header button')) {
      if (!button.textContent.trim().startsWith('CA:')) continue;
      const label = document.createElement('span');
      label.className = 'kyvexa-ca';
      label.translate = false;
      label.textContent = 'CA: TBA';
      button.replaceWith(label);
    }
    for (const link of document.querySelectorAll('header a, footer a')) {
      if (link.href === 'https://x.com/nullcrypted') link.hidden = true;
    }
    const text = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (text.nextNode()) {
      const node = text.currentNode;
      if (node.parentElement.closest('script, style, noscript')) continue;
      node.nodeValue = node.nodeValue.replace(/\bNULL(?:CRYPTED)?\b/g, 'KYVEXA');
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('header a[href], footer a[href], #project-guide a[href]');
    if (!link || event.button !== 0) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const url = new URL(href, location.href);
    if (url.origin !== site.origin) return;
    const relative = (url.pathname.startsWith(site.pathname)
      ? url.pathname.slice(site.pathname.length) : url.pathname.slice(1)).replace(/(^|\/)index\.html$/, '$1').replace(/\/$/, '');
    if (relative && !Object.hasOwn(sections, relative) && !['security', 'terms'].includes(relative)) return;
    link.href = new URL((relative ? relative + '/' : '') + 'index.html' + url.search + url.hash, site).href;
    event.stopPropagation();
  }, true);

  function addContent() {
    const main = document.querySelector('main');
    if (!content || !main || document.getElementById('project-guide')) return;
    const section = document.createElement('section');
    section.id = 'project-guide';
    section.lang = 'zh-CN';
    section.setAttribute('aria-labelledby', 'project-guide-title');

    function add(parent, tag, value) {
      const element = document.createElement(tag);
      element.textContent = value;
      parent.appendChild(element);
      return element;
    }

    add(section, 'h2', content.title).id = 'project-guide-title';
    add(section, 'p', content.intro);
    const topics = add(section, 'div', '');
    topics.className = 'project-guide-topics';
    for (const [heading, detail] of content.items) {
      const topic = add(topics, 'article', '');
      add(topic, 'h3', heading);
      add(topic, 'p', detail);
    }
    if (content.status) add(section, 'p', content.status).className = 'project-guide-status';
    const related = add(section, 'div', '');
    related.className = 'project-guide-links';
    for (const [label, destination] of content.links) {
      add(related, 'a', label).href = new URL(destination + 'index.html', site).href;
    }
    main.insertAdjacentElement('afterend', section);
  }

  function initialize() {
    applyBrand();
    addContent();
  }

  if (document.readyState === 'complete') initialize();
  else window.addEventListener('load', initialize, { once: true });
})();

(() => {
  function bootArchiveEffects() {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function reveal(element) {
      const line = element.firstElementChild;
      const letters = line ? Array.from(line.childNodes) : [];
      const hiddenLetters = letters.filter((letter) => letter.nodeType === Node.ELEMENT_NODE && letter.style.opacity === '0.12');
      if (!hiddenLetters.length) return;
      const duration = Math.min(1100, 260 + 22 * letters.length);
      if (reducedMotion) {
        hiddenLetters.forEach((letter) => { letter.style.opacity = '1'; });
        return;
      }

      const started = performance.now();
      let completed = 0;
      let scanning = [];
      function animate(now) {
        if (!element.isConnected) return;
        const elapsed = Math.min(1, (now - started) / duration);
        const position = (1 - (1 - elapsed) ** 2) * (letters.length + 3);
        for (const bar of scanning) bar.remove();
        scanning = [];
        const revealed = Math.max(0, Math.min(letters.length, Math.ceil(position - 2)));
        for (; completed < revealed; completed++) {
          const letter = letters[completed];
          if (letter.nodeType === Node.ELEMENT_NODE) letter.style.opacity = '1';
        }
        for (let index = revealed; index < Math.min(letters.length, Math.ceil(position)); index++) {
          const letter = letters[index];
          if (letter.nodeType !== Node.ELEMENT_NODE) continue;
          letter.style.position = 'relative';
          letter.style.opacity = '0.55';
          const bar = document.createElement('span');
          bar.setAttribute('aria-hidden', 'true');
          bar.style.cssText = 'position:absolute;inset-inline:0;bottom:.08em;height:.09em;background:var(--color-signal);pointer-events:none';
          letter.append(bar);
          scanning.push(bar);
        }
        if (elapsed < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        reveal(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const element of document.querySelectorAll('main [aria-label], footer [aria-label]')) {
      const line = element.firstElementChild;
      if (line?.getAttribute('aria-hidden') === 'true' && line.querySelector(':scope > span[style="opacity:0.12"]')) {
        observer.observe(element);
      }
    }

    function drawBackground(original, index, added = false) {
      const initialWidth = original.width;
      const initialHeight = original.height;
      if (!added && (original.hasAttribute('width') || original.hasAttribute('height'))) return;
      const canvas = added ? original : original.cloneNode();
      const context = canvas.getContext('2d');
      if (!context) return;
      canvas.dataset.kyvexaPixelField = added ? 'section' : 'fallback';
      Object.assign(canvas.style, { position: 'absolute', inset: '0' });
      if (!added) original.before(canvas);
      const cell = index === 0 ? 14 : 12;
      const density = index === 0 ? 0.06 : 0.1;
      let columns = 0;
      let rows = 0;
      let flicker = [];
      let energy = [];
      let scale = 1;
      let tick = 0;
      let frame = 0;
      let activeInViewport = !added;
      let point;
      let previous;

      function resize() {
        const rect = canvas.getBoundingClientRect();
        scale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * scale);
        canvas.height = Math.round(rect.height * scale);
        columns = Math.ceil(rect.width / cell);
        rows = Math.ceil(rect.height / cell);
        energy = new Float32Array(columns * rows);
        flicker = Uint8Array.from(energy, () => Math.random() < density ? 1 + Math.floor(Math.random() * 3) : 0);
        if (reducedMotion) render();
      }

      function move(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        point = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x, y } : undefined;
      }

      function addPointerTrail() {
        if (!point) { previous = undefined; return; }
        const start = previous || point;
        const steps = Math.max(1, Math.min(12, Math.ceil(Math.hypot(point.x - start.x, point.y - start.y) / cell)));
        for (let step = 0; step <= steps; step++) {
          const column = Math.floor((start.x + (point.x - start.x) * step / steps) / cell);
          const row = Math.floor((start.y + (point.y - start.y) * step / steps) / cell);
          for (let y = -2; y <= 2; y++) {
            for (let x = -2; x <= 2; x++) {
              const distance = Math.hypot(x, y);
              const px = column + x;
              const py = row + y;
              if (px < 0 || py < 0 || px >= columns || py >= rows || distance > 2.2 || Math.random() <= 0.28 * distance) continue;
              const position = py * columns + px;
              energy[position] = Math.min(1, energy[position] + 0.9 - 0.25 * distance);
            }
          }
        }
        previous = point;
      }

      function render() {
        tick++;
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        addPointerTrail();
        for (let position = 0; position < energy.length; position++) {
          const active = energy[position];
          if (active > 0.02) {
            context.fillStyle = 'rgba(229,57,53,' + (0.85 * active).toFixed(3) + ')';
            energy[position] *= 0.94;
          } else if (flicker[position]) {
            const pulse = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(0.02 * tick + 1.7 * position);
            context.fillStyle = 'rgba(243,243,241,' + (0.035 * flicker[position] * pulse).toFixed(3) + ')';
          } else {
            continue;
          }
          context.fillRect(position % columns * cell + 2, Math.floor(position / columns) * cell + 2, cell - 4, cell - 4);
        }
        if (!reducedMotion && activeInViewport) frame = requestAnimationFrame(render);
      }

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      if (!reducedMotion) {
        window.addEventListener('pointermove', move, { passive: true });
        if (added) {
          const viewport = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting === activeInViewport) return;
            activeInViewport = entry.isIntersecting;
            if (activeInViewport) frame = requestAnimationFrame(render);
            else {
              cancelAnimationFrame(frame);
              point = previous = undefined;
              energy.fill(0);
            }
          });
          viewport.observe(canvas);
        } else {
          frame = requestAnimationFrame(render);
        }
      }
      resize();
      if (added) return;
      const monitor = setInterval(() => {
        if (original.isConnected && original.width === initialWidth && original.height === initialHeight &&
            !original.hasAttribute('width') && !original.hasAttribute('height')) return;
        clearInterval(monitor);
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        window.removeEventListener('pointermove', move);
        canvas.remove();
      }, 1500);
    }

    const existingFields = [...document.querySelectorAll('main canvas.pointer-events-none')];
    existingFields.forEach((canvas, index) => drawBackground(canvas, index));

    if (!document.querySelector('main canvas.absolute + div > svg[width="96"]')) return;
    const sections = [...document.querySelectorAll('main > section')];
    for (const section of sections.slice(1)) {
      if (section.querySelector('canvas')) continue;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.className = 'pointer-events-none h-full w-full';
      Object.assign(section.style, { position: 'relative', isolation: 'isolate' });
      canvas.style.zIndex = '-1';
      section.prepend(canvas);
      drawBackground(canvas, 0, true);
    }
  }

  // Give the original React effects the first chance to start.
  if (document.readyState === 'complete') setTimeout(bootArchiveEffects, 400);
  else window.addEventListener('load', () => setTimeout(bootArchiveEffects, 400), { once: true });
})();
