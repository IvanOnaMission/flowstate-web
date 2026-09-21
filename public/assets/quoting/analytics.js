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

  /* How far people get through the video on this page. Custom events only: no contact details. */
  const video = document.querySelector('video.vsl');
  if (!video) return;
  const name = document.title.includes('AI Makeover') ? 'AI Makeover' : location.pathname;
  const marks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const sent = new Set();
  function send(event, extra) {
    if (sent.has(event)) return;
    sent.add(event);
    window.fbq('trackCustom', event, {content_name: name, ...extra});
  }
  // The video autoplays muted, so a muted play is not a choice to watch. Sound on is.
  // Autoplay can start before this script runs, so check the current state as well as the event.
  const started = () => send(video.muted ? 'VideoAutoplay' : 'VideoStart');
  if (!video.paused) started();
  video.addEventListener('play', started, {once: true});
  video.addEventListener('volumechange', () => { if (!video.muted) send('VideoSoundOn'); });
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    marks.forEach(mark => { if (percent >= mark) send(`VideoProgress${mark}`, {percent: mark}); });
  });
  video.addEventListener('ended', () => { send('VideoProgress100', {percent: 100}); send('VideoComplete'); });
})();
