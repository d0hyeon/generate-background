# Request Background
This module does not actually run in the background.  
이 모듈은 실제로 백그라운드에서 동작하지는 않습니다. 

The actual implementation is Web Worker, and you must use in browser.
It also runs in an isolated environment and cannot be referenced by external variables.  
실제 구현은 웹 워커로 되어있고 반드시 브라우저에서만 사용해야 합니다. 또한 격리된 환경에서 실행되므로 외부의 변수에 참조하지 못합니다.

Most Workrs don't need to using this module.  
Recommended for long task  
대부분의 경우 이 모듈을 사용할 필요는 없으나, long task를 처리해야 할 경우 사용할것을 추천합니다. 

Most WebAPIs including DOM APIs are cannot be used Becuase they are run in Web Worker.  
WebWorker에서 실행되므로 DOM API를 포함한 WebAPI를 사용하지 못합니다.  

But you can use WebWorker API.  
대신 웹 워커 API를 사용할 수 있습니다.  
[Read More](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope)

## Example
**requestBackground**
```ts
async function runLongTask () {
  const result = await requestBackground(() => {
    let result = 0;
    for(let i = 0; i < 1_000_000_000_000; i++) {
      result++;
    }

    return result;
  })
}

```

**Background**
```ts
async function runLongTask () {
  const background = new Background(getRectCoordinate);

  const coordiate = await background.request(
    canvas.getContext('2d').getImageData(0, 0, 1000, 1000)
  )
}

function getRectCoordinate(imageData: ImageData) {
  const { data, width } = imageData;

  let [
    minX, minY, 
    maxX, maxY
  ] = [Infinity, Infinity, 0, 0];

  for(let i = 0, leng = data.length; i < leng; i += 4) {
    const [r, g, b, a] = data.slice(i, i+4);
    const isFilled = Math.max(r, g, b, a) > 0;
    
    if(isFilled) {
      const y = Math.floor(i / 4 / width);
      const x = Math.floor(i / 4 - width * y);

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);

      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  return { 
    x: minX === Infinity ? 0 : minX, 
    width: maxX, 
    y: minY === Infinity ? 0 : minY, 
    height: maxY,
  };
}
```

