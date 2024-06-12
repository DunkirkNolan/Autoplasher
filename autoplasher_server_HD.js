var
http = require('http'),
path = require('path'),
url = require("url");
fs = require('fs'),
qs = require('querystring'),
//express = require('express'),
//bodyParser = require('body-parser'),
dns = require('dns'),
select = 'illPlus',
validIpAddressRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
ws = require("nodejs-websocket");
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(); 

//these are the only file types we will support for now
extensions = {
	".html" : "text/html",
	".css" : "text/css",
	".js" : "application/javascript",
	".png" : "image/png",
    ".eot" : "font/eot",
    ".svg" : "font/svg",
    ".ttf" : "font/ttf",
    ".woff" : "font/woff",
    ".woff2" : "font/woff2",
};
 
execBatch("startae.bat"); 

//step 2) create the server
http.createServer(serverStart)

var server = http.createServer(serverStart);

// Step 3: Listen for an HTTP request on port 3303
server.listen(3303, function() {
    console.log("HTTP server started on" validIpAddressRegex(), server.address().address, server.address().port);
});

console.log("autoplasher server started" + '\n');
outputSkull_nolinebreak();

//helper function handles file verification
function getFile(filePath,res,page404,mimeType){
	//does the requested file exist?
	fs.exists(filePath,function(exists){
		//if it does...
		if(exists){
			//read the file, run the anonymous function
			fs.readFile(filePath,function(err,contents){
				if(!err){
					//if there was no error
					//send the contents with the default 200/ok header
					res.writeHead(200,{
						"Content-type" : mimeType,
						"Content-Length" : contents.length
					});
					res.end(contents);
				} else {
					//for our own troubleshooting
					console.dir(err);
				};
			});
		} else {
			//if the requested file was not found
			//serve-up our custom 404 page
			fs.readFile(page404,function(err,contents){
				//if there was no error
				if(!err){
					//send the contents with a 404/not found header 
					res.writeHead(404, {'Content-Type': 'text/html'});
					res.end(contents);
				} else {
					//for our own troubleshooting
					console.dir(err);
				};
			});
		};
	});
};
 
function requestHandler(req, res) {
    switch(req.url) {
        case '/': 
            NewUserInfo(req);
            break;
        //case '/Export':
            //execBatch('run_ae.bat');
            //break;
        case '/illPlus':
            select = 'illPlus';
            break;
        case '/rusIll':
            select = 'rusIll';
            break;
        case '/zooPark':
            select = 'zoo';
            break;
        case '/euroKino':
            select = 'euro';
            break;
        case '/detskiy':
            select = 'detskiy';
            break;
        case '/detskiyTitles':
            select = 'detskiy_t';
            break;        
	case '/detskiyHD':
            select = 'detskiyHD';
            break;
        case '/auto24':
            select = 'auto24';
            break;
    }

};

function execBatch(fileName) {
    
    var filePath = fileName;
    
    if (fs.existsSync(filePath)) {
    console.log('Batch file ' + filePath + ' found');
    }
    else 
    {
        console.log('Batch file ' + filePath + ' is missing');
    }
    
    var cp = require("child_process");

    cp.exec(filePath, function( error, stdout, stderr) 
    {
       if ( error != null ) {
            console.log(stderr);
            // error handling & exit
       }

       console.log(stdout);

    });
     
    
}

function loadSite(res, req) {
    var
    fileName = path.basename(req.url) || 'index.html',
    ext = path.extname(fileName),
	localFolder = __dirname + '/public/',
    fontFolder = 'fonts/',
    imgFolder = 'img/',
    cssFolder = 'css/',
    jsFolder = 'js/',
    subFolder = '',
	page404 = localFolder + '404.html';
 
	//do we support the requested file type?
	if(!extensions[ext]){
		//for now just send a 404 and a short message
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.end("&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;The requested file type is not supported&lt;/body&gt;&lt;/html&gt;");
	};
    
    switch(extensions[ext])
    {
        case "text/css": subFolder = localFolder + cssFolder; break;
        case "application/javascript": subFolder = localFolder + jsFolder; break;
        case "image/png": subFolder = localFolder + imgFolder; break;
        case "font/eot": 
        case "font/svg":
        case "font/ttf":
        case "font/woff":
        case "font/woff2": subFolder = localFolder + fontFolder; break;
        default: subFolder = localFolder; break;
    }
    //console.log("FOOFOO " + extensions[ext]);
    
    //call our helper function
	//pass in the path to the file we want,
	//the response object, and the 404 page path
	//in case the requestd file is not found
	getFile((subFolder + fileName),res,page404,extensions[ext]);
}

function serverStart(req, res) {    
    loadSite(res, req);    
	
    requestHandler(req, res); 
};

var wsServer = ws.createServer(function (conn) {
        console.log("web socket server started");
        process.on('uncaughtException', function (err) {
        console.log("Unhandled error: " + err.message);
    });
    conn.on("text", function (str) {
        console.log('\n' + "Received text:"+ '\n\n' + str);
        
        processReceivedText(str);
        startAE();
        
        conn.close();
    })
    conn.on("close", function (code, reason) {
        console.log("web socket connection closed");
    })
}).listen(6606);

function reverseLookup(ip) {
	dns.reverse(ip,function(err,domains){
		if(err!=null)	console.log('не удается извлечь ip');
 
		domains.forEach(function(domain){
			dns.lookup(domain,function(err, address, family){
				if(domain != null)
                console.log(domain.replace(/undefined/g,""),'[',address,']');
			});
		});
	});
}

