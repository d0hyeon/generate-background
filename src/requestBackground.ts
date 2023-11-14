import { UtilWorker } from "./modules/UtilWorker";
import { WorkerBuilder } from "./modules/WorkerBuilder";

export function requestBackground<ReturnValue = unknown>(fn: () => ReturnValue) {
  const worker = WorkerBuilder.fromModule(
    UtilWorker,
    { module: fn }
  );

  return worker.request<undefined, ReturnValue>(undefined);
}