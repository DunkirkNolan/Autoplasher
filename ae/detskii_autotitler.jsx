var channel = "detskii_t",
    renderRoot ="\\y\\Плашки\\!сгенерированные",
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/"));
    q = '\\',
    d = '.';
    renderPath = renderPath();

app.open(new File(scrPath+ q + channel + ".aep"));

var newFile = new File(rootPath + "/plash.txt");

if(newFile != null) {
        var doc = readDocument(newFile).contentAry;
        
        app.beginUndoGroup("Plashka generation");
           createPlash(doc);
        app.endUndoGroup();
            app.project.save(new File(rootPath + "\\prj\\" + "detskii_t.aep"));
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

function createPlash(content) {
  
           if(content instanceof Array){
                    var compFonByChar, compMainByChar;
                    var compRender, compText, compTitle;
                    var curLine, pl;                                                                
                    var aryLength = content.length;
                    var movieName;
                    for(var i = 0; i<aryLength; i++) {
                           //Парсим строки файла
                           curLine = content[i];
                           pl = parse(curLine);
                           plashGen(pl);
                        }
                }
    }


function changeTextLayer(textLayer, text)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        textDocument.text = text;
        textProperty.setValue(textDocument);
    }

function plashGen(pl)
{
	   compTitle= app.project.item(returnCompId ("main fullhd")).duplicate();
	   compTitle.name = pl.name;                 

		pl.desc = pl.desc.replace(/@/g,'\n');                       

	   if(pl.desc.length > 43)
	   {
			changeTextLayer(compTitle.layer("имя 2"), pl.name);
			changeTextLayer(compTitle.layer("описание 2"), pl.desc);

			compTitle.layer("имя 2").enabled = true;
			compTitle.layer("описание 2").enabled = true;
	   }
		else
		{
			changeTextLayer(compTitle.layer("имя"), pl.name);
			changeTextLayer(compTitle.layer("описание"), pl.desc);

			compTitle.layer("имя").enabled = true;
			compTitle.layer("описание").enabled = true;
		}

	   renderQItem = app.project.renderQueue.items.add(compTitle)

	   var rPath = new File(renderPath + q + compTitle.name);                             
	   renderQItem.outputModules[1].file = rPath;
	   renderQItem.outputModules[1].applyTemplate("QTPngAlphaOnSoundOff");
                           //renderQPath = newDir + "//" + compRender.name + ".mov";
                           //renderQItem.outputModules[1].applyTemplate("DETSKII");
                           //renderQItem.outputModules[1].file = renderPath;
}

function parse(myText) {
        var text = myText.split("\t");
		if (text.length < 2) 
		{text.length = 2; text[1] = "";}
        return {
            'name':  text[0],
            'desc':  text[1],    
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