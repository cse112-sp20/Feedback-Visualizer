let jsonObj = '{"Responses": [{"Timestamp":"5/6/2020 15:06:33", "Email Address":"aachpal@ucsd.edu", "id": "12", "team": "7", "Week": "6", "feedback": {"q1": [1,1,1,1,1], "q2": [2,2,2,2,2]}},\
                                 {"Timestamp":"5/6/2020 15:06:33", "Email Address":"aachpal@ucsd.edu", "id": "5", "team": "2", "Week": "6", "feedback": {"q1": [3,3,3,3,3], "q2": [5,5,5,5,5] } } ]}';

let metrics;
let chart_series = [];
let obj = JSON.parse(jsonObj);
let emails = new Array();
let team_ids = {}
for(let i = 0; i<obj.Responses.length;i++){

    res = obj.Responses[i];
    rec_id = res["id"]
    team_num = res["team"]
    feedback = res["feedback"]
    metrics = Object.keys(feedback)

    //initialize chart and meta data
    if(!(team_num in chart_series)){
        chart_series[team_num] = {}
        team_ids[team_num] = [rec_id]
    }
    else{
        team_ids[team_num].push(rec_id)
    }

    //make list of every individual response
    avgs = []
    for(question in feedback){
        ratings = feedback[question]
        avgs.push(avg(ratings))
    }
    chart_series[team_num] = [{"values": avgs}]
    }

charts = {};
for(team_id in chart_series){
    chart_config = {
        type: "heatmap",
        'scale-y': {
            mirrored: true    //Flips data so that rows appear from top to bottom.
        },
        title: {
            //text: "Response Variance",
            adjustLayout: true
        },
        plotarea:{
            margin:"dynamic"
        },
        'scale-y':{
            labels: [""],//[person],
            guide:{
                visible:false
            }
        },
        'scale-x':{
            labels:metrics,
            autofit:true,
            guide: {
                visible: false
            },
            placement:"opposite"
        },
        plot: {
            'border': "1px",
            rules: [
                {
                    rule: "%v == 5",
                    'background-color': "#005b96"
                },
                {
                    rule: "%v == 4",
                    'background-color': "#6497b1"
                },
                {
                    rule: "%v == 3",
                    'background-color': "#b3cde0"
                },
                {
                    rule: "%v ==2",
                    'background-color': "#fd5c63"
                },
                {
                    rule: "%v == 1",
                    'background-color': "#D2122E"
                },
            ],
            'hover-state': {
                visible: false
            },
            aspect: "none"
        },
        series: chart_series[team_id]

    };
    charts[team_id] = chart_config;

} 


var numberOfCells = 3;
var tableBody = document
  .getElementById("myTable")
  .getElementsByTagName("tbody")[0];

// Build table body
for (team_id in charts) {
    var newRow = tableBody.insertRow();
    var cells = [];
    var cellContents = [];
    cellContents.push(document.createTextNode(team_id));
    cellContents.push(document.createTextNode(team_id));

    var chartDiv = document.createElement("div");
    chartDiv.setAttribute("id", "myChart" + team_id);
    chartDiv.setAttribute("class", "charts");

    cellContents.push(chartDiv);

    for (k = 0; k < numberOfCells; k++) {
        cells.push(newRow.insertCell(k));
        cells[k].appendChild(cellContents[k]);
    }

    console.log('going to render: ')
    console.log(charts[team_id])
    zingchart.render({
        id: "myChart" + team_id,
        data: charts[team_id],
        height: "100%",
        width: "100%",
        });
}


/*
graphs = {
    title: {
    text: "graph3"
    },
    graphset: charts
}
zingchart.render({
    id: 'myChart',
    data: graphs
});*/


//helper function, calculates variance of list
function avg(nums){
sum = 0
for(num in nums){
    sum += Number(nums[num])
}
sum = sum / nums.length
return Math.round(sum)
}