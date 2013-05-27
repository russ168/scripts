//# !/usr/bin /env node
var fs = require( 'fs');
//var file = __dirname + '/test.json';
Array.prototype.getUnique = function() {
    var o = {}, a = []
    for (var i = 0; i < this.length; i++) o[this[i]] = 1
    for (var e in o) a.push(e)
    return a
}

function parseNodes(json ) {
       //console.log("json is:" + JSON.stringify(json));
       var result = {};
       var cluster_name = json.cluster_name;
       var nodes = json.nodes;
       for(node in nodes){
       		
       	
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
  //process.stdout.write( 'data: ' + chunk);
  input.push(chunk);
});

process.stdin.on( 'end', function (chunk) {
  process.stdout.write( 'end');
  input.push(chunk);
  var json = JSON.parse(input.join( ""));
  result = parseNodes(json);
  console.dir(result);
});
