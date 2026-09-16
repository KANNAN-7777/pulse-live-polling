## <!DOCTYPE html>

## <html>

## <head>

## &#x20;   <title>WebSocket Test</title>

## </head>

## <body>

## 

## <h2>WebSocket Test</h2>

## 

## <p id="status">Connecting...</p>

## 

## <script>

## const ws = new WebSocket(

## &#x20;   "ws://localhost:8080/api/polls/6aaa89381dd0f4d768cbf3d2/ws"

## );

## 

## ws.onopen = function () {

## &#x20;   document.getElementById("status").innerText =

## &#x20;       "WebSocket Connected";

## &#x20;   console.log("WebSocket connected");

## };

## 

## ws.onmessage = function (event) {

## &#x20;   console.log("Live update:", event.data);

## };

## 

## ws.onerror = function (error) {

## &#x20;   document.getElementById("status").innerText =

## &#x20;       "WebSocket Error";

## &#x20;   console.log("WebSocket error:", error);

## };

## 

## ws.onclose = function () {

## &#x20;   document.getElementById("status").innerText =

## &#x20;       "WebSocket Disconnected";

## };

## </script>

## 

## </body>

## </html>

