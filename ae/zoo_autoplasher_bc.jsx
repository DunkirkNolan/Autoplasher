var channel = "zoo",
    renderRoot ="\\z\\Для Режиссеров Монтажа\\Плашки\\!сгенерированные",
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/"));
    q = '\\',
    d = '.';
    renderPath = renderPath();

app.open(new File(scrPath+ q + channel + ".aep"));

var newFile = new File(rootPath + "/plash.txt");

var folderTarget;

if(newFile != null) {
        var doc = readDocument(newFile).contentAry;
        
        app.beginUndoGroup("Import Text");
        folderTarget = app.project.items.addFolder("Плашки");
           fromFileToComps(doc);
        app.endUndoGroup();
        app.project.save(new File(rootPath + "\\prj\\" + channel + ".aep"));
        //app.project.renderQueue.render();
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

function fromFileToComps(content) {
  
      // try{
           if(content instanceof Array){
                    var curLine, pl;                                                                
                    var aryLength = content.length;
                    for(var i = 0; i<aryLength; i++) {
                           curLine = content[i];
                           pl = parse(curLine);   
                           ZooPlashGen(pl);
                        }
                }
           // } catch(err) {alert(err.line.toString()+ "\r" + err.to.String())};  
    }

function ZooPlashGen(pl) {
                               compPlash= app.project.item(returnCompId (pl.beast.toLowerCase())).duplicate();
                               
                               pl.name1 = pl.name1.replace(/@/g,'');
                               pl.name2 = pl.name2.replace(/@/g,'');
                               pl.time = pl.time.replace(/@/g,'');
                               pl.date1 = pl.date1.replace(/@/g,'');
                               pl.date2 = pl.date2.replace(/@/g,'');
    
                               compPlash.name = pl.name1 + " " + pl.name2 + "_" + pl.date1.replace('.', '-') + "_" + pl.date2.replace('.', '-') + "_" + pl.time.replace(':', '-');
                                
                               changeTextLayer(compPlash.layer("1 строчка"), pl.name1);
                               changeTextLayer(compPlash.layer("2 строчка"), pl.name2);
                               changeTextLayer(compPlash.layer("время"), pl.time);
                               changeTextLayer(compPlash.layer("дата"), pl.date1);
                               changeTextLayer(compPlash.layer("дата 2"), pl.date2);    
    
    
                               renderQItem = app.project.renderQueue.items.add(compPlash);

                               var rPath = new File(renderPath + q + compPlash.name);                             
                               renderQItem.outputModules[1].file = rPath;
							   renderQItem.outputModules[1].applyTemplate("QTPngAlphaOnSoundOn");
                                  
                                compPlash.parentFolder = folderTarget;
    }
    
/*function selectBeast(beast)
{
    switch(beast)  {
        case "акула":
            return "акула"; break;
        case "бабочки":
            return "бабочки"; break;
        case "жираф":
            return "жираф"; break;
        case "зебра":
            return "зебра"; break;
        case "кит":
            return "кит"; break;
        case "слон":
            return "слон"; break;
        case "собака":
            return "собака"; break;    
        case "тукан":
            return "тукан"; break;
        case "хамелеон":
            return "хамелеон"; break;     
         default: "бабочки"; 
        }
}*/

function addToRenderQueue(comp, template) {
                           renderQItem = app.project.renderQueue.items.add(compRender)
                           //renderQPath = newDir + "//" + compRender.name + ".mov";
                           if(template != null && template instanceof string) {
                           renderQItem.outputModules[1].applyTemplate(template);
                           }
                       else return;
                           //renderQItem.outputModules[1].file = renderPath;
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
            'name1':  text[0],
            'name2':  text[1],
            'date1':  text[2],
            'date2':  text[3],
            'time': text[4],
            'beast': text[5]          
            }
    }

function returnCompId(compName){
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem) {
            if(app.project.item(i).name == compName) return i;
        }
   }
   }

 function getOuputPathFromTxt(fileName) {
	 var doc = readDocument("path.txt").contentAry;
	 return new File(doc[0] + "\\" + fileName + ".mov");
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