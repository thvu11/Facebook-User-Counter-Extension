// contentScript modifies online user on https://www.facebook.com/

$(document).ready(function() {
    var count = 0;
    var timerID;
    //var timerID = setInterval(function() {
    //    console.log("online people " + $("#fbDockChatBuddylistNub > a.fbNubButton > span.label > span.count").text());
    //    count++;
    //}, 30 * 1000);

    //if (count == 5) {
    //    clearInterval(timerID);
    //}

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

        if (request.msg == "start" && typeof timerID === 'undefined') {
            // inject directly into facebook.com
            var iFrame = document.createElement("iframe");
            iFrame.src = chrome.extension.getURL('embedded_graph.html');
            iFrame.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
                           'width:100%;height:30%;z-index:1000;';
            document.body.insertBefore(iFrame, document.body.firstChild);

            // set the counter
            timerID = setInterval(function() {
                // scrape data directly from facebook sidebar
                console.log("online people " + $("#fbDockChatBuddylistNub > a.fbNubButton > span.label > span.count").text());
                var online_people = $("#fbDockChatBuddylistNub > a.fbNubButton > span.label > span.count").text();
                count++;

                // send data to embedded_graph.js
                chrome.runtime.sendMessage({ graph: 1, online_people: online_people.replace(/\(|\)/g, ''), timestamp: new Date()});

                //terminateCount(timerID, count);
            }, 60 * 1000); // 60s interval

        } else if (request.msg == "stop" && typeof timerID !== 'undefined') {
            clearInterval(timerID);
        }
    });
});

function terminateCount(time_obj, count) {
    if (count == 10) {
        clearInterval(timerID);
    }
}

