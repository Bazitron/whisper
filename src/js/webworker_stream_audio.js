/**
 * webworker_audio_stream.js:
 */

// Stream Data: Each time 'postMessage()' executes in this script, the associated
//              '.onmessage()' declared within the script that instantiates this
//              WebWorker script will execute, respectively.
  postMessage(setTimeout('randomByte()', 1000));

// Function Definitions
  function randomByte() {
    return Math.floor(Math.random()*256).toString(2);
  }
