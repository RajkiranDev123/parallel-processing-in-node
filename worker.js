// worker.js
import {parentPort} from "worker_threads"

// parentPort
// Receive messages from main thread

// Send messages back to main thread

let sum = 0;
for (let i = 0; i < 1e8; i++) sum += i;

console.log("i am worker.js",sum)
parentPort.postMessage(sum);

//postMessage(sum) sends data that is received in the callback of the "message" event in the main thread