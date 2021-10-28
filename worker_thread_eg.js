const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
if (isMainThread) {
  console.log("starting the main thread");
  const worker = new Worker(__filename, {
    workerData: {
      outputPrefix: "received message",
      delay: 9000,
    },
  });
  worker.on("message", (msg) => {
    console.log(`worker: ${msg}`);
  });
  worker.postMessage("done with my work");
  console.log("still in the main thread");
} else {
  parentPort.on("message", (msg) => {
    console.log(`Parent:${msg} - ${workerData.outputPrefix}`);
  });
  parentPort.postMessage("Getting started");
  wasteTime(workerData.delay);
  parentPort.postMessage("in the middle");
  wasteTime(workerData.delay);
  parentPort.postMessage("all done");
}

function wasteTime(delay) {
  const end = Date.now + delay;
  while (Date.now() < end) {}
}
