import { AsyncResource } from "node:async_hooks";
import { EventEmitter } from "node:events";
import { Worker } from "node:worker_threads";
import type { Task, runTask } from "./task";

const kTaskInfo = Symbol("kTaskInfo");
const kWorkerFreedEvent = Symbol("kWorkerFreedEvent");

type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer R>
  ? R
  : never;

export type Callback = (
  err: unknown,
  result: UnwrapPromise<ReturnType<typeof runTask>>
) => any;

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(public callback: Callback) {
    super("WorkerPoolTaskInfo");
  }

  done(err: unknown, result: any) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();
  }
}

type MyWorker = Worker & { [kTaskInfo]: any };

export default class WorkerPool extends EventEmitter {
  workers: Worker[];
  freeWorkers: MyWorker[];
  tasks: { task: Task; callback: Callback }[];
  constructor(public numThreads: number) {
    super();
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++) this.addNewWorker();
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift()!;
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL("task", import.meta.url)) as MyWorker;
    worker.on("message", (result) => {
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on("error", (err) => {
      if (worker[kTaskInfo]) worker[kTaskInfo].done(err, null);
      else this.emit("error", err);
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task: Task, callback: Callback) {
    if (this.freeWorkers.length === 0) {
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop()!;
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
