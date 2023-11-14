import { UtilWorker } from "./modules/UtilWorker";
import { WorkerBuilder } from "./modules/WorkerBuilder";

export function background<Payload, ReturnValue>(fn: (payload: Payload) => ReturnValue) {
  const worker = WorkerBuilder.fromModule(
    UtilWorker,
    { module: fn }
  )

  return worker.request;
}