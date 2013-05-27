import requests
from bs4 import BeautifulSoup

def findProxies():
	servers = ["http://51dai.li/http_fast.html"]
	proxies = []
	for server in servers:
		r = requests.get(server)
		soup = BeautifulSoup(r.text)
		#print soup.prettify()
		table = soup.table
		trs = table.find_all('tr', recursive=False)
		for tr in trs[1:]:
			#print tr
			tds = tr.find_all('td', recursive=False)
			host = tds[1].string
			#print host
			port = tds[2].string
			#print port
			dict1 = {"http": "http://" + host + ":" + port}
			proxies.append(dict1)
	#print proxies	
	return proxies
			

def verifyProxies():
	proxies = findProxies()
	goodProxies = []
	for proxy in proxies:
		print "trying:" + proxy["http"]
		try:
			r = requests.get("http://www.baidu.com", proxies=proxy, timeout=10)
			print r.status_code
			if r.status_code == 200:
				print "find one good proxy:" + proxy["http"]
				goodProxies.append(proxy)
		except:
			print "bad proxy:" + proxy["http"]
			pass
		
	print goodProxies
	return goodProxies

			
verifyProxies()		