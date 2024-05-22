#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "retro";

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, true, false);

function plashGen(pl, plFolder) {
  
        var dateTimeMsk, compNumByCountry, mName, eolNum=-1, 
            nameLayer;
                                                 
        dateTimeMsk = "\n" + pl.time;
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
            compPlash.layer.enabled = true;
            nameLayer.enabled = true;
            changeTextLayer(nameLayer, mName);
        }
    
        changeTextLayer(compPlash.layer("время"), dateTimeMsk);
        changeTextLayer(compPlash.layer("дата"), pl.date)
        
    	cleanCompNameStr(compPlash, pl.name, pl.date, pl.time);
 
        addToRenderQueue(compPlash, pl.date, compPlash.name,"QTPngAlphaOnSoundOn");
		
		compPlash.parentFolder = plFolder;
}

function selectCompByCountry(country)
{
    switch(country)  {
        case "1 строка":
            return "TEXT_1_stroka"; break;
        case "2 строки":
            return "TEXT_2_stroki"; break;
        case "3 строки":
            return "TEXT_3_stroki" ; break;
        case "4 строки":
            return "TEXT_4_stroki"; break;
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