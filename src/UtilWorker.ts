
import { TypedMessageEvent, TypedWorker } from "./TypedWorker";
import { nanoid } from 'nanoid';


export class UtilWorker<Payload, Response> extends TypedWorker<Payload, Response> {
  constructor(src: string) {
    super(src);
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
      const id = nanoid();
      const onMessage = ({ data }: TypedMessageEvent<{ id: string, payload: R }>) => {
        if (id === data.id) {
          resolve(data.payload);

          this.removeEventListener('message', onMessage);
        }
      };
      this.postMessage({ id, payload });
      this.addEventListener('message', onMessage);
    });
  }

  terminate() {
    this.terminate();
  }
}
