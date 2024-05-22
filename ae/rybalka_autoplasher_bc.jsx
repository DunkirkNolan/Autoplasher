var channel = "rybalka",
    renderRoot = "\\z\\Для Режиссеров Монтажа\\Плашки\\!сгенерированные",
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/"));
    q = '\\',
    d = '.';
    renderPath = renderPath();

app.open(new File(scrPath+ q + channel + ".aep"));

var newFile = new File(rootPath + "/plash.txt");

if(newFile != null) {
        var doc = readDocument(newFile).contentAry;
        
        app.beginUndoGroup("Import Text");
           createPlash(doc);
        app.endUndoGroup();
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
                    var dateTimeMsk, compNumByCountry;
                    var curLine, pl;                                                                
                    var aryLength = content.length;
                    for(var i = 0; i<aryLength; i++) {
                           curLine = content[i];
                           pl = parse(curLine);
                           dateTimeMsk = pl.date + pl.time;
                           compByCountry = selectCompByCountry(pl.country);
                           newPlash = app.project.item(returnCompId(compByCountry)).duplicate();
                           newPlash.name = pl.name;
                        }
                }
            } catch(err) {alert(err.line.toString()+ "\r" + err.to.String())};  
    }

function ZooPlashGen(pl) {
                               
                               pl.name1 = pl.name1.replace(/@/g,'');
                               pl.name2 = pl.name2.replace(/@/g,'');
                               pl.time = pl.time.replace(/@/g,'');
                               pl.date1 = pl.date1.replace(/@/g,'');
                               pl.date2 = pl.date2.replace(/@/g,'');
    
                               compPlash.name = pl.name1 + " " + pl.name2 + "_" + pl.date1.replace('.', '-') + "_" + pl.date2.replace('.', '-') + "_" + pl.time.replace(':', '-');
                                
                               changeTextLayer(compPlash.layer("название"), pl.name1);
                               changeTextLayer(compPlash.layer("название 2"), pl.name2);
                               changeTextLayer(compPlash.layer("время"), pl.time);
                               changeTextLayer(compPlash.layer("дата"), pl.date1);
                               changeTextLayer(compPlash.layer("дата 1"), pl.date2);
    
    
                               renderQItem = app.project.renderQueue.items.add(compPlash);

                               var rPath = new File(renderPath + q + compPlash.name);                             
                               renderQItem.outputModules[1].file = rPath;
							   renderQItem.outputModules[1].applyTemplate("QTPngAlphaOnSoundOn");
                                  
                                compPlash.parentFolder = folderTarget;
    }
    
function selectCompByCountry(country)
{
    switch(country)  {
        case "1 строка время":
            return "1 stroka_1 time"; break;
        case "1 строка дата время":
            return "1 stroka_2 time"; break;
        case "1 строка две даты время":
            return "1 stroka_3 time"; break;
        case "1 строка три даты время":
            return "1 stroka_4 time"; break;
        case "2 строки время":
            return "2 stroki_1 time"; break;
        case "2 строки дата время":
            return "2 stroki_2 time"; break;
        case "2 строки две даты время":
            return "2 stroki_3 time"; break;
        case "2 строки три даты время":
            return "2 stroki_4 time"; break;
        case "3 строки время":
            return "3 stroki_1 time"; break;
        case "3 строки дата время":
            return "3 stroki_2 time"; break;
        case "3 строки две даты время":
            return "3 stroki_3 time"; break;
        case "3 строки три даты время":
            return "3 stroki_4 time"; break;
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
            'time': text[2],
            'country': text[3]          
            }
    }
   
 function returnCompId(compName){
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem) {
            if(app.project.item(i).name == compName) return i;
        }
   }
   }
    