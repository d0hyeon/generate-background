import { UtilWorker } from "./modules/UtilWorker";
import { WorkerBuilder } from "./modules/WorkerBuilder";

export function worker<Payload, ReturnValue>(fn: (payload: Payload) => ReturnValue) {
  function createWorker() {
    return WorkerBuilder.fromModule(
      UtilWorker,
      { module: fn }
    )
  }

  if (typeof window === 'undefined') {
    return (payload: Payload) => createWorker().request(payload)
  }

  return createWorker().request;
}