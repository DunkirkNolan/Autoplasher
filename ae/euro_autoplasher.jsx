#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "euro";

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, true, false);

function plashGen(pl, plFolder) {
  
        var dateTimeMsk, compNumByCountry, mName, eolNum=-1, 
            nameLayer;
                                                 
        dateTimeMsk =  translateDate2Rus(pl.date) 
                       + "\n" + pl.time + " МСК";
        compByCountry = selectCompByCountry(pl.country);
        compPlash = app.project.item(returnCompId(compByCountry)).duplicate();
        nameLayer = compPlash.layer("название");
    
        eolNum = pl.name.split("@").length - 1;
    
        switch(eolNum) {
            case 1: setText(400, 2); break;
            case 2: setText(277, 3); break;
            case 3: setText(155, 3); break;
            default: setText(522, 1); break;     
        }
    
        function setText(yCoord, stampNum) {
            mName = pl.name.replace(new RegExp("@",'g'), "\n");
            compPlash.layer("stamp " + stampNum).enabled = true;
            nameLayer.enabled = true;
            compPlash.layer("название control").transform.position
                     .setValue([0, yCoord, 0]);
            changeTextLayer(nameLayer, mName);
        }
    
        changeTextLayer(compPlash.layer("время"), dateTimeMsk);
        
    	cleanCompNameStr(compPlash, pl.name, pl.date, pl.time);
 
        addToRenderQueue(compPlash, pl.date, compPlash.name,"QTPngAlphaOnSoundOn");
		
		compPlash.parentFolder = plFolder;
}


function selectCompByCountry(country)
{
    switch(country)  {
        case "Великобритания":
            return "1.uk"; break;
        case "Германия":
            return "2.germany"; break;
        case "Франция":
            return "3.france" ; break;
        case "Испания":
            return "4.spain"; break;    
        case "Италия":
            return "5.italy"; break;
        case "Польша":
            return "6.poland"; break;
        default: return "7.other"; break;
        }
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