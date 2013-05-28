from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from scanProxies.items import ScanproxiesItem

class Dai_Spider(BaseSpider):
    name = "51dai.li"
    allowed_domains = ["51dai.li"]
    start_urls = [
        "http://51dai.li/http_fast.html"
    ]

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        trs = hxs.select("//table/tr")
        items = []
        for tr in trs[1:]:
            host = tr.select('td[2]/text()').extract()[0]
            port = tr.select('td[3]/text()').extract()[0]
            print host, port
            item = ScanproxiesItem()
            item['host'] = host
            item['port'] = port
            items.append(item)
        return items
            #filename = response.url.split("/")[-2]
            #open(filename, 'wb').write(response.body)
        