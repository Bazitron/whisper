/**
 * initializer.js:
 */

$(document).ready(function() {

// Local Variables
  var webworker_stream_audio;
  var audio_context;

// Test 'getUserMedia' Support
  try {
    initWebSocket();
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    audio_context = new AudioContext;
  } catch (e) {
    $('.message').innerHTML = 'Error with Web Audio: ' + e;
  }

// Prompts users permission to use a media device (camera or microphone)
  navigator.getUserMedia({video: false, audio: true}, startUserMedia, function(e) {
    $('.message').innerHTML = 'Error initializing getUserMedia: ' + e;
  });

// Create WebSocket
  var sock = null;
  sock = new WebSocket("ws://localhost:9001");
  console.log("Websocket created...");

// WebSocket Definitions: executed when websocket performs defined action 
//                        (i.e. open, close, message, ...)
  sock.onopen = function() {
    console.log("connected to server");
    sock.send("CONNECTED TO YOU");
  }

  sock.onclose = function(e) {
    console.log("connection closed (" + e.code + ")");
  }

  sock.onmessage = function(e) {
    console.log("message received: " + e.data);
  }

// Send Random Byte
  $('.buttonStart').click(function() {
    startDataStream();
  });
  $('.buttonStop').click(function() {
    if (typeof(webworker_audio_stream) != 'undefined') {
      endDataStream();
    }
  });

// Function Definitions
  function endDataStream() {
  // Terminate WebWorker: 'webworker_audio_stream' defined in startDataStream()
    webworker_audio_stream.terminate();
  }

  function startDataStream() {

  // Check Support: WebWorker is an HTML5 feature that allows javascript to be
  //                run in the background independent of other scripts, without 
  //                affecting the performance of the page.
  //
  //                webworker_audio_stream.onmessage receives data from the WebWorker
  //                webworker_audio_stream.postMessage('YOUR-DATA-HERE') sends
  //                  data to the WebWorker.  The WebWorker receives data as below,
  //                  with the .onmessage.  However, if no parameters are supplied,
  //                  postMessage() simple starts the WebWorker.

    if(typeof(Worker) !== 'undefined') {
      var path = '../../src/js/webworker_stream_audio.js';
      webworker_audio_stream = new Worker(path);
      webworker_audio_stream.onmessage = function(event) {
        console.log(event.data);
        return event.data;
      }
  // Starts the WebWorker
      webworker_audio_stream.postMessage();
    }
    else {
      $('.message').innerHTML = 'Error: Your browser does not support "Web Worker"';
    }

  }  // Closes  function startDataStream() {}

});  // Closes $(document).ready(function() {}
