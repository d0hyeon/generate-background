
import { TypedMessageEvent, TypedWorker } from "./TypedWorker";

export class UtilWorker<Payload, Response> extends TypedWorker<Payload, Response> {
  constructor(scriptURL: string | URL, options?: WorkerOptions) {
    super(scriptURL, options);
  }

  subscribe<R = Response>(observer: (response: R) => void) {
    const onMessage = (event: TypedMessageEvent<R>) => {
      observer(event.data);
    };
    this.addEventListener('message', onMessage);

    return () => {
      this.removeEventListener('message', onMessage);
    };
  }

  request<P = Payload, R = Response>(payload: P) {
    return new Promise((resolve: (response: R) => void) => {
      const onMessage = ({ data }: TypedMessageEvent<R>) => {
        resolve(data);
        this.removeEventListener('message', onMessage);
      };
      this.postMessage(payload);
      this.addEventListener('message', onMessage);
    });
  }
}
