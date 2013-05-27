/*
 * ES data insert
*/

//var INSERT_INDEX = "test";
//var INSERT_PROJECT = "type";

var DATES = ["2013-05-19",
"2013-05-20", "2013-05-21","2013-05-22","2013-05-23","2013-05-24","2013-05-25","2013-05-26",
"2013-05-27", "2013-05-28","2013-05-29","2013-05-30"];
var INSERT_PROJECT = "jackie_test";

// ////////////////////////////////////////
var INSERT_NUMBER = 1;
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

var bodys = ["xsflsy02.sa.nhnsystem.com", 
	"nomad::Job::ReturnAnswer:163", 
	"2013-01-10 06:29:07 +0000",
	"dbo.CFT_MEMBERLOG_MONTH_2'에 중복 키를 삽입할 수 없습니다. 중복 키 값은 (25400919, danmae)입니다.",
	"This is body test for -123456",
	"This is test for abc word",
	"abcdfjlskjfdlkjfdlkasjdflajdfsajsfdajdfjalkfjdsfjasldfjlsjfdlaksjfdlkasjfsfjslfskfjslfjslfjalsdfjlaksjdflkasjdfkjaldfjoiweuroiweutoiweufosdjfoksjfoiweiowefoifwfhfweroi",
	"User Contact Account Log",
	"argument는 integer 또는 Club 객체이어야 합니다",
	"<27>smbd[6751]: [2012/10/30 15:54:41, 0]printing/print_cups.c:cups_connect(69)",
	"abc efg test data",
	"displayImageWithImage:animationWith",
	"이미지 test",
	"를를",
	"[Agent]naverbookmarkcrawler",
	"trid(-123456)",
	"UserID=14guswnd",
	"NNB=ULPUSFCVXBNFC NB=GYYDSNJYGIYTEMBW npic=SFCuenZVHbx0RFZFoh+a0WALs7qRAYM/3vD26gfSTs4O8u/7rIqsl9I5OnJV9LgnCA page_uid=RT+2zc5Y7tlssvof8wCsssssstZ-140745 BMR= nid_inf=438366115 NID_MATCH_M=1 NID_AUT=95R9DDUsQ6SpQrid2Qpfe0s5BsyH6VRO0jBmpZ/Nmq4TrgPddxY8gUzhTVFyhECwFBBH6tnpd8YslNUK+ARdKEOJSwxM7HOspmslEoVHHHDgTqdfF60lI8opO9JKWVFaAnswVnIFNHTdHUdaCeFvSQ NID_SES=AAABRQjdQk1opAW5ceebr50CEmXN7HrzMrImW4FrXlJACJ1QU2fYDyjIpO/cO/2/+iM0BwZTnLgX4EClbkFwar9MJDr/+0dfX91dMvXV+8WuyiCiWxCWd4FwrsCMHcXthwQGV+C1bCrbU+5C/qeOeGuJCGwVt769y8+Tuy+KBuTGbKDMuUF/SyRq5IwNQ3YL1pMGs+cAnFN2xqFplgJtZvlhI8+8f3GfMxZqEHlXmSSlSpCWkZZYzz9wx2WarU+WtU4WGpnW0Y+Kc347mW2mNaVIDq+AHf4HXE8JHsPqvlzNWlkyS5AHw3tc5bWFy0MhxngOnyG7VqTheb4yxPRhTY0D6fF4TDPr7fjsJ5tuA9oxH+BGuoy6uYIs8uoRI1+HULgI0WCQpiNeVtI1eskacsENBnqECJ3OOyAFzAcr9msv7pr8LYtx0TsNVlLWVS7ug1uH5w ncvid=#vid#_118.217.45.216p3Lj WMONID=DEZg20K2BGS ncvc2=7c1ce4c094a2a31133c5b88ab14e2e56eda35ebba8bf21da60ba865aeeca2ee728d016cd172bbf93e37c2bf73b9136e8073a1f11e2d0ab9cf43394518fbf0ec3adaba8a9b6abb4aba4a0a3a4a1a6b615 nci4=0337dafeeaa7c87a25cb8c9b96771b78d997768ada8665b7478abf4dfaff3ac3c336f650f4ba5c697e8fb3613570e67cd88ff44bafb0f9e0ca00aa61b78337fa95b1bc9bba8bb9b7b691b485cdbeae8da997b3aba285a091e6919cbc98a9ea9c93b78ebff2838aad88b9878b82a580ce8083848988888b8cb9 JSESSIONID=E365D0634FED26492BFFD5DEEE789B66 personaconmain|ektmfrl645=AE8BC98FD74D619FF7B13C83191E1F5EAFCD0F25C43D6BDC693E26D777419A2F845E79DA02B04219 personacon|ektmfrl645= cafeCookieToken=5KCBru-K8k8aHwkbio4dPmLlMyK6WlPYqN0319U4UeImDS9UVPpo70IVLHK9eybq6eJc-rNfllMgB5Fk_i2j-rKM1mCuoOqZ ncu=82b94171693746ae8766724d5696dc1a83e17aed"
	];


for (var j = 0, len2 = DATES.length; j < len2; j++) {
	for (var i = 0, len = bodys.length; i < len; i++) {
		var json = {
			"projectName" : INSERT_PROJECT,
			"projectVersion" : "1.0.0",
			"host" : "127.0.0.1",
			"logType" : "insert-type",
			"logSource" : "CrashDump",
			"logLevel" : "INFO",
			"body" : bodys[i],
			"errorCode" : "ServerChangeLogBO",
			"logTime" : new Date(DATES[j]).getTime(),
			"DmpData" : "DmpData"

		};
		insertData(DATES[j], json);
	}
}


/*
var count = 1000;

for (var i = 0; i < count; i++) {
	var json = {
		"projectName" : INSERT_PROJECT,
		"projectVersion" : "1.0.0",
		"host" : "127.0.0.1",
		"logType" : "insert",
		"logSource" : "CrashDump",
		"body" : "test_" + i,
		"errorCode" : "ServerChangeLogBO",
		"logTime" : new Date().getTime(),
		"logLevel" : "INFO"
	};
	insertData(json);
};
*/
