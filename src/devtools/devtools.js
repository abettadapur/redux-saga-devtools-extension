(function () {
    chrome.devtools.panels.create("Redux Saga",
        "",
        "panel.html",
        function (panel) {
            console.log("Panel created");
        }
    )
})();