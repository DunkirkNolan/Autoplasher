//TODO: fit date, fit name, name line break

#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "detskii";

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, true, false);

function plashGen(pl, plFolder) {
		var fSize,
			textLayer,
            dateLayer,
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
		if(eolNum > 0) {
			compDates = app.project.item(returnCompId ("datetime small")).duplicate();
		}
		else compDates = app.project.item(returnCompId ("datetime")).duplicate();
		
	   compDates.name = pl.date + " " + pl.time;
	   adNaSt(compDates.name, pl.name);
       var date = pl.date.replace(/@/g,'\n');                      
  	   setTimeAndDate(pl.time, date);
    
       dateLayer = compDates.layer("date yellow text");

    //    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//       while(textLayer.sourceRectAtTime(0,false).width < width)
//            {
//				fSize++;
//                
//                changeTextLayerFontsize(textLayer, fSize);
//                
//                if(textLayer.sourceRectAtTime(0,false).height >= height) break;
//            }

       newPlash = app.project.item(returnCompId ("plashka")).duplicate();  
	   cleanCompNameStr(newPlash, pl.name, pl.date, pl.time + " " + pl.character); 

	   newPlash.layer(4).replaceSource(compChar, false);
       newPlash.layer(2).replaceSource(compDates, false);
	   addToRenderQueue(newPlash, pl.date, newPlash.name, "QTPngAlphaOffSoundOff")
	   newPlash.parentFolder = plFolder;                     
} 

function adNaSt(str, name) { // "add name to string"
	str = str + " " + name;
}

function setTimeAndDate(time, date) {
	   changeTextLayer(compDates.layer("date yellow text"), date);
       changeTextLayer(compDates.layer("date black outline"), date);
       changeTextLayer(compDates.layer("date black choke"), date);
       changeTextLayer(compDates.layer("date white outline"), date);                           
       changeTextLayer(compDates.layer("time blue text"), time);
       changeTextLayer(compDates.layer("time black choke"), time);
       changeTextLayer(compDates.layer("time black outline"), time);
       changeTextLayer(compDates.layer("time white outline"), time);
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