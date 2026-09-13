/* Campaign analytics: no names, email addresses or phone numbers are passed. */
(() => {
  if (!['flowstate.net.nz', 'www.flowstate.net.nz'].includes(location.hostname)) return;
  if (!window.fbq) {
    const fbq = window.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }
  window.fbq('init', '3159317364459626');
  window.fbq('track', 'PageView');
})();
