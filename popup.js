// JS for popup.html

$(document).ready(function() {
    $("#start").click(function() {
        console.log("popup start");
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var active_tab = tabs[0];
            chrome.tabs.sendMessage(active_tab.id, { msg: "start"});
        });
        $("#stop").prop('disabled', false);
        $(this).prop('disabled', true);
    });

    $("#stop").click(function() {
        console.log("popup stop");
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var active_tab = tabs[0];
            chrome.tabs.sendMessage(active_tab.id, { msg: "stop"});
        });

        $(this).prop('disabled', true);
        $("#start").prop("disabled", false);
    });
});

