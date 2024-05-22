var channel = "rusIll",
    renderRoot ="\\z\\Для Режиссеров Монтажа\\Плашки\\!сгенерированные",
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/"));
    q = '\\',
    d = '.';
    renderPath = renderPath();

app.open(new File(scrPath+ q + channel + ".aep"));

var newFile = new File(rootPath + "/plash.txt");


if(newFile != null) {
        var doc = readDocument(newFile).contentAry;
        createPlash(doc);
        app.project.save(new File(rootPath + "\\prj\\" + "rusill.aep"));
        //app.project.save(new File("C:\\Klub100\\!AutoPlash\\webver\\k100_autoplasher\\" + "prj\\" + ));
        app.project.renderQueue.render();
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
                    var curLine, pl, mName, eolNum=-1, renderQItem, alpha = false;                                                                
                    var aryLength = content.length;
                    var folderTarget = app.project.items.addFolder("Плашки");
                    for(var i = 0; i<aryLength; i++) {
                           curLine = content[i];
                           pl = parse(curLine);
                           if(pl.alpha == 'премьера')
                                alpha = true;
                           else alpha = false;
                            
                           if(alpha)
                                compPlash = app.project.item(returnCompId("render alpha")).duplicate();
                           else
                                compPlash = app.project.item(returnCompId("render")).duplicate();
                        
                           renderQItem = app.project.renderQueue.items.add(compPlash);
                        
                           //if (pl.name.length > 42) compPlash.layer("название").transform.position.setValue([360, 125.5, 0]);  
                           eolNum = pl.name.search('@');
                            
                           if(eolNum >= 0) {
                                if (pl.name.length > 28) compPlash.layer("название").transform.position.setValue([360, 178.5, 0]);
                                    else if (pl.name.length > 14) compPlash.layer("название").transform.position.setValue([360, 232.5, 0]);   
                           }
                        
                           mName = pl.name;
                           compPlash.name = mName.replace(/@/g,' ') + "_" + pl.date + "_" + pl.time.replace(':', '-');
                           mName = mName.replace(/@/g,'\n');
                        
                           changeTextLayer(compPlash.layer("название"), mName);
                           changeTextLayer(compPlash.layer("дата"), pl.date.toUpperCase());
                           changeTextLayer(compPlash.layer("время"), pl.time);
                           changeTextLayer(compPlash.layer("название 2"), mName);
                           changeTextLayer(compPlash.layer("дата 2"), pl.date.toUpperCase());
                           changeTextLayer(compPlash.layer("время 2"), pl.time);
                           
                           compPlash.parentFolder = folderTarget;
                           compPlash.name = compPlash.name.replace(/[&\/\\#+()$~%'":*?<>{}]/g, '_');
                        //alert(compPlash.name);
                        //alert(renderPath + q + compPlash.name);
                           var rPath = new File(renderPath + q + compPlash.name);                             
                           renderQItem.outputModules[1].file = rPath;
                           if(alpha)
                                renderQItem.outputModules[1].applyTemplate("QTPngAlphaOnSoundOn");
                           else renderQItem.outputModules[1].applyTemplate("QTPngAlphaOnSoundOff");
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

function parse(myText) {
        var text = myText.split("\t");
        return {
            'name': text[0],
            'date': text[1],
            'time': text[2],
            'alpha': text[3]
            }
    }
	
 function getOuputPathFromTxt(fileName) {
	 var doc = readDocument("path.txt").contentAry;
	 return new File(doc[0] + "\\" + fileName + ".mov");
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