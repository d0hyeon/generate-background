
import { TypedMessageEvent, TypedWorker } from "./TypedWorker";

export class UtilWorker<Payload = never, Result = void> extends TypedWorker<Payload, Result> {
  constructor(scriptURL: string | URL, options?: WorkerOptions) {
    super(scriptURL, options);
  }

  subscribe(observer: (response: Result) => void) {
    const onMessage = (event: TypedMessageEvent<Result>) => {
      observer(event.data);
    };
    this.addEventListener('message', onMessage);

    return () => {
      this.removeEventListener('message', onMessage);
    };
  }

  request(): Promise<Result>;
  request(payload: Payload): Promise<Result>;
  request(payload?: Payload) {
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
