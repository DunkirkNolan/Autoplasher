#include "ap_utilities.jsx"

var q = '\\',
    d = '.',
    u = '_',
    scrPath, rootPath, prjPath, txtPath, clientReqPath, rootRenderPath, prevRendPath, prDate, txtFile;

function initAP(channel) {
    renderRoot = "N:\\montazhki\\Плашки",
    now = new Date(),
    scrPath = $.fileName.substring(0, $.fileName.lastIndexOf("/")),
    rootPath = scrPath.substring(0, scrPath.lastIndexOf("/")),
    prjPath = scrPath + q + channel + ".aep",
    txtPath = rootPath + "/plash.txt",
    clientReqPath = rootPath + q + "prj" + q + channel + q + getTimeStamp(),    
    txtFile = new File(txtPath),
    rootRenderPath = checkOrCreatePath(renderRoot + q + channel, "string");
    prevRendPath = rootRenderPath;
    prDate = "12345";
}