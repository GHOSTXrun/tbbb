(() => {
  const root = new URL('./', document.currentScript.src);
  const routes = new Set(['', 'launch', 'explore', 'vault', 'trade', 'p2p', 'how-it-works', 'docs', 'security', 'terms',
    'launch/3CxAh5Kih6B34S6E7fADG69L5kZmxTntr1tPCko6824m',
    'launch/9bZqxNQ1CjQPWa5pYenqeh1Rnyvke5Mft9AMUGzxrUh6',
    'launch/3Gu7hLMXSQDyXRq8AKF75HgAwWUDvmNyFV7sCfTmHeBH']);
  function page(anchor) {
    const url = new URL(anchor.href);
    if (url.origin !== root.origin || anchor.hasAttribute('download')) return;
    const path = (url.pathname.startsWith(root.pathname) ? url.pathname.slice(root.pathname.length) : url.pathname.slice(1))
      .replace(/(^|\/)index\.html$/, '$1').replace(/\/$/, '');
    if (!routes.has(path)) return;
    return new URL((path ? path + '/' : '') + 'index.html' + url.search + url.hash, root);
  }
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || event.button !== 0) return;
    const href = anchor.getAttribute('href');
    if (href.startsWith('#')) return;
    const target = page(anchor);
    if (!target) return;
    anchor.href = target.href;
    event.stopPropagation();
  }, true);
})();