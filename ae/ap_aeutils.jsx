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

function textLayerFontsize(textLayer)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        return textDocument.fontSize;
    }

function changeTextLayerStrokesize(textLayer, size)    {
        var textProperty = textLayer.property("Source Text");
        var textDocument = textProperty.value;
        textDocument.strokeWidth= size;
        textProperty.setValue(textDocument);
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

function setX(layer, value) {
     y = layer.transform.position.value[1];
     z = layer.transform.position.value[2];
     layer.transform.position.setValue([value, y, z]);
}

function setY(layer, value) {
     x = layer.transform.position.value[0];
     z = layer.transform.position.value[2];
     layer.transform.position.setValue([x, value, z]);
}

function setZ(layer, value) {
     x = layer.transform.position.value[0];
     y = layer.transform.position.value[1];
     layer.transform.position.setValue([x, y, value]);
}

function setXY(layer, valueX, valueY) {
    z = layer.transform.position.value[2];
    layer.transform.position.setValue([valueX, valueY, z]);
}

function setXZ(layer, valueX, valueZ) {
    y = layer.transform.position.value[1];
    layer.transform.position.setValue([valueX, y, valueZ]);
}

function setYZ(layer, valueY, valueZ) {
    x = layer.transform.position.value[0];
    layer.transform.position.setValue([x, valueY, valueZ]);
}

function setCoord(layer, valueX, valueY, valueZ) {
    layer.transform.position.setValue([valueX, valueY, valueZ]);
}

function incX(layer, value) {
     x = layer.transform.position.value[0] + value;
     y = layer.transform.position.value[1];
     z = layer.transform.position.value[2];
     layer.transform.position.setValue([x, y, z]);
}

function incY(layer, value) {
     x = layer.transform.position.value[0];
     y = layer.transform.position.value[1] + value;
     z = layer.transform.position.value[2];
     layer.transform.position.setValue([x, y, z]);
}

function incZ(layer, value) {
     x = layer.transform.position.value[0];
     y = layer.transform.position.value[1];
     z = layer.transform.position.value[2] + value;
     layer.transform.position.setValue([x, y, z]);
}

function getX(layer) {
     return layer.transform.position.value[0];
}

function getY(layer) {
     return layer.transform.position.value[1];
}

function getZ(layer) {
     return layer.transform.position.value[2];
}