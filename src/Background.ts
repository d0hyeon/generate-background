import { UtilWorker } from "./modules/UtilWorker";
import { WorkerBuilder } from "./modules/WorkerBuilder";

export class Background<Payload, ReturnValue> {
  #worker: UtilWorker<Payload, ReturnValue>;

  constructor(fn: (payload: Payload) => ReturnValue) {
    this.#worker = WorkerBuilder.fromModule(
      UtilWorker,
      { module: fn }
    )
  }

  request(payload: Payload) {
    return this.#worker.request(payload);
  }

  close() {
    this.#worker.terminate();
  }
}