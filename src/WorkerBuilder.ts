
import { UtilWorker } from "./UtilWorker";


export class WorkerBuilder<Payload, Response> {
  static fromModule<Payload, Response>(
    fn: (data: Payload) => Response,
    Worker = UtilWorker,
  ) {
    const code = `
        self.addEventListener('message', event => {
          const { id, payload } = event.data;
          const result = (${fn.toString()})(payload);
          
          self.postMessage({ id, payload: result });
        });
      `.trim();
    const blob = new Blob([code]);

    return new Worker<Parameters<typeof fn>[0], ReturnType<typeof fn>>(URL.createObjectURL(blob));
  }
}

