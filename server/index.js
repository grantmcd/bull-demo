const express = require("express");
const Queue = require("bull");
const { setQueues, UI } = require("bull-board");

var jobQueue = new Queue("jobs", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
  }
}); // Specify Redis connection using object
setQueues(jobQueue);

// Constants
const PORT = process.env.PORT || 80;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  let numJobs = 1;

  if (req.query.numJobs) {
    numJobs = req.query.numJobs;
  }

  for (i = 0; i < numJobs; i++) {
    jobQueue.add(req.query);
  }

  res.send(`${numJobs} job(s) Enqueued\n`);
});

app.use("/queues", UI);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM. Graceful shutdown start",
    new Date().toISOString()
  );

  app.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
  // start graceul shutdown here
});
