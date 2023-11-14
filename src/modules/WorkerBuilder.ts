
interface WorkerConstructor<Worker> {
  new(scriptURL: string | URL, options?: WorkerOptions): Worker;
  prototype: Worker;
}

interface Options<Payload = unknown, ReturnValue = void> extends WorkerOptions {
  module: (payload: Payload) => ReturnValue;
}

export class WorkerBuilder {
  static fromModule<W extends Worker>(
    Worker: WorkerConstructor<W>,
    { module, ...options }: Options
  ) {
    const code = `
        self.addEventListener('message', event => {
          const { id, payload } = event.data;
          const result = (${module.toString()})(payload);
          
          self.postMessage({ id, payload: result });
        });
      `.trim();
    const blob = new Blob([code]);

    return new Worker(URL.createObjectURL(blob), options);
  }
}

