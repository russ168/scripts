#!/bin/bash
curl -u admin:vmfhwprxmspffh2 -XGET 10.98.213.73:10200/_nodes > real_nodes.txt
curl -u admin:vmfhwprxmspffh2 -XGET 10.98.213.73:10200/_status| node esStatus.js -f real_nodes.txt
