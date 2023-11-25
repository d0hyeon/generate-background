import { UtilWorker } from "./modules/UtilWorker";
import { WorkerBuilder } from "./modules/WorkerBuilder";

type Result<Payload, ReturnValue> = Payload extends any[]
  ? (...payloads: Payload) => ReturnValue : (payload: Payload) => ReturnValue

export function background<Payload extends any[], ReturnValue = void>(
  fn: (...payloads: Payload) => ReturnValue
): Result<Payload, ReturnValue> {
  function createWorker(): UtilWorker<Payload, ReturnValue> {
    return WorkerBuilder.fromModule(
      UtilWorker<Payload, ReturnValue>,
      { module: fn }
    )
  }

  if (typeof window === 'undefined') {
    function runWithCreatingWorker(...payload: Payload) {
      const worker = createWorker();
      return worker.request.call(worker, ...payload);
    }

    return runWithCreatingWorker as Result<Payload, ReturnValue>;
  }
  const worker = createWorker();
  return worker.request.bind(worker);
}
