#include "ap_utilities.jsx"
#include "ap_aeutils.jsx"
#include "ap_init.jsx"
#include "ap_main.jsx"

var channel = "ohota";

initAP(channel);

app.open(new File(prjPath));

mainProc(plashGen, true, false);

function plashGen(pl, plFolder) {
  
        var dateTimeMsk, compNumByCountry, mName, textAr, eolNum=-1, 
            nameLayer;
                                                 
        dateTimeMsk = pl.time;
        compByCountry = selectCompByCountry(pl.country);
        compPlash = app.project.item(returnCompId(compByCountry)).duplicate();
	shiftTime = 7/25,
	startTime = compPlash.layer("время").inPoint - shiftTime;
        nameLayer = compPlash.layer("название");


	textAr = pl.name.split("@");
	eolNum = textAr.length - 1;

	if(eolNum>0) {
		changeTextLayer(
		compPlash.layer("название"), textAr[0]);
		changeTextLayer(
		compPlash.layer("название 2"), textAr[1]);
	}
	else {
		changeTextLayer(
		compPlash.layer("название"), pl.name);
		compPlash.layer("название 2").enabled = false;
	}


	textAr = pl.date.split("@");
	eolNum = textAr.length - 1;

	if(eolNum>0) {
		changeTextLayer(
		compPlash.layer("дата"), textAr[0]);
		changeTextLayer(
		compPlash.layer("дата 1"), textAr[1]);
	}
	else {
		changeTextLayer(
		compPlash.layer("дата"), pl.date);
		compPlash.layer("дата 1").enabled = false;
	}
    
        function setText(yCoord, stampNum) {
            mName = pl.name.replace(new RegExp("@",'g'), "\n");
            compPlash.layer.enabled = true;
            nameLayer.enabled = true;
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

function parse(myText) {
        var text = myText.split("\t");
        return {
            'name':  text[0],
            'date':  text[1],
            'time': text[2],
            'country': text[3]          
            }
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