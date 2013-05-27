/*
 * ES data insert
*/

//var INSERT_INDEX = "test";
//var INSERT_PROJECT = "type";

fs = require('fs');

var DATES = [
//"2013-05-01", "2013-05-02","2013-05-03","2013-05-04","2013-05-05","2013-05-06","2013-05-07",
//"2013-05-08", "2013-05-09","2013-05-10","2013-05-11","2013-05-12","2013-05-13","2013-05-14",
//"2013-05-15", "2013-05-16","2013-05-17","2013-05-18","2013-05-19",
"2013-05-20","2013-05-21","2013-05-22","2013-05-23","2013-05-24","2013-05-25"
//,"2013-05-26","2013-05-27","2013-05-28",
//"2013-05-29","2013-05-30","2013-05-31"
];

var INSERT_PROJECT = "jackie_test";

var file = "";

// ////////////////////////////////////////
var INSERT_NUMBER = 1000;
var INSERT_SERVER = {
	"host" : "10.34.130.31",
	"port" : "9200",
	"auth" : "admin:vmfhwprxmspffh2",

};

// ////////////////////////////////////////
var http = require("http");

function insertData(date, json) {
	var req = http.request({
		host : INSERT_SERVER.host,
		port : INSERT_SERVER.port,
		auth : INSERT_SERVER.auth,
		path : '/nelo2-log-' + date + "/" + INSERT_PROJECT + "?routing=" + INSERT_PROJECT,
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


fs.readFile('big-xml-Athens.xml', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  for (var j = 0, len2 = DATES.length; j < len2; j++) {
	for (var i = 0; i < INSERT_NUMBER; i++) {
		console.info(DATES[j]);
		console.info(new Date(DATES[j]).getTime());
	var json = {
		"projectName" : INSERT_PROJECT,
		"projectVersion" : "1.0.0",
		"host" : "127.0.0.1",
		"logType" : "insert",
		"logSource" : "CrashDump",
		//"body" : data,
		"errorCode" : "ServerChangeLogBO",
		"logTime" : new Date(DATES[j]).getTime(),
		"logLevel" : "INFO"
	};
	
	//insertData(DATES[j], json);
}
}

  
});
