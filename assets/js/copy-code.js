document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('figure.highlight, div.highlight, pre > code');

  blocks.forEach((node) => {
    let host, pre, code;

    if (node.matches('pre > code')) {
      code = node;
      pre = node.parentElement;
      host = pre.closest('figure.highlight, div.highlight') || pre;
    } else {
      host = node;
      pre  = node.querySelector('pre');
      code = pre && pre.querySelector('code');
    }

    if (!pre || !code || host.dataset.copyReady) return;

    host.dataset.copyReady = '1';
    host.style.position = host.style.position || 'relative';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--copy copy-button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = '<i class="far fa-copy" aria-hidden="true"></i><span>Copy</span>';

    btn.addEventListener('click', async () => {
      const text = code.textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const r = document.createRange();
        r.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(r);
        document.execCommand('copy');
        sel.removeAllRanges();
      }
      btn.classList.add('is-copied');
      btn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.querySelector('span').textContent = 'Copy';
      }, 1400);
    });

    host.appendChild(btn);
  });
});
