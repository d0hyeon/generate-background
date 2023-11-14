import { UtilWorker } from "./UtilWorker";
import { WorkerBuilder } from "./WorkerBuilder";

export function requestBackground<ReturnValue = void>(fn: () => ReturnValue) {
  const worker = WorkerBuilder.fromModule(
    UtilWorker,
    { module: fn }
  );

  return worker.request<undefined, ReturnValue>(undefined);
}
