/*
 * ES data insert
*/

var http = require("http");
var moment = require("moment");

// ////////////////////////////////////////
var INSERT_SERVER = {
	"host" : "10.34.130.31",
	"port" : "9200",
	"auth" : "admin:vmfhwprxmspffh2",

};

// ////////////////////////////////////////

function insertData(date, json) {
	var req = http.request({
		host : INSERT_SERVER.host,
		port : INSERT_SERVER.port,
		auth : INSERT_SERVER.auth,
		path : '/' + date + "/" + INSERT_PROJECT + "?routing=" + INSERT_PROJECT,
		method : 'post',
		headers : {
			"Content-Type" : "application/json"
		}
	}, function(res) {
		var allData = [];
		res.on('data', function(data) {
			allData.push(data);
		});
		res.on('end', function(data) {
			allData.push(data);
			console.log(allData.join(''));
		})
	});

	req.on('error', function(err) {
		console.log(err);
	})

	req.write(JSON.stringify(json));

	req.end();
}

var INSERT_PROJECT = "nelo2-es-stats";

var times = [
moment("2013-05-01T00:00:00"),
moment("2013-05-01T01:00:00"),
moment("2013-05-01T02:00:00"),
moment("2013-05-02T00:00:00"),
moment("2013-05-02T01:00:00"),
moment("2013-05-02T02:00:00"),
moment("2013-05-03T00:00:00"),
moment("2013-05-03T01:00:00"),
moment("2013-05-03T02:00:00"),
moment("2013-05-04T00:00:00"),
moment("2013-05-04T01:00:00"),
moment("2013-05-04T02:00:00"),
moment("2013-05-05T00:00:00"),
moment("2013-05-05T01:00:00"),
moment("2013-05-05T02:00:00"),
moment("2013-05-06T00:00:00"),
moment("2013-05-06T01:00:00"),
moment("2013-05-06T02:00:00")

	];


for (var i = 0, len = times.length; i < len; i++) {
	console.log(times[i].format("YYYY-MM-DDTHH:mm:SS"));
	console.log(times[i].valueOf());
	var json = {
		"projectName" : INSERT_PROJECT,
		"projectVersion" : "1.0.0",
		"host" : "xseed021.kdev",
		"logLevel" : "INFO",
		"logType" : "es",
		"logSource" : "es",
		"logTime" : times[i].valueOf(),
		"logCount" : 1,
		"logError" : 0,
		"logLoss" : 0,
		"logSize" : 1
	};
	//insertData("nelo2-log-"+times[i].format("YYYY-MM-DD"), json);
}

