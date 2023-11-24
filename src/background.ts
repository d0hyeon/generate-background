import { UtilWorker } from "./modules/UtilWorker";
import { WorkerBuilder } from "./modules/WorkerBuilder";

type ReturnFn<ReturnValue> = () => ReturnValue;
type ReturnFnWithPayload<Payload, ReturnValue> = (payload: Payload) => ReturnValue;

export function background<Payload = never, ReturnValue = void>(fn: (payload: Payload) => ReturnValue) {
  function createWorker(): UtilWorker<Payload, ReturnValue> {
    return WorkerBuilder.fromModule(
      UtilWorker<Payload, ReturnValue>,
      { module: fn }
    )
  }

  if (typeof window === 'undefined') {
    function runWithCreatingWorker(payload: any) {
      const worker = createWorker();
      return worker.request.call(worker, payload);
    }

    return runWithCreatingWorker as Payload extends never
      ? ReturnFn<Promise<ReturnValue>>
      : ReturnFnWithPayload<Payload, Promise<ReturnValue>>;
  }
  const worker = createWorker();
  return worker.request.bind(worker);
}