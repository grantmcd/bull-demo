const Queue = require("bull");
const sleep = require("util").promisify(setTimeout);

const jobQueue = new Queue("jobs", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
  }
}); // Specify Redis connection using object

jobQueue.process(async function(job, done) {
  console.log("Job Data: ");
  console.log(job.id);
  console.log(job.data);

  let i;
  for (i = 0; i <= 100; i++) {
    job.progress(i);
    await sleep(100);
  }

  console.log("finished!");
  done();
});

process.on("SIGTERM", () => {
  console.info(
    "Got SIGTERM. Graceful shutdown start",
    new Date().toISOString()
  );

  // start graceul shutdown here
  jobQueue.pause(true).then(function() {
    console.log("Queue Paused!");
    jobQueue.whenCurrentJobsFinished().then(function() {
      process.exit(0);
    });
  });
});
