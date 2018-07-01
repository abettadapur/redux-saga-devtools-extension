(function () {
    chrome.devtools.panels.create("Redux Saga Dev Tools",
        "",
        "panel.html",
        function (panel) {
            console.log("Panel created");
        }
    )
})();