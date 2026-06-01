(function () {
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
    '      <li><a class="aifa-nav-link aifa-nav-cta" href="/strategy-call.html">Book a Call</a></li>',
    '    </ul>',
    '  </div>',
    '</nav>'
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
    if (!document.body || document.querySelector('.aifa-global-nav')) {
      return;
    }

    document.body.classList.add('aifa-nav-ready');
    removeLegacyNav();

    var mount = document.getElementById('aifa-nav-mount');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'aifa-nav-mount';
      document.body.insertBefore(mount, document.body.firstChild);
    }

    mount.innerHTML = navMarkup;
    initNav(mount.querySelector('.aifa-global-nav'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
