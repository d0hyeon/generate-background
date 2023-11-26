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
    let worker: UtilWorker<Payload, ReturnValue> | null = null;
    function request(...payload: Payload) {
      worker ??= createWorker();
      return worker.request.call(worker, ...payload);
    }

    workerCleanupRegistry.register(request, worker);
    return request as Result<Payload, ReturnValue>;
  }

  const worker = createWorker();
  const request = worker.request.bind(worker);

  workerCleanupRegistry.register(request, worker);
  return request;
}

