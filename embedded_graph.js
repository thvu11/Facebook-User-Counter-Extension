$(document).ready(function() {
    var data = [];
    var label = [];

    var csv_time_export = [];
    var csv_online_export = [];

    var limit = 10; // only display 10 most recent values on the graph

    // listen for message from contentScript and then re-render the graph
    var max_online_people = -1;
    var max_time_stamp;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        console.log(request);
        if (request.graph == '1') {

            var time_obj = new Date();

            // format timestamp
            var hour = time_obj.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }
            var minute = time_obj.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }
            var current_timestamp = hour + ":" + minute;

            if (data.length == limit) {
                data.shift();
                label.shift();
            }

            // render graph
            data.push(request.online_people);
            label.push(current_timestamp);
            renderGraph(data, label);

            // storing for csv export
            csv_time_export.push(current_timestamp);
            csv_online_export.push(request.online_people);
            export_csv(csv_online_export, csv_time_export);

            // render label for most online time
            if (Number(request.online_people) >= Number(max_online_people)) {
                max_online_people = request.online_people;
                max_time_stamp = time_obj.getDate() + "/" + time_obj.getMonth() + "/" + time_obj.getFullYear() + " - " + current_timestamp;
                $("#most_online").text(max_online_people);
                $("#online_time").text(max_time_stamp);
            }
        }
    });
});

function renderGraph(data, label) {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            //labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            labels: label,
            datasets: [{
                data: data,
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    });
}

function export_csv(online_people, timestamp) {
    var column_delimiter = ",";
    var line_delimiter = '\n';

    var result = '';
    result += line_delimiter;
    for (var i = 0; i < online_people.length; i++) {
        result += timestamp[i] + column_delimiter + online_people[i] + line_delimiter;
    }
    result += line_delimiter;

    var filename = "export.csv";
    result = 'data:text/csv;charset=utf-8,' + result;
    var data = encodeURI(result);
    $("#export_btn").attr("href", data);
    $("#export_btn").attr("download", filename);
}
