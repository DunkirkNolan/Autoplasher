#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "illPlus";

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, true, false);

function plashGen(pl, plFolder) {
        compPlash = app.project.item(returnCompId ("Plash")).duplicate();

        genre = selectGenre(pl.genre);

        compPlash.layer(genre + " " + "rect").enabled = true;
        compPlash.layer(genre).enabled = true;
        compPlash.layer(genre + " " + "date").enabled = true;
        compPlash.layer(genre + " " + "time").enabled = true;

        changeTextLayer(compPlash.layer("название"), pl.name);
        changeTextLayer(compPlash.layer("time"), pl.time);
        changeTextLayer(compPlash.layer("date"), pl.date);
	
		cleanCompNameStr(compPlash, pl.name, pl.date, pl.time);
        
        addToRenderQueue(compPlash, pl.date, compPlash.name, "QTPngAlphaOnSoundOff");
		
		compPlash.parentFolder = plFolder;
    }
    
function selectGenre(genre)
{
    switch(genre)  {
        case "экшн":
            return "blue"; break;
        case "Экшн":
            return "blue"; break;
        case "комедия":
            return "green"; break;
        case "Комедия":
            return "green"; break;
        case "драма":
            return "red"; break;
        case "Драма":
            return "red"; break;
        case "триллер":
            return "grey"; break;    
        case "Триллер":
            return "grey"; break;              
        }
}


function parse(rawText) {
        var text = rawText.split("\t");
        return {
            'name':  text[0],
            'date':  text[1],
            'time':  text[2],
            'genre': text[3]          
            }
    }