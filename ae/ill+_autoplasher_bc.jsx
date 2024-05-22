var q = '\\',
    d = '.';
    channel = "IllPlus",
    renderRoot = "\\z\\Для Режиссеров Монтажа\\Плашки\\!сгенерированные",
    now = new Date(),
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/")),
    prjPath = scrPath + q + channel + ".aep",
    txtPath = rootPath + "/plash.txt",
    clientReqPath = rootPath + q + "prj" + q + channel + q + getTimeStamp(),    
    renderPath = renderPath();

app.open(new File(prjPath));

var txtFile = new File(txtPath);

if(txtFile != null) {
        var doc = readDocument(txtFile).contentAry;
        fromFileToComps(doc);
        saveClientRequests();   
		//app.project.renderQueue.render();
    }

function readDocument(inputDoc) {
        var curDoc = new File(inputDoc);
        if(curDoc.exists){
            var contentAry = new Array();
            curDoc.open("r");
            while(!curDoc.eof) {
                textLine = curDoc.readln();
                if(textLine.length > 0)
                    contentAry[contentAry.length] = textLine;
             }
            curDoc.close();
        }
    
        contentAry = contentAry;
        return {
            'contentAry': contentAry, 
            }
    }

function fromFileToComps(content) {
  
       try{
           if(content instanceof Array){
                    var curLine, pl;                                                                
                    var aryLength = content.length;
                    for(var i = 0; i<aryLength; i++) {
                           curLine = content[i];
                           pl = parse(curLine);   
                           illPlusPlashGen(pl);
                        }
                }
            } catch(err) {alert(err.line.toString()+ "\r" + err.to.String())};  
    }

function illPlusPlashGen(pl) {
                               compPlash= app.project.item(returnCompId ("Plash")).duplicate();
                               compPlash.name = pl.name + "_" + pl.date.replace('.', '-') + "_" + pl.time.replace(':', '-');
                               
                               genre = selectGenre(pl.genre);
                               compPlash.layer(genre + " " + "rect").enabled = true;
                               compPlash.layer(genre).enabled = true;
                               compPlash.layer(genre + " " + "date").enabled = true;
                               compPlash.layer(genre + " " + "time").enabled = true;
                               
                               changeTextLayer(compPlash.layer("название"), pl.name);
                               changeTextLayer(compPlash.layer("time"), pl.time);
                               changeTextLayer(compPlash.layer("date"), pl.date);
                               
                               renderQItem = app.project.renderQueue.items.add(compPlash);

                               var rPath = new File(renderPath + q + compPlash.name);                             
                               renderQItem.outputModules[1].file = rPath;
							   //renderQItem.outputModules[1].applyTemplate("QTPngAlphaOnSoundOff");
    }
    
function selectGenre(genre)
{
    switch(genre)  {
        case "экшн":
            return "blue"; break;
        case "Экшн":
            return "blue"; break;
        case "комедия":
            return "green"; break;
        case "Комедия":
            return "green"; break;
        case "драма":
            return "red"; break;
        case "Драма":
            return "red"; break;
        case "триллер":
            return "grey"; break;    
        case "Триллер":
            return "grey"; break;              
        }
}

function changeTextLayer(textLayer, text)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        textDocument.text = text;
        textProperty.setValue(textDocument);
    }

function parse(myText) {
        var text = myText.split("\t");
        return {
            'name':  text[0],
            'date':  text[1],
            'time':  text[2],
            'genre': text[3]          
            }
    }

function returnCompId(compName){
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem) {
            if(app.project.item(i).name == compName) return i;
        }
   }
   }

 function getOuputNameFromTxt(fileName) {
	 var doc = readDocument("path.txt").contentAry;
	 return new File(doc[0] + "\\" + fileName + ".mov");
 }

 function getOuputPathFromTxt() {
	 var doc = readDocument("path.txt").contentAry;
	 return new File(doc[0] );
 }

function checkOrCreatePath(path) {
        var f = new Folder(path);

        if (!f.exists) 
        {
            f.create();
            return f;
        }
        else return f;
}

function renderPath() {
    checkOrCreatePath(renderRoot + q + channel + q  + getTimeStamp());
}

function getTimeStamp () {

//-- Use the Date object to grab the time right now
    //var now = new Date() ;
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

function saveClientRequests() {

    checkOrCreatePath(clientReqPath);
    var prjCopyPath = clientReqPath + q + now.toLocaleTimeString("ja-JP").replace(/:/g, '-') + ".aep";

    txtFile.copy(clientReqPath); 
    app.project.save(new File(prjCopyPath));   
    
}