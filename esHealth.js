//# !/usr/bin /env node
var fs = require( 'fs');
//var file = __dirname + '/test.json';
function parse(json) {
       //console.log("json is:" + JSON.stringify(json));
       var result = [];
       var indices = json.indices;
       for(var indexName in indices){
       		var index = indices[indexName];
       		if(index.status == "red"){
       			var oneJson = {};
       			result.push(oneJson);
       			oneJson.index = indexName;
       			oneJson.relocating_shards = index.relocating_shards;
       			oneJson.initializing_shards = index.initializing_shards;
       			oneJson.unassigned_shards = index.unassigned_shards;
       			oneJson.shards = {};
       			var shards = index.shards;
       			for(var shardId in shards){
       				var shard = shards[shardId];
       				if(shard.status == "red"){
       					oneJson.shards[shardId] = JSON.stringify(shard);
       				}
       			}
       		}
       }
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
  process.stdout.write( 'data: ' + chunk);
  input.push(chunk);
});

process.stdin.on( 'end', function (chunk) {
  process.stdout.write( 'end');
  input.push(chunk);
  var json = JSON.parse(input.join( ""));
  result = parse(json);
  console.dir(result);
});
