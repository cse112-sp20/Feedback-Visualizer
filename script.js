/**
 *  A class to represent a Person.
 * @class
 *
 * @constructor
 *
 * @property   {number} id A unique id for the Person
 * @property   {String} firstName the first name of the Person
 * @property   {String} lastName the last name of the Person
 * @property   {String} email the email of the Person
 * @property   {number} teamId the unique id for the team the Person is in
 * @property   {Object[]} feedbacks an array of feedback objects for the Person
 */
function Person(id, firstName, lastName, email, teamId) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.teamId = teamId;
    this.feedbacks = {};
}

/**
 *  A class to represent Feedback given to a Person.
 * @class
 *
 * @constructor
 *
 * @property   {number} reviewerId A unique id for the Person that is giving the review
 * @property   {number} questionId A unique id for the question the reviewer is giving
 * @property   {number} week The week the revieweris giving the feedback
 * @property   {number} score The score of the feedback
 */
function Feedback(reviewerId, questionId, week, score) {
    this.reviewerId = reviewerId;
    this.questionId = questionId;
    this.week = week;
    this.score = score;
}

/**
 *  A class to represent a Question.
 * @class
 *
 * @constructor
 *
 * @property   {number} id A unique id for the question
 * @property   {String} name The label of the question
 */
function Question(id, name) {
    this.id = id;
    this.name = name;
}

/**
 * A class to represent a Team.
 * @class
 *
 * @constructor
 *
 * @property   {number} id A unique id for the Team
 * @property   {Object} members A list of Person objects
 */
function Team(id) {
    this.id = id;
    this.members = {};
}

// Generate fake data

var questions = {};
questions[0] = new Question(0, "Communication / Professionality");
questions[1] = new Question(1, "Collaboration / Team Contribution");
questions[2] = new Question(2, "Effort / Personal Contribution");
questions[3] = new Question(3, "Role Sharing / Proactivity");
questions[4] = new Question(4, "Energy / Team Morale");
questions[5] = new Question(5, "Overall Satisfaction");

var numberOfQuestions = Object.keys(questions).length;

var numberOfTeams = 2;
var numberOfMembers = 4;

var teams = {};

var i, j, k, l, m;

k = 0;
for (i = 0; i < numberOfTeams; i++) {
    teams[i] = new Team(i);
    for (j = 0; j < numberOfMembers; j++) {
        teams[i].members[k] = new Person(
            k,
            "ftest" + k,
            "ltest" + k,
            "test" + k + "@gmail.com",
            i
        );
        k++;
    }
}

var team, member, members, feedbacks;
var weeks = [5, 6, 7, 8, 9, 10];
var numberOfWeeks = weeks.length;

for (team in teams) {
    // 2
    members = teams[team].members;
    for (member in members) {
        // 4
        feedbacks = members[member].feedbacks;
        for (j in members) {
            // 4
            for (k = 0; k < numberOfQuestions; k++) {
                // 6
                for (i = 0; i < numberOfWeeks; i++) {
                    // 6
                    if(feedbacks[questions[k].name] === undefined)
                    {
                    	feedbacks[questions[k].name] = [];
                    }
                    feedbacks[questions[k].name].push(new Feedback(j, questions[k], weeks[i], Math.round(Math.random() * 5)));
                }
            }
        }
    }
}

// Generate visualization with data
var numberOfCells = 8;
var tableBody = document
    .getElementById("myTable")
    .getElementsByTagName("tbody")[0];

// Build table body
for (team in teams) {
    members = teams[team].members;
    for (member in members) {
        var newRow = tableBody.insertRow();
        var cells = [];
        var cellContents = [];
        cellContents.push(document.createTextNode(team));
        cellContents.push(document.createTextNode(members[member].firstName));

        var chartDivArr = [];
        for (question in questions) {
        		var questionObj = questions[question];
            var chartDiv = document.createElement("div");
            chartDiv.setAttribute("id", "my-chart-member-" + member + "-question-" + questionObj.id);
            chartDiv.setAttribute("class", "charts");
            cellContents.push(chartDiv);
        }
        for (k = 0; k < numberOfCells; k++) {
            cells.push(newRow.insertCell(k));
            cells[k].appendChild(cellContents[k]);
        }
    }
}

// defining charts
var myConfig = [];

var averageScores, trend;
var weekOffset = 5;

for (team in teams) {
    members = teams[team].members;
    for (member in members) {
        feedbacks = members[member].feedbacks;
				
        //console.log(feedbacks)
        for (k = 0; k < numberOfQuestions; k++) {
            var question = questions[k];
            
            if (myConfig[member] === undefined) {
            	myConfig[member] = {};
            }
            
            myConfig[member][question.name] = {
                type: "line",
                legend: {},
                plotarea: {
                    "margin-right": "10%",
                    "margin-top": "5%",
                },
                "scale-y": {
                    label: {
                        text: "score" + member,
                    },
                },
                "scale-x": {
                    label: {
                        text: "Week"
                    },
                    labels: [5, 6, 7, 8, 9, 10],
                },
                series: [],
            };

     
            scores = [];
            // sum up all the scores in one week for one question
            for(j = 0; j < numberOfWeeks; j++) {
            		scores.push(feedbacks[question.name][j].score);
            		averageScores += feedbacks[question.name][j].score;
            }
						
            averageScores /= numberOfWeeks;
            
            
            myConfig[member][question.name].series.push({
              values: scores,
              text: 'Scores'
            });
/*             
            myConfig[member][question.name].series.push({
                type: "line",
                aspect: "spline",
                marker: {
                    visible: false
                },
                "line-width": 5,
                "line-style": "dotted",
                values: trendline,
                text: "Trendline",
            });  */
        }
    }
}

// render the charts
for (team in teams) {
    members = teams[team].members;
    for (member in members) {
        for (question in questions) {
        		var questionObj = questions[question];
            zingchart.render({
                id: "my-chart-member-" + member + "-question-" + questionObj.id,
                data: myConfig[member][questionObj.name],
                height: "100%",
                width: "100%",
            });
        }
    }
}