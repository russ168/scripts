//# !/usr/bin /env node
var fs = require( 'fs');
var http = require("http");
//var file = __dirname + '/test.json';
Array.prototype.getUnique = function() {
    var o = {}, a = []
    for (var i = 0; i < this.length; i++) o[this[i]] = 1
    for (var e in o) a.push(e)
    return a
}
	
function parseStatus(json, nodesInfo ) {
       //console.log("################status is:" + JSON.stringify(json));

       //console.log("////////////////////// nodesInfo is:" + JSON.stringify(nodesInfo));
       var result = {};
       result.initShards = [];
       result.startedShards = [];
       result.indices = [];
       result.failures = [];
       result.failed = json._shards.failed;
       result.failures = json._shards.failures;       
       
       var indices = json.indices;
       //console.log("################indices is:" + JSON.stringify(indices));
       for(var indexName in indices){
       		var json1 = {};
       		json1.index = indexName;
       		json1.size = indices[indexName].index.primary_size;
       		json1.docs = indices[indexName].docs.num_docs;
       		result.indices.push(json1);
       		var shards = indices[indexName].shards;
       		for(var shardNumber in shards){
       			var shard = shards[shardNumber];      			
       			for(var i=0,len=shard.length;i<len;i++){
       				var replica = shard[i];
       				var routing = replica.routing;
       				//console.log("################indices is:" + JSON.stringify(routing));
       					var json2 = {};
       					//console.log("############# init replica is:" + JSON.stringify(replica));
       					json2.node = JSON.stringify(find(routing.node, nodesInfo));
       					json2.primary = routing.primary;
       					json2.shard = routing.shard;
       					json2.index = routing.index;
       					json2.size = replica.index.size;
       					if(routing.state == "INITIALIZING"){       				
       						result.initShards.push(json2);
       					}/*else if(routing.state == "STARTED"){
       						result.startedShards.push(json2);
       					}*/
       				
       			}
       		}	
       }
       return result;
};

function find(node, json) {
	var nodes = json.nodes;
	if(nodes[node]){
		var ajson = nodes[node];
		return {name:ajson.name, ip:ajson.transport_address.match(/inet\[\/(.*)\]/)[1]};
		//return ajson;
	}
};

var nodesInfo;
if (process.argv[2] == "-f") {
      var file = process.argv[3];
      fs.readFile(file, 'utf8', function (err, data) {
             if(err) {
                  console .log('Error: ' + err);
                   return;
            }
            nodesInfo = JSON.parse(data);
      });
}

var input = [];
process.stdin.resume();
process.stdin.setEncoding( 'utf8');

process.stdin.on( 'data', function (chunk) {
  //process.stdout.write( 'data: ' + chunk);
  input.push(chunk);
});

process.stdin.on( 'end', function (chunk) {
  process.stdout.write( 'end');
  input.push(chunk);
  var json = JSON.parse(input.join( ""));
  result = parseStatus(json, nodesInfo);
  console.dir(result);
});
