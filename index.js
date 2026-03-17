import { exec, spawn, fork } from "child_process"
import { readFile } from "fs";
import { Worker } from 'worker_threads';
import os from "os";

const cores = os.cpus().length;
console.log("Number of CPU cores:", cores);


// Parent Process :	Your main Node.js file (index.js)
// Child Process  :	dir command, child.js script

// How a child process runs :

// The child process is separate  — it has its own memory : space where a program stores its variables, objects, and data while running ,
// thread : 1 main js thread , and resources : cpu etc.
// The child process runs on the OS, Memory is not shared between parent and child processes — they are isolated at the OS level.


// worker threads vs libuv threads

// worker : Created by You (new Worker())
// libuv  : automatically used by node

// worker : Default number : 0 (until you create)
// libuv :  4 (default for I/O)

// worker : It can run Js , Where JS runs: Directly on the worker thread — not the main thread.
// libuv  : When it finishes, it tells Node.js to run the JS callback


// worker : Run CPU-heavy JavaScript code in parallel to avoid blocking the main thread.Worker threads run inside the same Node process
// libuv  : Handle background system tasks like reading files, networking, or hashing without blocking the main JavaScript thread.


// libuv
readFile("x.txt", "utf-8", (err, data) => {
  console.log("File read complete!"); // runs on main JS thread
});


// new Worker('./worker.js');

// Node.js asks the OS to create a thread

// The OS scheduler decides:

// which CPU core runs it

// when it runs

// 👉 You cannot manually bind a worker to a specific core using standard Node.js APIs.




// worker 

// runs on another CPU core
const worker = new Worker('./worker.js');

worker.on('message', result => console.log("Worker result:", result));

// what is .on ?

// emitter.on(eventName, callback);

// emitter → an object that emits events

// eventName → name of the event to listen for (like 'message', 'data', 'close')

// callback → function to run when the event happens


// 1️⃣ exec example (Windows)


exec("dir", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`exec Stderr: ${stderr}`);
    return;
  }
  console.log(`exec Output:\n${stdout}`);
});

// -------------------
// 2️⃣ spawn example (Windows)
// -------------------
console.log("===== spawn example =====");
const ls = spawn("dir", { shell: true });

ls.stdout.on("data", (data) => {
  console.log(`spawn stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`spawn stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`spawn process exited with code ${code}`);
});

// -------------------
// 3️⃣ fork example (Node.js script)
// -------------------
console.log("===== fork example =====");
const child = fork("./child.js");

child.on("message", (msg) => {
  console.log("Parent received from child:", msg);
});

child.send({ hello: "Hello from parent!" });