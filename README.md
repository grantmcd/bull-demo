# bull-demo


This repo was a POC to demonstrate how a bull queue can function inside of a kubernetes cluster.

The `bull-server` application has a `/queues` endpoint where you can view the status of the bull queues and their jobs.

You can hit the root `bull-server` endpoint with the query param `numJobs` with an integer value and that many jobs will be added to the queue. Each job takes 10 seconds to complete.

The `bull-worker` deployment can be scaled up or down as needed to process the jobs in the queue. If a `bull-worker` pod is terminated, it will gracefully exit by finishing its current job and then stopping its process.
