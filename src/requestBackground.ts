import { WorkerBuilder } from "./WorkerBuilder";

export function requestBackground<ReturnValue = void>(fn: () => ReturnValue) {
  const worker = WorkerBuilder.fromModule<never, ReturnValue>(fn);

  return worker.request(undefined);
}