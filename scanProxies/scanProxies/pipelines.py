# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/topics/item-pipeline.html
from scrapy.exceptions import DropItem
import requests
import json
 
class verifyPipeline(object):
    def process_item(self, item, spider):
        proxy = {"http": "http://" + item['host'] + ":" + item['port']}                    
        print "trying:" + proxy["http"] 
        try:
            r = requests.get("http://www.baidu.com", proxies=proxy, timeout=10)
            print r.status_code
            if r.status_code == 200:
                print "Good proxy:" + proxy["http"]
                return item
            else:
                raise DropItem("response is not 200: %s" % item)
        except:
            raise DropItem("bad item %s" % item)

class JsonWriterPipeline(object):

    def __init__(self):
        self.file = open('items.jl', 'wb')

    def process_item(self, item, spider):
        line = json.dumps(dict(item)) + "\n"
        self.file.write(line)
        return item
    
class DuplicatesPipeline(object):

    def __init__(self):
        self.ids_seen = set()

    def process_item(self, item, spider):
        if item['id'] in self.ids_seen:
            raise DropItem("Duplicate item found: %s" % item)
        else:
            self.ids_seen.add(item['id'])
            return item
            
        