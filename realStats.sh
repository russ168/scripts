#!/bin/bash
curl -u admin:vmfhwprxmspffh2 -XGET 10.98.213.75:10200/_nodes/stats?all=true|node esStats.js

