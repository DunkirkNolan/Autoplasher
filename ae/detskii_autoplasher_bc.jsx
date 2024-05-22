//TODO: fit date, fit name, name line break

var channel = "detskii",
    renderRoot ="\\z\\Для Режиссеров Монтажа\\Плашки\\!сгенерированные",
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/"));
    q = '\\',
    d = '.';
    renderPath = renderPath();

app.open(new File(scrPath+ q + channel + ".aep"));

var newFile = new File(rootPath + "/plash.txt");

if(newFile != null) {
        var doc = readDocument(newFile).contentAry;
        
        app.beginUndoGroup("Plashka generation");
           createPlash(doc);
            alert(rootPath + "prj\\" + "dettest.aep");
           app.project.save(new File(rootPath + "\\prj\\" + "dettest.aep"));    
        app.endUndoGroup();
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

function createPlash(content) {
  
       try{
           if(content instanceof Array){
                    var compFonByChar, compMainByChar;
                    var curLine, pl;                                                                
                    var aryLength = content.length;
                    var movieName;
                    var folderTarget = app.project.items.addFolder("Плашки");
                    
                    for(var i = 0; i<aryLength; i++) {
                           //Парсим строк и файла
                           curLine = content[i];
                           pl = parse(curLine);

                           //Обрабатываем композиции с фоном
                           compByChar = selectCompByChar(pl.character);
                           if(compByChar == null) alert("Неправильный персонаж для фильма " + pl.name);
                           compFonByChar = "name_fon_" + compByChar;
                           compCharBackground = app.project.item(returnCompId (compFonByChar)).duplicate();
                           compCharBackground.name = compCharBackground.name + " " + pl.name;
                            if(pl.name.length > 15)
                           {
                                movieName = pl.name.replace(new RegExp(" ",'g'), "\n");
                                changeTextLayer(compCharBackground.layer("название"), movieName);                                   
                           }
                       else {
                           changeTextLayer(compCharBackground.layer("название"), pl.name);
                           }
                           
                           compDates = app.project.item(returnCompId ("datetime")).duplicate();
                           compDates.name =  compDates.name + " " + pl.name;
                        
                           var date = pl.date.replace(/@/g,'\n');                      
                      
                           changeTextLayer(compDates.layer("date yellow text"), date);
                           changeTextLayer(compDates.layer("date black outline"), date);
                           changeTextLayer(compDates.layer("date black choke"), date);
                           changeTextLayer(compDates.layer("date white outline"), date);                           
                           changeTextLayer(compDates.layer("time blue text"), pl.time);
                           changeTextLayer(compDates.layer("time black choke"), pl.time);
                           changeTextLayer(compDates.layer("time black outline"), pl.time);
                           changeTextLayer(compDates.layer("time white outline"), pl.time);
                           
                           compMainByChar = "plashka_" + selectCompByChar(pl.character);
                           newPlash = app.project.item(returnCompId (compMainByChar)).duplicate();
                           newPlash.name = pl.name + "_" + pl.date.replace(/@/g,' ') + "_" + pl.time.replace(':', '-');

                           newPlash.layers.add(compCharBackground);
                           newPlash.layer(compCharBackground.name).threeDLayer = true;
                           fonPosProperty = newPlash.layer(compFonByChar).property("ADBE Transform Group").property("ADBE Position");
                           newFonPosProperty = newPlash.layer(compCharBackground.name).property("ADBE Transform Group").property("ADBE Position");
                           fonAncProperty = newPlash.layer(compFonByChar).property("ADBE Transform Group").property("ADBE Anchor Point");
                           newFonAncProperty = newPlash.layer(compCharBackground.name).property("ADBE Transform Group").property("ADBE Anchor Point");
                           fonScaProperty = newPlash.layer(compFonByChar).property("ADBE Transform Group").property("ADBE Scale");
                           newFonScaProperty = newPlash.layer(compCharBackground.name).property("ADBE Transform Group").property("ADBE Scale");
                           fonOriProperty = newPlash.layer(compFonByChar).property("ADBE Transform Group").property("ADBE Orientation");
                           newFonOriProperty = newPlash.layer(compCharBackground.name).property("ADBE Transform Group").property("ADBE Orientation");
                           
                           fonPosKeyframes = collectKeyframes(fonPosProperty);
                           transferKeyframes(newFonPosProperty, fonPosKeyframes);
                           fonAncKeyframes = collectKeyframes(fonAncProperty);
                           transferKeyframes(newFonAncProperty, fonAncKeyframes);
                           fonScaKeyframes = collectKeyframes(fonScaProperty);
                           transferKeyframes(newFonScaProperty, fonScaKeyframes);
                           fonOriKeyframes = collectKeyframes(fonOriProperty);
                           transferKeyframes(newFonOriProperty, fonOriKeyframes);
                           
                           newPlash.layer(compFonByChar).remove();
                           
                           newPlash.layers.add(compDates);
                           dateTimePosProperty = newPlash.layer("datetime").property("ADBE Transform Group").property("ADBE Position");
                           newDateTimePosProperty = newPlash.layer(compDates.name).property("ADBE Transform Group").property("ADBE Position"); 
                           dateTimeOpaProperty = newPlash.layer("datetime").property("ADBE Transform Group").property("ADBE Opacity");
                           newDateTimeOpaProperty = newPlash.layer(compDates.name).property("ADBE Transform Group").property("ADBE Opacity");  
                           newPlash.layer(compDates.name).threeDLayer = true;
                           newPlash.layer(compDates.name).motionBlur = true;      
                           newPlash.layer(compDates.name)("Material Options")("Casts Shadows").setValue(true);
                           newPlash.layer(compDates.name)("Material Options")("Accepts Shadows").setValue(true);
                           newPlash.layer(compDates.name)("Material Options")("Accepts Lights").setValue(true);
                           newPlash.layer(compDates.name)("Material Options")("Ambient").setValue(100);
                           newPlash.layer(compDates.name)("Material Options")("Diffuse").setValue(40);
                           newPlash.layer(compDates.name)("Material Options")("Specular Intensity").setValue(49);
                           newPlash.layer(compDates.name)("Material Options")("Specular Shininess").setValue(4);
                           newPlash.layer(compDates.name)("Material Options")("Metal").setValue(100);
                           dateTimePosKeyframes = collectKeyframes(dateTimePosProperty);
                           transferKeyframes(newDateTimePosProperty, dateTimePosKeyframes);
                           dateTimeOpaKeyframes = collectKeyframes(dateTimeOpaProperty);
                           transferKeyframes(newDateTimeOpaProperty, dateTimeOpaKeyframes);
                           
                           newPlash.layer("datetime").remove();
                            
                           
                           newPlash.parentFolder = folderTarget;
                        }
                }
            } catch(err) {alert(err.line.toString()+ "\r" + err.to.String())};  
    }

function selectCompByChar(character)
{
    switch(character)  {
        case "Малышка":
            return "malishka"; break;
        case "малышка":
            return "malishka"; break;
        case "Ракетка":
            return "raketka"; break;
        case "ракетка":
            return "raketka"; break;
        case "Смельчак":
            return "smelchak"; break;
        case "смельчак":
            return "smelchak"; break;            
        case "Умник":
            return "umnik"; break;    
        case "умник":
            return "umnik"; break;    
        case "Заводила":
            return "zavodila"; break;
        case "заводила":
            return "zavodila"; break;
        default: return null;
        }
}

function changeTextLayer(textLayer, text)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        textDocument.text = text;
        textProperty.setValue(textDocument);
    }

