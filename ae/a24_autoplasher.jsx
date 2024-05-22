#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "a24";

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, false, false);

function plashGen(pl, plFolder)
{
        var pName, fSize, anchorFix, eolNum=-1;   
        compTitle = app.project.item(returnCompId ("main")).duplicate();
    
        oneLiner = compTitle.layer("1l");
    
        pName = pl.name;
    	cleanCompNameStr(compTitle, pName, pl.date, pl.time);
        pName = pName.replace(/@/g,'\n');
    
        changeTextLayer(oneLiner, pName);
        fSize = textLayerFontsize(oneLiner);
       
        while(oneLiner.sourceRectAtTime(0,false).width < 600)
            {
                fSize=fSize+1;
                
                changeTextLayerFontsize(oneLiner, fSize);
                
                if(oneLiner.sourceRectAtTime(0,false).height >= 200) break;
            }
        
        alert("font: " + fSize);
        alert("name: " + pl.name);
        eolNum = (pl.name.match(/@/g) || []).length;
        anchorFix = fSize/3;
        alert("eol: " + eolNum);
        if(eolNum > 0) anchorFix = anchorFix*(eolNum+1);
    
        alert("anchor: " + anchorFix);
        x = oneLiner.property("ADBE Transform Group")
                    .property("ADBE Position")
                    .value[0];
        y = oneLiner.property("ADBE Transform Group")
                    .property("ADBE Position")
                    .value[1];

        oneLiner.transform.position.setValue([x,y-anchorFix]);
        
		compTitle.parentFolder = plFolder;
       /*compTitle.name = pl.name + " " + pl.date.replace('.', '-') + "_" + pl.time.replace(':', '-');                 
                           
       changeTextLayer(compTitle.layer("дата"), pl.date);
       changeTextLayer(compTitle.layer("время"), pl.time);

       var prgName = pl.name.toLowerCase();
       compTitle.layer(prgName).enabled = true;

       compTitle.parentFolder = folderTarget;*/
}

function parse(myText) {
        var text = myText.split("\t");
        return {
            'name':  text[0],
            'date':  text[1],    
            'time':  text[2]
            }
    }