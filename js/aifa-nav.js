(function () {
  var AIFA_CHAT_WIDGET_ID = '668394bfc5fec605b13596ff';
  var ALLOWED_NON_AIFA_CHAT_WIDGET_IDS = {
    '69c2d44d510b6031cc38ed0e': true
  };
  var AIFA_CHAT_SCRIPT_SRC = 'https://widgets.leadconnectorhq.com/loader.js';
  var AIFA_CHAT_RESOURCES_URL = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';

  var navMarkup = [
    '<nav class="aifa-global-nav" aria-label="Primary">',
    '  <div class="aifa-nav-inner">',
    '    <a class="aifa-nav-brand" href="/">',
    '      <span class="aifa-nav-logo" aria-hidden="true">&#9889;</span>',
    '      <span class="aifa-nav-name">AI Fusion Automations</span>',
    '    </a>',
    '    <button class="aifa-nav-toggle" type="button" aria-expanded="false" aria-label="Open menu"><span></span></button>',
    '    <ul class="aifa-nav-menu">',
    '      <li><a class="aifa-nav-link" href="/">Home</a></li>',
    '      <li class="aifa-nav-item">',
    '        <button class="aifa-nav-trigger" type="button" aria-expanded="false">Services</button>',
    '        <div class="aifa-nav-dropdown">',
    '          <a href="/services/ai-systems-snapshot.html">AI Systems Snapshot</a>',
    '          <a href="/ai-operating-systems.html">AI Operating Systems</a>',
    '          <a href="/products/ai-agents.html">AI Agents</a>',
    '          <a href="/products/crm.html">CRM &amp; Automation</a>',
    '          <a href="/products/voice-ai.html">AI Receptionist / Voice AI</a>',
    '          <a href="/products/automations.html">Workflow Automations</a>',
    '          <a href="/products/funnels.html">Website &amp; Funnel Building</a>',
    '          <a href="/services/">Industry Solutions</a>',
    '        </div>',
    '      </li>',
    '      <li class="aifa-nav-item">',
    '        <button class="aifa-nav-trigger" type="button" aria-expanded="false">Products</button>',
    '        <div class="aifa-nav-dropdown">',
    '          <a href="/products/">Products Hub</a>',
    '          <a href="/products/ai-agents.html">AI Agents</a>',
    '          <a href="/products/crm.html">CRM</a>',
    '          <a href="/products/funnels.html">Funnels</a>',
    '          <a href="/products/email-sms.html">Email &amp; SMS</a>',
    '          <a href="/products/reputation.html">Reputation</a>',
    '          <a href="/products/voice-ai.html">Voice AI</a>',
    '          <a href="/products/automations.html">Automations</a>',
    '          <a href="/products/calendars.html">Calendars</a>',
    '          <a href="/products/payments.html">Payments</a>',
    '        </div>',
    '      </li>',
    '      <li class="aifa-nav-item">',
    '        <button class="aifa-nav-trigger" type="button" aria-expanded="false">Proof</button>',
    '        <div class="aifa-nav-dropdown">',
    '          <a href="/videos/#founder-walkthroughs">Founder Walkthroughs</a>',
    '          <a href="/case-study-10-international.html">10 International Case Study</a>',
    '          <a href="/boxleague-pro-demo.html">BoxLeague Pro</a>',
    '        </div>',
    '      </li>',
    '      <li class="aifa-nav-item">',
    '        <button class="aifa-nav-trigger" type="button" aria-expanded="false">Free Tools</button>',
    '        <div class="aifa-nav-dropdown">',
    '          <a href="/tools-index.html">Tools Hub</a>',
    '          <a href="/idea-validator.html">Idea Validator</a>',
    '          <a href="/roi-calculator-v2.0.html">ROI Calculator</a>',
    '          <a href="/review-booster.html">Review Booster</a>',
    '          <a href="/analyser.html">Business Analyser</a>',
    '          <a href="/league-scheduler.html">League Scheduler</a>',
    '        </div>',
    '      </li>',
    '      <li><a class="aifa-nav-link" href="/pricing.html">Pricing</a></li>',
    '      <li><a class="aifa-nav-link" href="/blog/">Blog</a></li>',
    '      <li><a class="aifa-nav-link" href="/news/">AI News</a></li>',
    '      <li><a class="aifa-nav-link" href="/#book-a-call">Contact Us</a></li>',
    '      <li><a class="aifa-nav-link aifa-nav-cta" href="/strategy-call.html">Book a Call</a></li>',
    '    </ul>',
    '  </div>',
    '</nav>'
  ].join('');

  var footerMarkup = [
    '<footer class="aifa-global-footer" aria-label="Site footer">',
    '  <div class="aifa-footer-inner">',
    '    <div class="aifa-footer-main">',
    '      <div class="aifa-footer-brand-block">',
    '        <a class="aifa-footer-brand" href="/">',
    '          <span class="aifa-footer-logo" aria-hidden="true">&#9889;</span>',
    '          <span>AI Fusion Automations</span>',
    '        </a>',
    '        <p>Helping small businesses grow with AI-powered automation, chatbots, and CRM solutions. Based in East Sussex, serving businesses across the UK and worldwide.</p>',
    '      </div>',
    '      <div class="aifa-footer-column">',
    '        <h2>Services</h2>',
    '        <a href="/services/ai-systems-snapshot.html">AI Systems Snapshot</a>',
    '        <a href="/ai-operating-systems.html">AI Operating Systems</a>',
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
    '        <a href="/blog/">Blog</a>',
    '        <a href="/#book-a-call">Contact Us</a>',
    '        <a href="/strategy-call.html">Book a Call</a>',
    '        <a href="/privacy-policy-aifa.html">Privacy Policy</a>',
    '        <a href="/terms.html">Terms &amp; Conditions</a>',
    '        <a href="/earnings-disclaimer.html">Earnings Disclaimer</a>',
    '      </div>',
    '    </div>',
    '    <div class="aifa-footer-bottom">',
    '      <div>',
    '        <p>&copy; 2026 AI Fusion Automations. All rights reserved.</p>',
    '        <p><a href="mailto:grant@aifusionautomations.com">grant@aifusionautomations.com</a> <span aria-hidden="true">&middot;</span> Customer service: <a href="tel:+447480488817">+44 7480 488817</a> <span aria-hidden="true">&middot;</span> <a href="tel:+447588711912">+44 7588 711912</a></p>',
    '        <p>Built with AI</p>',
    '      </div>',
    '      <div class="aifa-footer-social" aria-label="Social links">',
    '        <a href="https://x.com/ai_fusion_auto" aria-label="AI Fusion Automations on X">X</a>',
    '        <a href="https://www.linkedin.com/company/ai-fusion-automations/" aria-label="AI Fusion Automations on LinkedIn">in</a>',
    '        <a href="https://www.facebook.com/aifusionautomations" aria-label="AI Fusion Automations on Facebook">f</a>',
    '        <a href="https://www.youtube.com/@AIFusionAutomations" aria-label="AI Fusion Automations on YouTube">&#9658;</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('');

  function isLegacyNav(element) {
    if (!element || element.id === 'aifa-nav-mount' || element.classList.contains('aifa-global-nav')) {
      return false;
    }

    if (element.matches('body > nav.nav, body > nav.site-nav, body > .mobile-menu')) {
      return true;
    }

    if (element.matches('body > header')) {
      var text = element.textContent || '';
      return Boolean(element.querySelector('nav')) && /Home|Products|Pricing|Book a Call|Free Tools|Services/.test(text);
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

  function initNav(nav) {
    var toggle = nav.querySelector('.aifa-nav-toggle');
    var menu = nav.querySelector('.aifa-nav-menu');

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      if (!isOpen) closeDropdowns(nav);
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
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        closeDropdowns(nav);
      }
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        closeDropdowns(nav);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        closeDropdowns(nav);
      }
    });
  }

  function render() {
    if (!document.body) {
      return;
    }

    var footerOnly = document.body.hasAttribute('data-aifa-footer-only');
    document.body.classList.add('aifa-nav-ready');
    if (footerOnly) {
      document.body.classList.add('aifa-footer-only');
      document.documentElement.classList.add('aifa-footer-only-root');
    }

    if (!footerOnly && !document.querySelector('.aifa-global-nav')) {
      removeLegacyNav();
    }
    removeLegacyFooters();

    if (!footerOnly && !document.querySelector('.aifa-global-nav')) {
      var mount = document.getElementById('aifa-nav-mount');
      if (!mount) {
        mount = document.createElement('div');
        mount.id = 'aifa-nav-mount';
        document.body.insertBefore(mount, document.body.firstChild);
      }

      mount.innerHTML = navMarkup;
      initNav(mount.querySelector('.aifa-global-nav'));
    }

    var footerMount = document.getElementById('aifa-footer-mount');
    if (!footerMount) {
      footerMount = document.createElement('div');
      footerMount.id = 'aifa-footer-mount';
      document.body.appendChild(footerMount);
    }

    footerMount.innerHTML = footerMarkup;
    loadAifaChatWidget();
  }

  function shouldSkipAifaChatWidget() {
    var path = window.location.pathname || '';
    if (document.body.hasAttribute('data-aifa-no-chat-widget')) {
      return true;
    }

    return path === '/strategy-call.html' ||
      path === '/book.html' ||
      path === '/ai-systems-snapshot.html' ||
      path === '/ai-workflow-call-request.html';
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