function changeTextLayerFontsize(textLayer, size)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        textDocument.fontSize = size;
        textProperty.setValue(textDocument);
    }

function changeTextLayerStrokesize(textLayer, size)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        textDocument.strokeWidth= size;
        textProperty.setValue(textDocument);
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

function returnCompId(compName){
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem) {
            if(app.project.item(i).name == compName) return i;
        }
   }
   }

function collectKeyframes(propertyInput){
        if(propertyInput instanceof Property){
            var totalKeys, prop, keyIndexList, curKeyIndex, curKeyValue, inin, outin, ab, cb, ie, oe, sab, scb, ist, ost, rov, twoDS, threeDS; 
            twoDS = PropertyValueType.TwoD_SPATIAL;
            threeDS = PropertyValueType.ThreeD_SPATIAL;
            
            keyIndexList = new Array();
            totalKeys = propertyInput.numKeys;
            
            if(totalKeys > 0){
                for(var i =1; i<= totalKeys; i++){
                    curKeyTime = propertyInput.keyTime(i);
                    curKeyIndex = i;
                    curKeyValue = propertyInput.keyValue(i);
                    inin = propertyInput.keyInInterpolationType(curKeyIndex);
                    outin = propertyInput.keyOutInterpolationType(curKeyIndex);
                    
                    if(inin == KeyframeInterpolationType.BEZIER && outin == KeyframeInterpolationType.BEZIER) {
                       ab = propertyInput.keyTemporalAutoBezier(curKeyIndex);
                       cb =  propertyInput.keyTemporalContinuous(curKeyIndex);  
                    }
                    
                    if(inin != KeyframeInterpolationType.HOLD || outin != KeyframeInterpolationType.HOLD) {
                        ie = propertyInput.keyInTemporalEase(curKeyIndex);
                        oe = propertyInput.keyOutTemporalEase(curKeyIndex);
                    }
                
                    if(propertyInput.propertyValueType == twoDS || propertyInput.propertyValueType == threeDS){
                        sab = propertyInput.keySpatialAutoBezier(curKeyIndex);
                        scb = propertyInput.keySpatialContinuous(curKeyIndex);
                        ist = propertyInput.keyInSpatialTangent(curKeyIndex);
                        ost = propertyInput.keyOutSpatialTangent(curKeyIndex);
                        rov = propertyInput.keyRoving(curKeyIndex);
                    }
                
                     keyIndexList[keyIndexList.length] = {'curKeyTime': curKeyTime,  'curKeyIndex':curKeyIndex, 'curKeyValue':curKeyValue, 'inin':inin, 'outin':outin, 'ab':ab, 'cb':cb, 'ie':ie, 'oe':oe, 'sab':sab, 'scb':scb, 'ist':ist, 'ost':ost, 'rov':rov};
                    }
                return keyIndexList;
                } else {
                    return null;
                    }
            }
    }

