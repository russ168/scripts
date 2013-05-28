# Scrapy settings for scanProxies project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/topics/settings.html
#

BOT_NAME = 'scanProxies'

SPIDER_MODULES = ['scanProxies.spiders']
NEWSPIDER_MODULE = 'scanProxies.spiders'

ITEM_PIPELINES = [
    'scanProxies.pipelines.verifyPipeline',
    'scanProxies.pipelines.JsonWriterPipeline',
]
# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'scanProxies (+http://www.yourdomain.com)'
