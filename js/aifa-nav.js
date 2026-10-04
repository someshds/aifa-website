(function () {
  var AIFA_CHAT_WIDGET_ID = '668394bfc5fec605b13596ff';
  var ALLOWED_NON_AIFA_CHAT_WIDGET_IDS = {
    '69c2d44d510b6031cc38ed0e': true
  };
  var AIFA_CHAT_SCRIPT_SRC = 'https://widgets.leadconnectorhq.com/loader.js';
  var AIFA_CHAT_RESOURCES_URL = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';

  var BOOK_CALL_URL = '/strategy-call.html';
  var SITE_CHROME_HREF = '/css/site-chrome.css?v=site-chrome-v5';
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
    '        <li><a class="aifa-nav-link" href="/reviews.html">Reviews</a></li>',
    '        <li><a class="aifa-nav-link" href="/#seats">Platform seats</a></li>',
    '        <li><a class="aifa-nav-link" href="/news/">News</a></li>',
    '        <li><a class="aifa-nav-link" href="/email-reimagined/">Email Re-imagined</a></li>',
    '        <li><a class="aifa-nav-link aifa-nav-cta" href="' + BOOK_CALL_URL + '" target="_blank" rel="noopener noreferrer" data-conversion="book-call">Book a call</a></li>',
    '      </ul>',
    '      <button class="aifa-nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="aifa-nav-links">Menu</button>',
    '    </div>',
    '  </div>',
    '</nav>'
  ].join('');

  var footerMarkup = [
    '<footer class="aifa-global-footer" aria-label="Site footer">',
    '  <div class="aifa-footer-inner">',
    '    <div class="aifa-footer-main">',
    '      <div class="aifa-footer-brand-block">',
    '        <a class="aifa-footer-brand" href="/" aria-label="AI Fusion home">',
    '          <img class="aifa-footer-logo" src="/img/brand/fusion-flow-icon-128.webp" width="34" height="34" alt="">',
    '          <span>AI Fusion</span>',
    '        </a>',
    '        <p>Practical AI, CRM and workflow systems that stop leads and important work falling through the gaps.</p>',
    '      </div>',
    '      <div class="aifa-footer-column">',
    '        <h2>Services</h2>',
    '        <a href="/services/ai-systems-snapshot.html">AI Systems Snapshot</a>',
    '        <a href="/ai-operating-systems.html">AI Operating Systems</a>',
    '        <a href="/workshops/">Workshops</a>',
    '        <a href="/email-reimagined/">Email Re-imagined</a>',
    '        <a href="/products/crm.html">All-in-One Business Software</a>',
    '        <a href="/products/ai-agents.html">AI Agents</a>',
    '        <a href="/products/chatbots.html">AI Chatbots</a>',
    '        <a href="/products/automations.html">CRM &amp; Automation</a>',
    '        <a href="/products/funnels.html">Sales &amp; Lead Gen</a>',
    '        <a href="/products/funnels.html">Websites &amp; Funnels</a>',
    '        <a href="/analyser.html">Data Intelligence</a>',
    '      </div>',
    '      <div class="aifa-footer-column">',
    '        <h2>Free Tools</h2>',
    '        <a href="/idea-validator.html">Idea Validator</a>',
    '        <a href="/roi-calculator-v2.0.html">ROI Calculator</a>',
    '        <a href="/review-booster.html">Review Booster</a>',
    '        <a href="/analyser.html">Business Analyser</a>',
    '        <a href="/boxleague-pro-demo.html">BoxLeague Pro Demo</a>',
    '      </div>',
    '      <div class="aifa-footer-column">',
    '        <h2>Company</h2>',
    '        <a href="/about.html">About Grant &amp; AIFA</a>',
    '        <a href="/case-study-10-international.html">Case study</a>',
    '        <a href="/reviews.html">Client reviews</a>',
    '        <a href="/blog/">Blog</a>',
    '        <a href="/news/">News</a>',
    '        <a href="/#book">Contact</a>',
    '        <a href="/strategy-call.html" data-conversion="book-call">Book a 15-minute call</a>',
    '        <a href="/privacy-policy-aifa.html">Privacy Policy</a>',
    '        <a href="/terms.html">Terms &amp; Conditions</a>',
    '        <a href="/earnings-disclaimer.html">Earnings Disclaimer</a>',
    '      </div>',
    '    </div>',
    '    <div class="aifa-footer-bottom">',
    '      <div>',
    '        <p>&copy; 2026 AI Fusion. All rights reserved.</p>',
    '        <p><a href="mailto:grant@aifusionautomations.com">grant@aifusionautomations.com</a> <span aria-hidden="true">&middot;</span> Customer service: <a href="tel:+447480488817">+44 7480 488817</a> <span aria-hidden="true">&middot;</span> <a href="tel:+447588711912">+44 7588 711912</a></p>',
    '        <p>Built with AI</p>',
    '      </div>',
    '      <div class="aifa-footer-social" aria-label="Social links">',
    '        <a href="https://x.com/ai_fusion_auto" aria-label="AI Fusion on X">X</a>',
    '        <a href="https://www.linkedin.com/company/ai-fusion-automations/" aria-label="AI Fusion on LinkedIn">in</a>',
    '        <a href="https://www.facebook.com/aifusionautomations" aria-label="AI Fusion on Facebook">f</a>',
    '        <a href="https://www.youtube.com/@AIFusionAutomations" aria-label="AI Fusion on YouTube">&#9658;</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('');

  function isLegacyNav(element) {
    if (!element || element.id === 'aifa-nav-mount' || element.classList.contains('aifa-global-nav')) {
      return false;
    }

    if (element.matches('body > nav.nav, body > nav.site-nav, body > nav.aifa-site-nav, body > .mobile-menu, body > header.nav, body > header.site-nav')) {
      return true;
    }

    if (element.matches('body > header')) {
      var text = element.textContent || '';
      return Boolean(element.querySelector('nav')) && /Home|Products|Pricing|Book a [Cc]all|Free Tools|Services|How it works|Platform seats/.test(text);
    }

    return false;
  }

  function removeLegacyNav() {
    Array.prototype.slice.call(document.body.children).forEach(function (child) {
      if (isLegacyNav(child)) {
        child.remove();
      }
    });
  }

  function isLegacyFooter(element) {
    if (!element || element.id === 'aifa-footer-mount' || element.classList.contains('aifa-global-footer')) {
      return false;
    }

    if (element.matches('body > footer, body > .footer, body > .aifa-footer')) {
      return true;
    }

    return false;
  }

  function removeLegacyFooters() {
    Array.prototype.slice.call(document.body.children).forEach(function (child) {
      if (isLegacyFooter(child)) {
        child.remove();
      }
    });
  }

  function closeDropdowns(nav, except) {
    Array.prototype.slice.call(nav.querySelectorAll('.aifa-nav-item.is-open')).forEach(function (item) {
      if (item !== except) {
        item.classList.remove('is-open');
        var trigger = item.querySelector('.aifa-nav-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function ensureChromeStyles() {
    if (!document.head || document.querySelector('link[href*="site-chrome.css"]')) {
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = SITE_CHROME_HREF;
    document.head.appendChild(link);
  }

  function navTheme() {
    var explicit = document.body.getAttribute('data-nav-theme');
    if (explicit === 'dark' || explicit === 'light') {
      return explicit;
    }
    var path = window.location.pathname || '';
    if (path === '/news' || path.indexOf('/news/') === 0) {
      return 'dark';
    }
    return 'light';
  }

  function markCurrent(nav) {
    var path = window.location.pathname || '';
    var onNews = path === '/news' || path === '/news/' || path.indexOf('/news/') === 0;
    var onEmail = path === '/email-reimagined' || path === '/email-reimagined/' || path.indexOf('/email-reimagined/') === 0;
    Array.prototype.slice.call(nav.querySelectorAll('.aifa-nav-link')).forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === '/news/' && onNews) {
        link.setAttribute('aria-current', 'page');
      }
      if (href === '/email-reimagined/' && onEmail) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function placeAtBodyStart(el) {
    var skip = null;
    Array.prototype.slice.call(document.body.children).forEach(function (child) {
      if (!skip && child.classList && child.classList.contains('skip-link')) {
        skip = child;
      }
    });
    if (skip) {
      document.body.insertBefore(el, skip.nextSibling);
    } else {
      document.body.insertBefore(el, document.body.firstChild);
    }
  }

  function setMenuOpen(nav, toggle, menu, isOpen) {
    nav.classList.toggle('is-open', isOpen);
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Menu');
    if (!isOpen) closeDropdowns(nav);
  }

  function initNav(nav) {
    if (!nav || nav.getAttribute('data-aifa-nav-inited') === 'true') {
      return;
    }
    nav.setAttribute('data-aifa-nav-inited', 'true');
    nav.setAttribute('data-theme', navTheme());
    markCurrent(nav);

    var toggle = nav.querySelector('.aifa-nav-toggle');
    var menu = nav.querySelector('.aifa-nav-menu');
    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', function () {
      setMenuOpen(nav, toggle, menu, !menu.classList.contains('is-open'));
    });

    Array.prototype.slice.call(nav.querySelectorAll('.aifa-nav-trigger')).forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.aifa-nav-item');
        var isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
        closeDropdowns(nav, isOpen ? item : null);
      });
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setMenuOpen(nav, toggle, menu, false);
      }
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) {
        setMenuOpen(nav, toggle, menu, false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setMenuOpen(nav, toggle, menu, false);
      }
    });
  }

  function mountBackgroundVideo() {
    if (document.querySelector('.aifa-bg-video-layer')) {
      return;
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var layer = document.createElement('div');
    layer.className = 'aifa-bg-video-layer';
    layer.setAttribute('aria-hidden', 'true');

    var video = document.createElement('video');
    video.className = 'aifa-bg-video';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.preload = 'metadata';

    var source = document.createElement('source');
    source.src = BG_VIDEO_SRC;
    source.type = 'video/mp4';
    video.appendChild(source);
    layer.appendChild(video);
    document.body.insertBefore(layer, document.body.firstChild);

    function reveal() {
      document.documentElement.classList.add('aifa-bg-video-on');
      if (navTheme() === 'dark') {
        document.documentElement.classList.add('aifa-bg-video-dark');
      }
      var playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(function () {});
      }
    }

    function removeLayer() {
      document.documentElement.classList.remove('aifa-bg-video-on');
      document.documentElement.classList.remove('aifa-bg-video-dark');
      if (layer.parentNode) {
        layer.parentNode.removeChild(layer);
      }
    }

    video.addEventListener('loadeddata', reveal);
    video.addEventListener('error', removeLayer);
    source.addEventListener('error', removeLayer);
  }

  function render() {
    if (!document.body) {
      return;
    }

    ensureChromeStyles();
    mountBackgroundVideo();

    var footerOnly = document.body.hasAttribute('data-aifa-footer-only');
    var keepFooter = document.body.hasAttribute('data-aifa-keep-footer');
    document.documentElement.classList.add('aifa-nav-ready');
    document.body.classList.add('aifa-nav-ready');
    if (footerOnly) {
      document.body.classList.add('aifa-footer-only');
      document.documentElement.classList.add('aifa-footer-only-root');
    }

    if (!footerOnly) {
      removeLegacyNav();
      var holder = document.createElement('div');
      holder.innerHTML = navMarkup;
      var freshNav = holder.firstChild;
      var existingNav = document.querySelector('.aifa-global-nav');
      if (existingNav) {
        existingNav.parentNode.replaceChild(freshNav, existingNav);
      } else {
        var mount = document.getElementById('aifa-nav-mount');
        if (mount) {
          mount.innerHTML = '';
          mount.appendChild(freshNav);
          if (mount.parentNode !== document.body) {
            placeAtBodyStart(mount);
          }
        } else {
          placeAtBodyStart(freshNav);
        }
      }
    }

    var nav = document.querySelector('.aifa-global-nav');
    if (nav) {
      initNav(nav);
    }

    if (!keepFooter) {
      removeLegacyFooters();
      var footerMount = document.getElementById('aifa-footer-mount');
      if (!footerMount) {
        footerMount = document.createElement('div');
        footerMount.id = 'aifa-footer-mount';
        document.body.appendChild(footerMount);
      }
      footerMount.innerHTML = footerMarkup;
    }

    if (window.localStorage.getItem('aifa_cookie_consent_v1') === 'granted') loadAifaChatWidget();
    window.addEventListener('aifa-consent-granted', loadAifaChatWidget, { once: true });
  }

  function shouldSkipAifaChatWidget() {
    var path = window.location.pathname || '';
    if (document.body.hasAttribute('data-aifa-no-chat-widget')) {
      return true;
    }

    // book.html only redirects to /strategy-call.html and does not render a page.
    return path === '/book.html';
  }

  function isAllowedNonAifaWidget(id) {
    var path = window.location.pathname || '';
    return Boolean(ALLOWED_NON_AIFA_CHAT_WIDGET_IDS[id]) && /boxleague-pro/.test(path);
  }

  function loadAifaChatWidget() {
    if (shouldSkipAifaChatWidget()) {
      return;
    }

    var scripts = Array.prototype.slice.call(document.querySelectorAll('script[data-widget-id]'));
    var hasCanonicalWidget = scripts.some(function (script) {
      return script.getAttribute('data-widget-id') === AIFA_CHAT_WIDGET_ID;
    });

    if (hasCanonicalWidget) {
      return;
    }

    scripts.forEach(function (script) {
      var id = script.getAttribute('data-widget-id');
      if (!isAllowedNonAifaWidget(id)) {
        script.remove();
      }
    });

    if (scripts.some(function (script) {
      return isAllowedNonAifaWidget(script.getAttribute('data-widget-id'));
    })) {
      return;
    }

    var chatScript = document.createElement('script');
    chatScript.src = AIFA_CHAT_SCRIPT_SRC;
    chatScript.setAttribute('data-resources-url', AIFA_CHAT_RESOURCES_URL);
    chatScript.setAttribute('data-widget-id', AIFA_CHAT_WIDGET_ID);
    document.body.appendChild(chatScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