function transferKeyframes(propertyInput, keysAry){
    try{
        if(propertyInput instanceof Property && keysAry instanceof Array){
            if(propertyInput.numKeys == 0){
                var keysAryLength, newKeyTime, addNewKey, newKeyIndex;
                keysAryLength = keysAry.length;
                for(var k = 0; k < keysAryLength; k++) {
                    addNewKey = propertyInput.addKey(keysAry[k].curKeyTime);
                    newKeyIndex = addNewKey;
                    propertyInput.setValueAtKey(newKeyIndex, keysAry[k].curKeyValue);
                    
                    propertyInput.setInterpolationTypeAtKey(newKeyIndex, keysAry[k].inin, keysAry[k].outin);
                    if(keysAry[k].inin ==KeyframeInterpolationType.BEZIER && keysAry[k].outin == KeyframeInterpolationType.BEZIER  && keysAry[k].cb ){
                        propertyInput.setTemporalContiniousAtKey(newKeyIndex, keysAry[k].cb);
                        propertyInput.setTemporalAutoBezierAtKey(newKeyIndex, keysAry[k].ab);
                        }
                    if(propertyInput.propertyValueType == PropertyValueType.TwoD_SPATIAL || propertyInput.propertyValueType  == PropertyValueType.ThreeD_SPATIAL){
                        propertyInput.setSpatialContinuousAtKey(newKeyIndex, keysAry[k].scb);
                        propertyInput.setSpatialAutoBezierAtKey(newKeyIndex, keysAry[k].sab);
                        propertyInput.setSpatialTangentsAtKey(newKeyIndex, keysAry[k].ist, keysAry[k].ost);
                        propertyInput.setRovingAtKey(newKeyIndex, keysAry[k].rov);
                        }
                    }
                    return true;
                }else{
                    var check = confirm("Shit!\rLooks like keyframess already exist on the property. Should I remove them (yes) and continue or leave them alone (no) and stop now?", true);
                    if(check == true){
                        removeKeyFrames (propertyInput);
                        transferKeyframes(propertyInput, kesAry);
                        return true;
                        }else{
                            return false;
                            }
                    }
            }
        }catch(err){alert(err.line.toString() + "\r" + err.toString());};
    }

function removeKeyFrames(propertyInput){
    if(propertyInput instanceof Property){
        while(propertyInput.numKeys > 0){
            propertyInput.removeKey(1);
            }
        }
    }

function renderPath() {
        var pathStr = renderRoot + q + channel + q  + getTimeStamp();
        var f = new Folder(pathStr);

        if (!f.exists) 
        {
            f.create();
            return pathStr;
        }
        else return pathStr;
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