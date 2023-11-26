import { UtilWorker } from "./modules/UtilWorker";
import { WorkerBuilder } from "./modules/WorkerBuilder";
import { workerCleanupRegistry } from "./modules/workerCleanupRegistry";

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
    async function runWithCreatingWorker(...payload: Payload) {
      const worker = createWorker();
      const result = await worker.request.call(worker, ...payload);
      worker.terminate();

      return result;
    }

    return runWithCreatingWorker as Result<Payload, ReturnValue>;
  }

  const worker = createWorker();
  const result = worker.request.bind(worker);
  workerCleanupRegistry.register(result, worker);

  return result;
}

