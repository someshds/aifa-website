(function () {
  "use strict";
  var FORM_ID = "t4FnzGSw0lcb4l1PFx8q";
  var ORIGIN = "https://link.aifusionautomations.com";
  var frame = document.getElementById("inline-" + FORM_ID);
  if (!frame) return;

  var submitted = false;
  window.addEventListener("message", function (event) {
    if (submitted || event.origin !== ORIGIN || event.source !== frame.contentWindow) return;
    if (Array.isArray(event.data) && event.data[0] === "set-sticky-contacts") {
      submitted = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "generate_lead", form_id: FORM_ID, page_path: location.pathname });
    }
  });

  frame.addEventListener("load", function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_view", form_id: FORM_ID, page_path: location.pathname });
  }, { once: true });
})();
