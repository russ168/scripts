import requests
import json
import time
import datetime

all_the_text = open('big-xml-Athens.xml').read()
project = 'nelo2-test-highlight'
host = '10.34.130.31'
port = '9200'
indices = ['2013-05-20', '2013-05-21', '2013-05-22']
for i in range(0, 1000):
	for index in indices:
		url = 'http://' + host + ':' + port + '/nelo2-log-' + index + '/' + project + '?routing=' + project
		log = {
			"projectName" : project,
			"projectVersion" : "1.0.0",
			"host" : "127.0.0.1",
			"logType" : "insert",
			"logSource" : "CrashDump",
			"body" : all_the_text,
			"errorCode" : "ServerChangeLogBO",
			"logTime" : int(datetime.datetime.strptime(index, '%Y-%m-%d').strftime("%s"))*1000,
			"logLevel" : "INFO"
			}
		r = requests.post(url, data=json.dumps(log))
		print r.text