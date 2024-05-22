#include "ap_utilities.jsx"
#include "ap_init.jsx"

function mainProc(plashGenFunction, save, render) {
    
    if(txtFile != null) {
        var doc = readDocument(txtFile).contentAry;
        
        fromFileToComps(doc, plashGenFunction);
        
        if(save == true) saveClientRequests(clientReqPath, txtFile);
		
        if(render == true) app.project.renderQueue.render();
    }
}