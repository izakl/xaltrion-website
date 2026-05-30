// Xaltrion AI - Crisp support chat
// Replace CRISP_WEBSITE_ID with your actual ID from crisp.chat dashboard.
window.$crisp = window.$crisp || [];
window.CRISP_WEBSITE_ID = "b78103a3-e6d9-4bed-a65f-e3376dfee79e";

(function loadCrisp() {
    if (!window.CRISP_WEBSITE_ID || window.CRISP_WEBSITE_ID.indexOf("REPLACE_WITH") === 0) {
        return;
    }
    var d = document;
    var s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
})();
