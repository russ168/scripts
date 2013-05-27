//# !/usr/bin /env node
var fs = require( 'fs');
//var file = __dirname + '/test.json';
Array.prototype.getUnique = function() {
    var o = {}, a = []
    for (var i = 0; i < this.length; i++) o[this[i]] = 1
    for (var e in o) a.push(e)
    return a
}

function findMaster(json){
	var master_node = json.master_node;
	var nodes = json.nodes;
	return nodes[master_node];
}

function parseState(json ) {
       //console.log("json is:" + JSON.stringify(json));
       var result = {};
       
       var cluster_name = json.cluster_name;
       var master_node = findMaster(json);
       var metadata = json.metadata;
       var indices = json.indices;
       for(var indexName in indices){
       		var index = indices[indexName];
       		var mappings = index.mappings;
       		for(var typeName in mappings){
       			var mapping = mappings[typeName];
       		}
       }
       
       var unassigned_indices = [];
       //result.unassigned_indices = unassigned_indices;
       //var indices = json.metadata.indices;
       //var routing_table = json.routing_table;
       var routing_nodes = json.routing_nodes;
       var unassigned = routing_nodes.unassigned;
       //return unassigned;
       var len = unassigned.length;
       for(var i=0;i<len;i++){
       		/*{
state: UNASSIGNED
primary: false
node: null
relocating_node: null
shard: 0
index: nelo2-log-2013-01-29
}*/		
			var oneJson = unassigned[i];
			unassigned_indices.push(oneJson.index);
       }
       result.unassigned_shards_total = len;
       result.unassigned_indices =  unassigned_indices.getUnique();
       return result;
};

if (process.argv[2] == "-f") {
       var file = process.argv[3];
      fs.readFile(file, 'utf8', function (err, data) {
             if(err) {
                  console .log('Error: ' + err);
                   return;
            }
            json = JSON.parse(data);
            result = parseStats(json);
            console.dir(result);
             return;
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
  result = parseState(json);
  console.dir(result);
});