function NewUserInfo(req) {
    //console.log(req.connection.remoteAddress);
    var ip = (req.headers['x-forwarded-for']||req.connection.remoteAddress).replace(/[^\d.-]/g, ''); 
    if (validIpAddressRegex.test(ip)) {
        console.log('Пользователь на главной странице\n ' + Date()); 
        reverseLookup(ip);
    }
    else console.log('адрес посетителя неизвестен, ip: ' + ip);
}

function outputSkull_nolinebreak() {
    console.log(
"                            6rahxbnnnnnnnnckdiw5                                "+
"                      2uxnnnnnnnnnnnnnnnnnnnnnnnnnnnnzaw2                       "+
"                   8znnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvli6                 "+
"                1fnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvcp4            "+
"              1jnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnvvvvvvvvl6         "+
"             pnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnvvvvvvvvvvvi       "+
"           3cnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvc7     "+
"          qnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvu    "+
"         tnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvg   "+
"        rnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvvvvl  "+
"       6nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvvvvvvj "+
"       gnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnvvvvvvvvvvvvvvvvvvvvvvvvve"+
"      6nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvvvvvvvvvvo"+
"      snnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvvvvvvvvvvvvo"+
"     3nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnvvvvvvvvvvvvvvvvvvvvvvvvvvvvvy"+
"     dnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvvvvvvvvvvvvv9"+
"    fnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvvvvvvvvvvvvc0"+
"   lnnnnbbnnnnnnnnnnnnnnnnnziq669ygvnnnnnnnnnnnnnbvvvvvvvvvvvvvvvvvvvvvvvvvvvvs0"+
"  knu00000000qznnnnnnnnnh20000000000005abnnnnnnnnbvvvvvvvvvvvvvvvvvvvvvvvvvvvv80"+
" yx10          0snnnnnn40                04dnnnnnbvvvvvvvvvvvvvvvvvvvvvvvvvvvj  "+
"0l50            0innnnnr0                    0pnnnvvvvvvvvvvvvvvvvvvvvvvvvvvve  "+
"6k0             0snnnnnn60                     0rnnbvvvvvvvvvvvvvvvvvvvvvvvvl   "+
"rg0   AUTO     07nnnnnnnb30    PLASHER          01xnnnvvvvvvvvvvvvvvvvvvvvvvw   "+
"yk0           06bnnnnnnnnc10                     05nnnnvvvvvvvvvvvvvvvvvvvvj    "+
"5n90         0snnnnnnnnnnnz0                     06nnnnvvvvvvvvvvvvvvvvvvvv7    "+
" anl70000005jnnns8tcnnnnnnnl0                    0snnnnvvvvvvvvvvvvvvvvvvvp     "+
"  cnnnnbnnnnnnb30   6vnnnnnnc20                 0ennnnnvvvvvvvvvvvvvvvvvvl      "+
"  qnnnnnnnnnnn80     0hnnnnnnni0               0pnnnnnvvvvvvvvvvvvvvvvvvc3      "+
"   vnnnnnnnnnj0       0pnnnnnnnnncgoe73000001wknnnnvvvvvvvvvvvvp100jvvvj2       "+
"   bnnnnnnnnns0        0pnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvcq0003lvxw          "+
"  6nnnnnnnnnnl0         0xnnnnnnnnnnnnnnbbvvvvvvvvxapgcvvvvr0003kg7             "+
"    19ijbnnnnno0000000002cnnnnnnnnnnbvvvvvvvvvvvx4000000xl10018                 "+
"          jnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvy0002pcvvf                       "+
"         tnnnnnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvk1002jvvvvf                        "+
"         fnnnnnnnnnnnnnnnnnnnnnnnnnnnnvvvvvc8000uvvvvvz                         "+
"         pnnnnnnnnnnnnnnnnnnnnnnnnnnnnnvvvy0007cvvvvvv7                         "+
"         2bn80fnp02vngrlnnxilnnvgvnc10qcr0006xvvvvvvvs                          "+
"          6y00ok000vh000cn400xb101vg000001ovvvvvvvvvv5                          "+
"                                      06xvvvvvvvvvvvd                           "+
"                                     04vvvvvvvvvvvvv4                           "+
"         9n20inf00eng000xv000on900ivi0rvvvvvvvvvvvvr                            "+
"         9nzznnx37bnb50enny00lnvewxvvvvvvvvvvvvvvc6                             "+
"         1bnnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvvvvf3                               "+
"          pnnnnnnnnnnnnnnnnnnnnnbvvvvvvvvvvcu1                                  "+
"           jnnnnnnnnnnnnnnnnnnnnvvvvvvvvd5                                      "+
"            9cnnnnnnnnnnnnnnnnnbvvvvd7                                          "+
"                18tahxbnnnnnnvkp9                                               ");

}

function writeString2File(pathToFile, str) {
     var wstream = fs.createWriteStream(pathToFile);
        wstream.write(str);
        wstream.end();
}

function processReceivedText(str) {
        
        writeString2File("./plash.txt", str);
        
}

function startAE() {
        execBatch(select + ".bat");
        console.log('Starting After Effects...');
        //watchFile("a_a_a.mov");
    }

function watchFile(fileP) {
   
    // Progress bar http://codepen.io/wiseguy12851/pen/mJZNqN
    
    var fs = require('fs');

    try {
    
        fs.watch(fileP, function (curr, prev) {
        fs.stat(fileP, function (err, stats) {
            
            console.log(stats.size);
            
            });
        });
    } catch (err) {
          console.error('error caught', err);
    }
}