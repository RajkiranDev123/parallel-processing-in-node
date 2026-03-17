import { exec, spawn, fork } from "child_process";
import { readFile } from "fs";
import { Worker } from "worker_threads";
import os from "os";
import dotenv from "dotenv"
dotenv.config()
// Parent Process :	Your main Node.js file (index.js)
// Child Process  :	dir command, child.js script

// How a child process runs :

// The child process is separate  — it has its own memory : space where a program stores its variables, objects, and data while running ,
// thread : 1 main js thread , and resources : cpu etc.
// The child process runs on the OS, Memory is not shared between parent and child processes — they are isolated at the OS level.
// Node.js uses OS for memory, CPU, files, network, and async operations

// worker threads vs libuv threads :

// worker : Created by us 
// libuv  : automatically used by node

// worker : Default number : 0 (until you create)
// libuv :  4 (default for I/O)

// worker : It can run Js , Where JS runs: Directly on the worker thread — not the main thread.
// libuv  : When it finishes, it tells Node.js to run the JS callback

// worker : Run CPU-heavy JavaScript code in parallel to avoid blocking the main thread. Worker threads run inside the same Node process
// Your App (1 Node Process)
//    ├── Main Thread (event loop)
//    ├── Worker Thread 1
//    ├── Worker Thread 2

// libuv  : Handle background system tasks like reading files, networking, or hashing without blocking the main JavaScript thread.
// Your App (1 Node Process)
//    ├── Main Thread (Event Loop)
//    ├── libuv Thread Pool (4 threads by default)
//           ├── Worker 1
//           ├── Worker 2
//           ├── Worker 3
//           ├── Worker 4

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// libuv e.g.
readFile("x.txt", "utf-8", (err, data) => {
  if(err) console.log(err)
  console.log("File read completed : ", data); // runs on main JS thread
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// new Worker('./worker.js');

// Node.js asks the OS to create a thread
// The OS scheduler decides : which CPU core runs it and when it runs
// 👉 You cannot manually bind a worker to a specific core using standard Node.js APIs.

// runs on another CPU core
const worker = new Worker("./worker.js");
// 👉 Starts a new worker thread
// 👉 Runs worker.js in parallel


worker.on("message", (result) => console.log("Worker result:", result));
// "message" = fixed event name
//  but we can create custom events using EventEmitter (where we CAN name events)

// what is .on ?
// emitter.on(eventName, callback);

// emitter → an object that emits events.
// eventName → name of the event to listen for (like 'message', 'data', 'close')
// callback → function to run when the event happens

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// exec example (Windows)

console.log("===== exec example =====");
// Use case : Small commands


exec("node -v", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`exec Stderr: ${stderr}`);
    return;
  }
  // console.log(`exec Output:\n${stdout}`);
  console.log(`exec Output : ${stdout}`);
});

// spawn example (Windows)

console.log("===== spawn example =====");

// Large data / long-running

const ls = spawn("node -v", { shell: true });

//Chunk = small piece of data coming from a stream
//Use spawn when you want streaming / large / continuous output

ls.stdout.on("data", (data) => {
  console.log(`spawn stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`spawn stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`spawn process exited with code ${code}`);
});

// fork example 

console.log("===== fork example =====");
//You cannot directly run a CMD in fork, but you can fork a Node file and run the command inside it

const child = fork("./child.js");

child.on("message", (msg) => {
  console.log("Parent received from child :", msg);
});

child.send({ hello: "Hello from parent!" });

// fork vs worker threads 

// Similarities ✅:

// Both run code in parallel

// Both can use multiple CPU cores

// Both provide message-based communication



// Differences ❌:

// Fork = separate process, fully isolated, heavier

// Worker thread = lighter, shares memory, crash may affect main process

// Fork: completely separate process → separate memory, separate V8 instance

// Worker thread: same Node process → shares some resources like code, handles, can share memory

// So yes, worker threads run in the same Node process, fork runs in a new Node process.

/////////////////////////////////////////////////////////
console.log("cores")

const cores = os.cpus().length;
console.log("Number of CPU cores:", cores);


///////////////////////////////////////////

console.log("========= process ============")

// process
// It is a global object and it Represents the current Node.js execution environment.
// Helps interact with: system , environment variables
console.log(process.env.PORT);
console.log(process.pid);
console.log(process.cwd());


//process.exit(0); // success
//process.exit(1); // error


