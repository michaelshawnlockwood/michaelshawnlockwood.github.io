document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.viz-wrap').forEach((wrap) => {
    const buttons = wrap.querySelectorAll('.viz-btn');
    const range   = wrap.querySelector('#darkRange');
    const state   = { inv: 0, b: 1, c: 1 };

    const apply = () => {
      wrap.style.setProperty('--viz-filter',
        `invert(${state.inv}) brightness(${state.b}) contrast(${state.c})`);
    };

    const setMode = (mode) => {
      buttons.forEach(b => b.classList.toggle('is-active', b.dataset.mode === mode));
      if (mode === 'normal') { state.inv = 0; state.c = 1; }
      if (mode === 'invert') { state.inv = 1; state.c = 1; }
      apply();
    };

    buttons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    if (range) range.addEventListener('input', e => { state.b = (+e.target.value)/100; apply(); });

    setMode('normal');
  });
});
