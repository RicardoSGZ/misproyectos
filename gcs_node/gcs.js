const http = require('http');
const hostname = '127.0.0.1';
const port = 8080;
var storage = require('@google-cloud/storage');
const fs = require('fs');

const proyecto = 'nombre_proyecto';
const segmento = 'nombre_segmento';
const carpeta = 'carpeta';
const llave_json = 'archivojson.json';
var direccion = "https://storage.googleapis.com/" + segmento + "/";

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<!DOCTYPE html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width, initial-scale=1'/>");
    res.write("<title>Archivos de " + carpeta + "</title><style>img{width:25%;}</style></head><body>");
    res.write("<h1>Fotos de " + carpeta + "</h1>");
    res.write("<div id='container'>");
    var gcs = storage({
    projectId: proyecto,
    keyFilename: llave_json
    });
    var disco = gcs.bucket(segmento);

    disco.getFiles(function(err, files) {
        if (!err) {
            for (var i = 0; i < files.length; i++){
                if( files[i].name.search(carpeta) > -1){
                    if( files[i].name.search('.jpg') > -1 
                    || files[i].name.search('.JPG') > -1 
                    || files[i].name.search('.png') > -1
                    || files[i].name.search('.PNG') > -1){
                        res.write("<a href='"+ direccion + files[i].name + "'><img src='" + direccion + files[i].name + "'/></a>");                    
                    }else 
if(files[i].name.search(/([.]zip)|([.]rar)|([.]doc)|([.]gdoc)|([.]xls)/) > -1){
			res.write("<a href='" + direccion + files[i].name + "'><p>" + files[i].name + "</p></a>");
		    }
                }
            }
            res.write("</div></body></html>");
            res.end(); //end the res
        }
    });

}).listen(port);
