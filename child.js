


// child.js
process.on("message", (msg) => {
  console.log("Child received from parent :", msg);
  process.send({ reply: "Hello from child!" });
});