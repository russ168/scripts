//# !/usr/bin /env node
var fs = require( 'fs');
var commander = require('commander');
//var file = __dirname + '/test.json';
function buildJson() {
       //console.log("json is:" + JSON.stringify(json));
       var json = {};
              
       result.cluster_name = json.cluster_name;
       result.master_node = findMaster(json);
       result.initShards = [];
       if(index){result.types = getTypes(index, json);}
       
       var unassigned_indices = [];
       var routing_nodes = json.routing_nodes;
       var unassigned = routing_nodes.unassigned;
       var len = unassigned.length;
       for(var i=0;i<len;i++){
			var oneJson = unassigned[i];
			unassigned_indices.push(oneJson.index);
       }
       result.unassigned_shards_total = len;
       result.unassigned_indices =  unassigned_indices.getUnique();
       
       var indices = json.routing_table.indices;
       for(var indexName in indices){
       		var shards = indices[indexName].shards;
       		for(var shardNumber in shards){
       			var shard = shards[shardNumber];
       			for(var i=0,len=shard.length;i<len;i++){
       				var replica = shard[i];
       				if(replica.state == "INITIALIZING"){
       					var ajson = {};
       					//console.log("############# init replica is:" + JSON.stringify(replica));
       					ajson.node = JSON.stringify(find(replica.node, json));
       					ajson.primary = replica.primary;
       					ajson.shard = replica.shard;
       					ajson.index = replica.index;
       					result.initShards.push(ajson);
       				}
       			}
       		}
       		
       }
       return result;
};

/*	
if(process.argv[2] == "-index") {
	index = process.argv[3];
	if(process.argv[4] == "-types") {
		typesTag = 1;
	}
	if(process.argv[5] == "-mappings") {
		mappingsTag = 1;
	}
}
*/

commander
	.version('0.0.1')
	.usage('[options] [value ...]')
	.option('-i, --index <index>', 'index name')
	.option('-t, --types', 'print types or not')
	.option('-m, --mappings', 'print mappings or not')
	.option('-f, --file <file>', 'state json file')

var json;
var index;
var typesTag = 0;
var mappingsTag = 0;
var filename;
commander.parse(process.argv)	
index = commander.index;
typesTag = commander.types;
mappingsTag = commander.mappings;
filename = commander.file;

if(filename) {
	console.log("filename is:" + filename);
	fs.readFile(filename, 'utf8', function(err, data) {
		if(err) {
			console.log('Error: ' + err);
			return;
		}
		json = JSON.parse(data);
		//console.info("pared success:" + JSON.stringify(json));
		result = parseState(json);
		//console.info("pared success:" + JSON.stringify(json));
		console.dir(result);
	});
} else {
	console.log("NO filename");

	var input = [];
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data', function(chunk) {
		//process.stdout.write( 'data: ' + chunk);
		input.push(chunk);
	});

	process.stdin.on('end', function(chunk) {
		process.stdout.write('end');
		input.push(chunk);
		json = JSON.parse(input.join(""));
		result = parseState(json);
		//console.info("pared success:" + JSON.stringify(json));
		console.dir(result);

	});
}
