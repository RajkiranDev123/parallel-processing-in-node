


// child.js
process.on("messageEvent", (msg) => {
  console.log("Child received:", msg);
  process.send({ reply: "Hello from child!" });
});