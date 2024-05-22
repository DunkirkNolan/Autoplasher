#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "zoo",
	numLayer4Order,
	datesArr = [],
	date4Path;

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, true, false);

rqPaths();

//app.project.renderQueue.render()

function plashGen(pl, plFolder) {
    
        var textAr, eolNum=-1, 
			title = "!название",
			compPlash = app.project.item(returnCompId 											  (pl.beast.toLowerCase())).duplicate(),
			shiftTime = 7/25,
			startTime = compPlash.layer("время").inPoint - shiftTime;
	
			selectLayer4Order(pl.beast.toLowerCase());
			layer4Order = compPlash.layer(numLayer4Order);
	
     
			textAr = pl.name.split("@");

			eolNum = textAr.length - 1;
	
			if(eolNum>0) {
				multiLineText(eolNum, title, compPlash, textAr, -67.5, 
								  startTime, shiftTime, layer4Order);
			}
			else {
				changeTextLayer(
				compPlash.layer("1 строчка"), pl.name);
				compPlash.layer("1 строчка").enabled = true;
			}

			textAr = pl.date.split("@");
			eolNum = textAr.length - 1;

			if(eolNum>0) {
				changeTextLayer(
				compPlash.layer("дата"), textAr[0]);
				changeTextLayer(
				compPlash.layer("дата 2"), textAr[1]);
			}
			else {
				changeTextLayer(
				compPlash.layer("дата"), pl.date);
				compPlash.layer("дата 2").enabled = false;
			}

			changeTextLayer(compPlash.layer("время"), pl.time);

			cleanCompNameStr(compPlash, pl.name, pl.date, pl.time + " " + pl.beast);

			addToRenderQueue(compPlash, pl.date, compPlash.name,"QTPngAlphaOnSoundOn");

			compPlash.parentFolder = plFolder;
	
			datesArr.push(pl.date);

    }

function selectLayer4Order(beast) {
    switch(beast)  {
        case "акула":
            numLayer4Order = 3; break;
        case "бабочки":
            numLayer4Order = 2; break;
        case "жираф":
            numLayer4Order = 2; break;
        case "зебра":
			numLayer4Order = 2; break;
        case "кит":
			numLayer4Order = 3; break;	
        case "слон":
			numLayer4Order = 5; break;
        case "собака":
			numLayer4Order = 2; break;
        case "тукан":
			numLayer4Order = 4; break;
		case "хамелеон":
			numLayer4Order = 4; break;
        }
}

function parse(rawText) {
        var text = rawText.split("\t");
        return {
            'name':  text[0],
            'date':  text[1],
            'time':  text[2],
            'beast': text[3]          
            }
    }

function rqPaths() {
	
	date4Path = findMonthInArr(datesArr);

	pathFull = rootRenderPath + q + date4Path;

	pathFull = checkOrCreatePath(pathFull, "string");
	
	overwriteRenderPaths(pathFull);
}