(function(){
    const obj = document.getElementById('rolesChart');
    if(!obj) return;

    obj.addEventListener('load', function(){
    const svg = obj.contentDocument && obj.contentDocument.documentElement; // inner <svg>
    if(!svg) return;

    // Initial viewBox
    let [x,y,w,h] = (svg.getAttribute('viewBox') || '0 0 1040 400').split(/\s+/).map(Number);
    const init = {x,y,w,h};
    const ZF   = 1.25;          // zoom factor per step
    const minW = init.w/8;      // max ~8x zoom-in
    const maxW = init.w;        // no zoom-out beyond original

    function setVB(nx,ny,nw,nh){ svg.setAttribute('viewBox', `${nx} ${ny} ${nw} ${nh}`); }
    function clamp(){
        // keep view inside original content bounds
        x = Math.max(init.x, Math.min(init.x + init.w - w, x));
        y = Math.max(init.y, Math.min(init.y + init.h - h, y));
    }

    // Zoom centered around a relative point (0..1 in X/Y)
    function zoomAt(rx, ry, dir){
        const nw = Math.max(Math.min(dir>0 ? w/ZF : w*ZF, maxW), minW);
        const nh = nw * (init.h / init.w);
        // anchor the zoom at the relative cursor position
        x += (w - nw) * rx;
        y += (h - nh) * ry;
        w = nw; h = nh;
        clamp(); setVB(x,y,w,h);
    }

    // Button zoom (center)
    function zoom(dir){ zoomAt(0.5, 0.5, dir); }

    // Pan by a fraction of current view size
    function pan(dxFrac, dyFrac){
        x += dxFrac * w; y += dyFrac * h;
        clamp(); setVB(x,y,w,h);
    }

    // Wheel zoom at cursor
    function onWheel(e){
        e.preventDefault();
        const rect = obj.getBoundingClientRect();
        const rx = (e.clientX - rect.left) / rect.width;   // 0..1
        const ry = (e.clientY - rect.top)  / rect.height;  // 0..1
        zoomAt(rx, ry, e.deltaY < 0 ? +1 : -1);
    }

    // Drag to pan
    let dragging = false, lastX = 0, lastY = 0;
    function onDown(e){ dragging = true; lastX = e.clientX; lastY = e.clientY; svg.style.cursor = 'grabbing'; }
    function onMove(e){
        if(!dragging) return;
        const rect = obj.getBoundingClientRect();
        const dx = (e.clientX - lastX) * (w / rect.width);
        const dy = (e.clientY - lastY) * (h / rect.height);
        x -= dx; y -= dy; lastX = e.clientX; lastY = e.clientY;
        clamp(); setVB(x,y,w,h);
    }
    function onUp(){ dragging = false; svg.style.cursor = ''; }

    // Hook events on the INNER SVG
    svg.addEventListener('wheel', onWheel, { passive:false });
    svg.addEventListener('pointerdown', onDown);
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup', onUp);
    svg.addEventListener('pointerleave', onUp);
    svg.addEventListener('dblclick', (e)=>{ // quick zoom-in at cursor
        const rect = obj.getBoundingClientRect();
        zoomAt((e.clientX-rect.left)/rect.width, (e.clientY-rect.top)/rect.height, +1);
    });

    // Buttons
    const by = id => document.getElementById(id);
    by('zoomIn')  .onclick = () => zoom(+1);
    by('zoomOut') .onclick = () => zoom(-1);
    by('panLeft') .onclick = () => pan(-0.10, 0);
    by('panRight').onclick = () => pan(+0.10, 0);
    by('panUp')   .onclick = () => pan(0, -0.10);
    by('panDown') .onclick = () => pan(0, +0.10);
    by('resetView').onclick = () => { x=init.x; y=init.y; w=init.w; h=init.h; setVB(x,y,w,h); };
    });
})();
