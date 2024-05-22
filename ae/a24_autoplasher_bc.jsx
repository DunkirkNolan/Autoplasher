var channel = "a24",
    renderRoot ="\\z\\Для Режиссеров Монтажа\\Плашки\\!сгенерированные",
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/"));
    q = '\\',
    d = '.';
    renderPath = renderPath();

app.open(new File(scrPath+ q + channel + ".aep"));
var folderTarget = app.project.items.addFolder("Плашки");
  
var newFile = new File(rootPath + "/plash.txt");

if(newFile != null) {
        var doc = readDocument(newFile).contentAry;
        
        app.beginUndoGroup("lowa 3rds generation");
           createPlash(doc);
        app.endUndoGroup();
            app.project.save(new File(rootPath + "\\prj\\" + "a24test.aep"));
    }

function readDocument(inputDoc) {
        var curDoc = new File(inputDoc);
        if(curDoc.exists){
            var contentAry = new Array();
            curDoc.open("r");
            while(!curDoc.eof) {
                    contentAry[contentAry.length] = curDoc.readln();
             }
            curDoc.close();
        }
    
        contentAry = contentAry;
        return {
            'contentAry': contentAry, 
            }
    }

function createPlash(content) {
  
       try{
           if(content instanceof Array){
                    var compFonByChar, compMainByChar;
                    var compRender, compText, compTitle;
                    var curLine, pl;                                                                
                    var aryLength = content.length;
                    var movieName;
                    for(var i = 0; i<aryLength; i++) {
                           //Парсим строк и файла
                           curLine = content[i];
                           pl = parse(curLine); 
                           plashGen(pl);
                        }
                }
            } catch(err) {alert(err.line.toString()+ "\r" + err.to.String())};  
    }


function changeTextLayer(textLayer, text)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        textDocument.text = text;
        textProperty.setValue(textDocument);
    }

function plashGen(pl)
{
    // CHECK FOR TITLE
    
       // alert(pl.name.toLowerCase());
                           compTitle= app.project.item(returnCompId ("main")).duplicate();
                           compTitle.name = pl.name + " " + pl.date.replace('.', '-') + "_" + pl.time.replace(':', '-');                 
                           
                          // alert(pl.name);

                           changeTextLayer(compTitle.layer("дата"), pl.date);
                           changeTextLayer(compTitle.layer("время"), pl.time);
                           
                           var prgName = pl.name.toLowerCase();
                           compTitle.layer(prgName).enabled = true;
                                                                                        
                           compTitle.parentFolder = folderTarget;
                           
                           //renderQItem = app.project.renderQueue.items.add(compTitle);
}

function parse(myText) {
        var text = myText.split("\t");
        return {
            'name':  text[0],
            'date':  text[1],    
            'time':  text[2]
            }
    }

function returnCompId(compName){
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem) {
            if(app.project.item(i).name == compName) return i;
        }
   }
   }

function renderPath() {
        var pathStr = renderRoot + q + channel + q  + getTimeStamp();
        var f = new Folder(pathStr);

        if (!f.exists) 
        {
            f.create();
            return pathStr;
        }
        else return pathStr;
}

function getTimeStamp () {

//-- Use the Date object to grab the time right now
    var now = new Date() ;
 //-- Construct the full string
     return (now.getFullYear() ) + d +
    PadWithZeros( now.getMonth() + 1 , 2 ) + d +
    PadWithZeros( now.getDate() , 2 ) ;/*+
  PadWithZeros( now.getHours() , 2 ) + ":" +
  PadWithZeros( now.getMinutes() , 2 ) + ":" +
  PadWithZeros( now.getSeconds() , 2 ) + "." +
  PadWithZeros( now.getMilliseconds() , 3 ) ;*/

 function PadWithZeros( value , digits ) {
    var paddedString = String ( value ) ;
  //-- Check the length of the string. And continue adding zeros to the
  //--  front until the desired number of digits is reached.
    while( digits > paddedString.length ) {
      paddedString = '0' + paddedString ;
     }
        return paddedString ;
    }
}