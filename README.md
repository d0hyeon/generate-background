# Web Background
This module provides background runtime available on the web.  
웹에서 사용할 수 있는 백그라운드 실행환경을 제공합니다. 

## API
### background(fn)
  
  ```tsx
    type FunctionInBackground<Fn> = (...params: Parameters<Fn>) => Promise<ReturnType<Fn>>;
  
    background<Fn>(fn: Fn): FunctionInBackground<Fn>
  ```

## Example
[CodeSandbox](https://8pj3sf.csb.app/)

```ts
async function runLongTask () {
  const getVertexCoordinates = background((imageData: ImageData) => {
    const { data, width } = imageData;
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, 0, 0];

    for(let i = 0, leng = data.length; i < leng; i += 4) {
      const [r, g, b, a] = data.slice(i, i+4);
      const isFilled = Math.max(r, g, b, a) > 0;
      if(isFilled) {
        const y = Math.floor(i / 4 / width);
        const x = Math.floor(i / 4 - width * y);

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    return {
      x: minX === Infinity ? 0 : minX,
      y: minY === Infinity ? 0 : minY,
      width: maxX,
      height: maxY
    };
  })

  const coordinate = await getVertexCoordinates(
    canvas.getContext('2d').getImageData(0, 0, 1000, 1000)
  )
}
```


## Tip
- Web Background is implemented as a Web Worker and is available in web browsers.  
Web Background는 웹 워커로 구현되며 브라우저에서 사용할 수 있습니다. 

- In most cases, you don't need to use it. It's recommended to use it for long working  
대부분의 경우 이 모듈을 사용할 필요는 없으나, 비용이 큰 작업을 처리해야 할 경우 사용할 것을 추천합니다. 

- Most WebAPIs including DOM APIs are cannot be used.  
DOM API를 포함한 대부분의 WebAPI를 사용하지 못합니다.  
[Read More](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

- To send arguments, you must use data from structured clone algorithm types.  
인자로 전송 가능한 데이터 유형은 복사 가능한 타입의 데이터만 가능합니다.   
[Read More](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)

- It runs in isolation, cannot be access external variables and modules
격리된 환경에서 실행되므로 외부 모듈 및 외부 변수에 접근할 수 없습니다. 
