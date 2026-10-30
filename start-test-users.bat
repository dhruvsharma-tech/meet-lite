@echo off
echo ========================================================
echo Launching 3 Independent Test Users with Virtual Cameras
echo ========================================================

set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if not exist %CHROME_PATH% set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME_PATH% set CHROME_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

echo Found browser at: %CHROME_PATH%

start "" %CHROME_PATH% --user-data-dir="%TEMP%\meet_user2" --use-fake-device-for-media-stream --use-fake-ui-for-media-stream "http://localhost:5173"
start "" %CHROME_PATH% --user-data-dir="%TEMP%\meet_user3" --use-fake-device-for-media-stream --use-fake-ui-for-media-stream "http://localhost:5173"
start "" %CHROME_PATH% --user-data-dir="%TEMP%\meet_user4" --use-fake-device-for-media-stream --use-fake-ui-for-media-stream "http://localhost:5173"

echo Done! 3 browser windows opened. Each has its own fake webcam and fresh session.

