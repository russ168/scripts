//# !/usr/bin /env node
var fs = require( 'fs');
//var file = __dirname + '/test.json';

function parseStats(json ) {
       //console.log("json is:" + JSON.stringify(json));
       var result = {};
       result.info = [];
       result.warning = [];
       
       var nodes = json.nodes;
       var reg = /inet\[.*\/(.*):9300\]/ ;
       for(var nodeName in nodes) {
             var node = nodes[nodeName];         
             //console.log("node is:" + JSON.stringify(node));           
             var res = {};
             //name
            res.name = node.name;
             //console.log("transport address is:" + node.transport_address);      
             var list = reg.exec(node.transport_address);
             //console.log("transport address is:" + list);
            res.ip = list[1 ];

             //size
            res.indices_size = node.indices.store.size;
            res.docs = node.indices.docs.count;

             //mem
            res.total_mem = (node.os.mem.actual_used_in_bytes+node.os.mem.actual_free_in_bytes)/(1024*1024*1024) 
            res.heap_committed = node.jvm.mem.heap_committed;
            res.heap_used = node.jvm.mem.heap_used;
            res.mem_used_percent = node.jvm.mem.heap_used_in_bytes /node.jvm.mem.heap_committed_in_bytes;
            res.field_cache = node.indices.cache.field_size;
            res.field_cache_percent = node.indices.cache.field_size_in_bytes /node.jvm.mem.heap_committed_in_bytes;
            res.filter_cache = node.indices.cache.filter_size;
            res.filter_cache_percent = node.indices.cache.filter_size_in_bytes /node.jvm.mem.heap_committed_in_bytes;

             //cpu
            res.cpu_used_percent = node.process.cpu.percent;
            
             //file handles
            res.files = node.process.open_file_descriptors;

            result.info.push(res);
            if(res.mem_used_percent >= 0.9)result.warning.push(res);

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
  result = parseStats(json);
  console.dir(result);
});
