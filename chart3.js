let metrics;
let jsonObject = '{"Responses": [{"Timestamp":"5/6/2020 15:06:33", "Email Address":"aachpal@ucsd.edu", "id": "13", "team": "2", "Week": "6", "feedback": {"q1": [1,1,1,1,1], "q2": [2,2,2,2,2]}},\
                                    {"Timestamp":"5/6/2020 15:06:33", "Email Address":"aachpal@ucsd.edu", "id": "5", "team": "2", "Week": "6", "feedback": {"q1": [3,3,3,3,3], "q2": [5,5,5,5,5] } } ]}';

let chart_series = [];
let obj = JSON.parse(jsonObject);
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
    console.log(avgs)
    chart_series[team_num][rec_id] = [{"values": avgs}]
    }

console.log(chart_series)
charts = {};

//set each rec_id as its own chart
for(team_id in chart_series){
    charts[team_id] = {}
    for(rec_id in chart_series[team_id]){
        console.log(chart_series[team_id][rec_id])
        let chart_config = {
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
            series: chart_series[team_id][rec_id]

        };
        charts[team_id][rec_id] = chart_config;

    } 
}

//get html table
var numberOfCells = 3;
var tableBody = document
    .getElementById("myTable")
    .getElementsByTagName("tbody")[0];

//render charts into table
for(team_id in charts){
    for(rec_id in charts[team_id]){
        var newRow = tableBody.insertRow();
        var cells = [];
        var cellContents = [];
        cellContents.push(document.createTextNode(team_id));
        cellContents.push(document.createTextNode(rec_id));

        var chartDiv = document.createElement("div");
        chartDiv.setAttribute("id", "myChart" + rec_id);
        chartDiv.setAttribute("class", "charts");

        cellContents.push(chartDiv);

        for (k = 0; k < numberOfCells; k++) {
            cells.push(newRow.insertCell(k));
            cells[k].appendChild(cellContents[k]);
        }

        zingchart.render({
            id: "myChart" + rec_id,
            data: charts[team_id][rec_id],
            height: "100%",
            width: "100%",
            });
    }
}

/**
 * @function
 * This function returns the average of a list of numbers
 * 
 * @param {number} nums array of numbers
 */
function avg(nums){
    sum = 0
    for(num in nums){
        sum += Number(nums[num])
    }
    sum = sum / nums.length
    return Math.round(sum)
}