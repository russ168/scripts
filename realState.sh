#!/bin/bash
curl -u admin:vmfhwprxmspffh2 -XGET '10.98.213.75:10200/_cluster/state?pretty&filter_indices&filter_blocks&filter_metadata' | node esState.js

