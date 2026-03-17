// child.js
process.on("message", (msg) => {
  console.log("Child received:", msg);
  process.send({ reply: "Hello from child!" });
});