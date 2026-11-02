/* Click ids for server-side Meta matching. No names, email addresses or phone numbers. */
(() => {
  const clickPattern = /^fb\.\d\.\d{10,17}\.[A-Za-z0-9_-]{5,200}$/;
  const fbclidPattern = /^[A-Za-z0-9_-]{8,200}$/;
  window.flowstateMetaClick = () => {
    const params = new URLSearchParams(location.search);
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem('flowstate-meta-click') || '{}') || {}; } catch { saved = {}; }
    const fromUrl = params.get('fbclid') || '';
    const fbclid = fbclidPattern.test(fromUrl) ? fromUrl : (fbclidPattern.test(saved.fbclid || '') ? saved.fbclid : '');
    const cookie = name => {
      try {
        const hit = String(document.cookie || '').split('; ').find(part => part.startsWith(name + '='));
        return hit ? decodeURIComponent(hit.slice(name.length + 1)) : '';
      } catch { return ''; }
    };
    let fbc = cookie('_fbc');
    if (!clickPattern.test(fbc)) fbc = clickPattern.test(saved.fbc || '') ? saved.fbc : '';
    if (!clickPattern.test(fbc) && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    if (!clickPattern.test(fbc)) fbc = '';
    let fbp = cookie('_fbp');
    if (!clickPattern.test(fbp)) fbp = clickPattern.test(saved.fbp || '') ? saved.fbp : '';
    const click = {fbclid, fbc, fbp};
    try { sessionStorage.setItem('flowstate-meta-click', JSON.stringify(click)); } catch { /* The form still submits. */ }
    return click;
  };
})();
