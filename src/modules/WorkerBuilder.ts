
interface WorkerConstructor<Worker> {
  new(scriptURL: string | URL, options?: WorkerOptions): Worker;
  prototype: Worker;
}

interface Options extends WorkerOptions {
  module: (...args: any[]) => any;
}

export class WorkerBuilder {
  static fromModule<W extends Worker>(
    Worker: WorkerConstructor<W>,
    { module, ...options }: Options
  ) {
    const code = `
        self.addEventListener('message', async event => {
          const result = await (${module.toString()})(${module.length > 1 ? '...event.data' : 'event.data'});
          
          self.postMessage(result);
        });
      `.trim();

    const blob = new Blob([code]);
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url, options);
    const originTerminate = worker.terminate;

    worker.terminate = () => {
      originTerminate.call(worker);
      URL.revokeObjectURL(url);
    }

    return worker;
  }
}