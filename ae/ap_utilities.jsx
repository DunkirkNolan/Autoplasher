var months = ["январь", "февраль", "март", "апрель", 
			  "май", "июнь", "июль", "август", "сентябрь", 
			  "октябрь", "ноябрь", "декабрь"],
	monthsGeni = ["января", "февраля", "марта", "апреля", 
			  "мая", "июня", "июля", "августа", "сентября", 
			  "октября", "ноября", "декабря"];

function fromFileToComps(content, plashGenFunc) {
  	var plFolder = app.project.items.addFolder("Плашки");
	
           if (content instanceof Array) {
                    var curLine, pl,
                        aryLength = content.length;
                    for(var i = 0; i<aryLength; i++) {
                           curLine = content[i];
                           pl = parse(curLine);
                           plashGenFunc(pl, plFolder);
                        }
                }
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

function checkOrCreatePath(path, format) {
        var f = new Folder(path); 
        
        !f.exists ? (f.create(), setFormat()) : setFormat();
        
        function setFormat() {
                  format == "string" ? f = path : f = new Folder(path);
        }
    
        return f;
}

function getTimeStamp () {

//-- Use the Date object to grab the time right now
    //var now = new Date() ;
 //-- Construct the full string
     return (now.getFullYear() ) + d +
    PadWithZeros( now.getMonth() + 1 , 2 ) + d +
    PadWithZeros( now.getDate() , 2 ) ;/*+
  PadWithZeros( now.getHours() , 2 ) + ":" +
  PadWithZeros( now.getMinutes() , 2 ) + ":" +
  PadWithZeros( now.getSeconds() , 2 ) + "." +
  PadWithZeros( now.getMilliseconds() , 3 ) ;*/
}

function PadWithZeros( value , digits ) {
    var paddedString = String ( value ) ;
  //-- Check the length of the string. And continue adding zeros to the
  //--  front until the desired number of digits is reached.
    while( digits > paddedString.length ) {
      paddedString = '0' + paddedString ;
     }
        return paddedString ;
}

function saveClientRequests(clientReqPath, txtFile) {

    checkOrCreatePath(clientReqPath);
    var prjCopyPath = clientReqPath + q + now.toLocaleTimeString("ja-JP").replace(/:/g, '-') + ".aep";

    txtFile.copy(clientReqPath);
    app.project.save(new File(prjCopyPath));
}

function multiLineText(eolNum, titleComp, targetComp, txtArray, 
									  shiftY, startTime, shiftTime, frontLayer) {
	
	var coef = 1;
	
    for(i = eolNum; i >= 0; i--) {

	   var nameComp,
		   nameCompID = returnCompId (txtArray[i]);
		
		if(nameCompID == null) {
			nameComp = app.project.item(returnCompId (titleComp)).duplicate();

        	changeTextLayer(nameComp.layer(titleComp), txtArray[i]);
			
			nameComp.name = txtArray[i];
        } else nameComp = app.project.item(nameCompID);
        
        tCL = targetComp.layers.add(nameComp);
        
		if(i != eolNum) {
			incY(tCL, coef * shiftY);
			tCL.startTime = startTime - (shiftTime * coef);
			coef++;
		} else
			tCL.startTime = startTime;
		
		tCL.moveAfter(frontLayer);       
    }
}

function addToRenderQueue(composition, date, filename, template) {
        renderQItem = app.project.renderQueue.items.add(composition);
    
        var renderPath;

        if(date.length == 5) {
            renderPath = checkOrCreatePath(monthRenderPath(rootRenderPath, date), "string");
			prDate = date;
			prevRendPath = renderPath;
		}
        else
            renderPath = prevRendPath;
		if(prevRendPath == "undefined") renderPath = rootRenderPath;
                                   
        var rPath = new File(renderPath + q + filename); 
        renderQItem.outputModules[1].file = rPath;
        renderQItem.outputModules[1].applyTemplate(template);
}

function overwriteRenderPaths(path) {
	
	for (var i=1; i <= app.project.renderQueue.numItems; i++) {
		fName = app.project.renderQueue.item(i).outputModules[1].file.toString();
		//alert(fName);
		fName = fName.split('\\').pop().split('/').pop();
		rPath = new File(path + q + fName);
		app.project.renderQueue.item(i).outputModules[1].file = rPath;
	}

}

function monthRenderPath(path, parsedDate) {
    
    var month = parsedDate.substr(parsedDate.length - 2);
    
    return path + q + returnMonthInRus(month, false);
}

function translateDate2Rus(month) {
	/*    if(month.length == 5) {
        fixMonth1 = month.substr(0, 2);

        if(fixMonth1.substr(0,1)=="0") fixMonth1 = fixMonth1.substr(1,1);

        fixMonth2 = month.substr(month.length - 2);

        fixMonth2 = returnMonthInRus(fixMonth2, true);

           return fixMonth1 + " " + fixMonth2;
        }
       else  */ 
	
	return month; // отменили перевод из цифровой формы
}

function returnMonthInRus(month, genitive) {
    if(genitive == false)
    {
        switch(month) {
            case "1":
            case "01": return "январь"; break;
            case "2": 
            case "02": return "февраль"; break;
            case "3":
            case "03": return "март"; break;
            case "4": 
            case "04": return "апрель"; break;
            case "5": 
            case "05": return "май"; break;        
            case "6": 
            case "06": return "июнь"; break;
            case "7": 
            case "07": return "июль"; break;
            case "8": 
            case "08": return "август"; break;           
            case "9": 
            case "09": return "сентябрь"; break;            
            case "10": return "октябрь"; break;             
            case "11": return "ноябрь"; break;            
            case "12": return "декабрь"; break;           
        }
    }
    else 
        switch(month) {
            case "1":
            case "01": return "января"; break;
            case "2": 
            case "02": return "февраля"; break;
            case "3":
            case "03": return "марта"; break;
            case "4": 
            case "04": return "апреля"; break;
            case "5": 
            case "05": return "мая"; break;        
            case "6": 
            case "06": return "июня"; break;
            case "7": 
            case "07": return "июля"; break;
            case "8": 
            case "08": return "августа"; break;           
            case "9": 
            case "09": return "сентября"; break;            
            case "10": return "октября"; break;             
            case "11": return "ноября"; break;            
            case "12": return "декабря"; break;             
        }
}

function cleanCompNameStr(titLayer, name, date, time) {
		date = date.replace(/@/g,' ');
		titLayer.name = name.replace(/@/g,' ') + " " + 
						date.replace('.', '-') + " " + 
						time.replace(':', '-');
		titLayer.name = titLayer.name.replace(/[&\/\\#+()$~%'":*?<>{}]/g, ' ');
}

function findMonthInArr(datesArr) {
	var month;
	
	for(var i = 0; i < datesArr.length; i++) {
		month = checkMonth(datesArr[i]);
		if(month != null) break;
	}
	
	function checkMonth(dateText) {
			
			for(var i = 0; i < months.length; i++) {

				condition1 = dateText.search(months[i]);
				condition2 = dateText.search(monthsGeni[i]);
				condition = (condition1 >= 0) || (condition2 >= 0);
				//alert(i + ": " + condition);
				
				if((condition1 >= 0) || (condition2 >= 0)) {
					
					return months[i];
				}
			}
	}
	
	return month;
}