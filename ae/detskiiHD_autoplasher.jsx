#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "detskiiHD";

initAP(channel);

app.open(new File(prjPath));

 
mainProc(plashGen, true, false);

var plFolder = app.project.items.addFolder("Плашки");

function plashGen(pl, plFolder) {
    var fSize,
        textLayer,
//~     dateLayer,
        bubLay,
        nameLen = pl.name.length;  

   compByChar = pl.character.toLowerCase();
   if(compByChar == null) alert("Неправильный персонаж для фильма " + pl.name);
   compChar = app.project.item(returnCompId (compByChar)).duplicate();
   textLayer = compChar.layer("название");
   bubLay = compChar.layer("bubble");
   mName = pl.name;
   mName = mName.replace(/@/g,'\n');
   compChar.name = mName + " " + pl.character;
   adNaSt(compChar.name, mName);
   changeTextLayer(textLayer, mName);
   fSize = textLayerFontsize(textLayer);
   pHolder = compChar.layer("text pholder");
   pHoldPos = pHolder.transform.position.value;
   
   
    width = pHolder.transform.anchorPoint.value[0]*2;
    height = pHolder.transform.anchorPoint.value[1]*2;
    
    textLayer.transform.position.setValue(pHoldPos);
    incZ(textLayer, -1);

    while(textLayer.sourceRectAtTime(0,false).width < width)
        {
            fSize++;
            
            changeTextLayerFontsize(textLayer, fSize);
            
            if(textLayer.sourceRectAtTime(0,false).height >= height) break;
        }
    
    if(nameLen <= 2) textLayer.transform.scale.setValue([50, 50, 50]);
    else if(nameLen <= 5) textLayer.transform.scale.setValue([70, 70, 70]);

    var eolNum = pl.date.split("@").length - 1;

    if(eolNum == 1) {
        compDates = app.project.item(returnCompId ("date small")).duplicate();
    } else
     if(eolNum > 1) {
        compDates = app.project.item(returnCompId ("date smallest")).duplicate();
     }
    else compDates = app.project.item(returnCompId ("date")).duplicate();
    
    newPlash = app.project.item(returnCompId ("plashka")).duplicate();      
    
    if(pl.time.length > 5) {
        compTime = app.project.item(returnCompId ("time small")).duplicate();
        newPlash.layer(9).transform.position.setValue([960, 617, 0]);
    }
    else {
        compTime = app.project.item(returnCompId ("time")).duplicate();
        
        }
		
    compTime.name = pl.time;
    adNaSt(pl.date + " " + pl.time, pl.name);
    var date = pl.date.replace(/@/g,'\n');
    compDates.name = date;
    setTimeAndDate(compDates, compTime, pl.time, date);
    
   
   cleanCompNameStr(newPlash, pl.name, pl.date, pl.time + " " + pl.character); 

   newPlash.layer(8).replaceSource(compChar, false);
   newPlash.layer(2).replaceSource(compDates, false);
   newPlash.layer(3).replaceSource(compTime, false);
   newPlash.layer(4).replaceSource(compDates, false);
   newPlash.layer(5).replaceSource(compTime, false);
   addToRenderQueue(newPlash, pl.date, newPlash.name, "QTPngAlphaOffSoundOff");

   
   newPlash.parentFolder = plFolder;
}

function adNaSt(str, name) { // "add name to string"
	str = str + " " + name;
}

function setTimeAndDate(compD, compT, time, date) {
	   changeTextLayer(compD.layer("date yellow text"), date);
       changeTextLayer(compD.layer("date black outline"), date);
       changeTextLayer(compD.layer("date black choke"), date);
       changeTextLayer(compD.layer("date white outline"), date);                           
       changeTextLayer(compT.layer("time blue text"), time);
       changeTextLayer(compT.layer("time black choke"), time);
       changeTextLayer(compT.layer("time black outline"), time);
       changeTextLayer(compT.layer("time white outline"), time);
}

function parse(myText) {
        var text = myText.split("\t");
        return {
            'name':  text[0],
            'date':  text[1],
            'time': text[2],
            'character': text[3]          
            }
    }