(function () {
  var AIFA_CHAT_WIDGET_ID = '668394bfc5fec605b13596ff';
  var ALLOWED_NON_AIFA_CHAT_WIDGET_IDS = {
    '69c2d44d510b6031cc38ed0e': true
  };
  var AIFA_CHAT_SCRIPT_SRC = 'https://widgets.leadconnectorhq.com/loader.js';
  var AIFA_CHAT_RESOURCES_URL = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';

  var BOOK_CALL_URL = '/strategy-call.html';
  var SITE_CHROME_HREF = '/css/site-chrome.css?v=site-chrome-v3';
  // AIFA-owned background plate. Drop the file at videos/background/aifa-background.mp4.
  var BG_VIDEO_SRC = '/videos/background/aifa-background.mp4';

  var navMarkup = [
    '<nav class="aifa-global-nav" aria-label="Primary">',
    '  <div class="aifa-nav-inner">',
    '    <a class="aifa-nav-brand" href="/" aria-label="AI FUSION home">',
    '      <img class="aifa-nav-logo" src="/img/brand/fusion-flow-icon-128.webp" width="32" height="32" alt="">',
    '      <span class="aifa-nav-name">AI FUSION</span>',
    '    </a>',
    '    <div class="aifa-nav-cluster">',
    '      <ul class="aifa-nav-menu" id="aifa-nav-links">',
    '        <li><a class="aifa-nav-link" href="/#how">How it works</a></li>',
    '        <li><a class="aifa-nav-link" href="/#proof">Proof</a></li>',
    '        <li><a class="aifa-nav-link" href="/#seats">Platform seats</a></li>',
    '        <li><a class="aifa-nav-link" href="/news/">News</a></li>',
    '        <li><a class="aifa-nav-link aifa-nav-cta" href="' + BOOK_CALL_URL + '" target="_blank" rel="noopener noreferrer" data-conversion="book-call">Book a call</a></li>',
    '      </ul>',
    '      <button class="aifa-nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="aifa-nav-links">Menu</button>',
    '    </div>',
    '  </div>',
    '</nav>'
  ].join('');
