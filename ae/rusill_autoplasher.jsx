#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "rusIll";

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, true, false);

function plashGen(pl, plFolder) {
           var mName, eolNum=-1, alpha = false;
		   //alert(pl.alpha);
		   //alert(typeof pl.alpha);
		   if(typeof pl.alpha === 'undefined') alpha = false;
		   else {
           if(pl.alpha.toLowerCase() == 'премьера')
                alpha = true;
           else alpha = false;
		   }

		   
           if(alpha)
                compPlash = app.project.item(returnCompId("render alpha")).duplicate();
           else
                compPlash = app.project.item(returnCompId("render")).duplicate();

           //if (pl.name.length > 42) compPlash.layer("назвазние").transform.position.setValue([360, 125.5, 0]);  
           eolNum = pl.name.split("@").length - 1;
			//alert(eolNum);
			if(eolNum > 0) {
				if (eolNum == 1) compPlash.layer("название").transform.position.setValue([960, 462.5, 0]);
                    else if(eolNum == 2) compPlash.layer("название").transform.position.setValue([360, 325.5, 0]);   
						else if(eolNum == 3) compPlash.layer("название").transform.position.setValue([360, 201, 0]); 
			}

	   eolNum = pl.date.split("@").length - 1;

	   if(eolNum>0) compPlash.layer("время").transform.position.setValue([960, 847, 0]);
			
           mName = pl.name;
           dateFixed = pl.date.replace('.', '-');
           dateFixed = dateFixed.replace(/@/g,'\n');
           compPlash.name = mName.replace(/@/g,' ') + " " + dateFixed + " " + pl.time.replace(':', '-');
           mName = mName.replace(/@/g,'\n');
    
    
           changeTextLayer(compPlash.layer("название"), mName);
           changeTextLayer(compPlash.layer("дата"), dateFixed.toUpperCase());
           changeTextLayer(compPlash.layer("время"), pl.time);
           changeTextLayer(compPlash.layer("название 2"), mName);
           changeTextLayer(compPlash.layer("дата 2"), dateFixed.toUpperCase());
           changeTextLayer(compPlash.layer("время 2"), pl.time);

           compPlash.name = compPlash.name.replace(/[&\/\\#+()$~%'":*?<>{}]/g, '_');

//           var rPath = new File(renderPath + q + compPlash.name);                             
//           renderQItem.outputModules[1].file = rPath;
           if(alpha)
              addToRenderQueue(compPlash, pl.date, compPlash.name, "QTPngAlphaOnSoundOn");
           else addToRenderQueue(compPlash, pl.date, compPlash.name, "QTPngAlphaOnSoundOff");
		   
		   compPlash.parentFolder = plFolder;
    }



function parse(rawText) {
        var text = rawText.split("\t");
        return {
            'name': text[0],
            'date': text[1],
            'time': text[2],
            'alpha': text[3]
            }
    }

	