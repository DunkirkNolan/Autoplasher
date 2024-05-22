:: cd /d C:\Program Files\Adobe\Adobe After Effects CC 2015.3\Support Files
cd ./adb/

if "%1" == "illPlus"  AfterFX -noui -r %~dp0ae\ill+_autoplasher.jsx 
if "%1" == "rusill" AfterFX -noui -r %~dp0ae\rusill_autoplasher.jsx