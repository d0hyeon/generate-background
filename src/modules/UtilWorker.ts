
import { TypedMessageEvent, TypedWorker } from "./TypedWorker";

export class UtilWorker<Payload = never, Result = void> extends TypedWorker<Payload, Result> {
  constructor(scriptURL: string | URL, options?: WorkerOptions) {
    super(scriptURL, options);
  }

  request(payload: Payload) {
    return new Promise<Result>(resolve => {
      const onMessage = ({ data }: TypedMessageEvent<Result>) => {
        resolve(data);
        this.removeEventListener('message', onMessage);
      };
      this.postMessage(payload);
      this.addEventListener('message', onMessage);
    });
  }
}
