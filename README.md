# Web Background
This module is implemented as a Web Worker and is available in web browsers.  
해당 모듈은 웹 워커로 구현되며 브라우저에서 사용할 수 있습니다. 

It runs in isolation, can't be access external variables and modules  
격리된 환경에서 실행되므로 외부 모듈 및 외부 변수에 접근할 수 없습니다.

In most cases, this module is not required.
Recommended for long task  
대부분의 경우 이 모듈을 사용할 필요는 없으나, long task를 처리해야 할 경우 사용할 것을 추천합니다. 

Most WebAPIs including DOM APIs are cannot be used Becuase they are run in Web Worker.  
WebWorker에서 실행되므로 DOM API를 포함한 WebAPI를 사용하지 못합니다.  

## Example

**background**
```ts
async function runLongTask () {
  const getCoordinate = background((imageData: ImageData) => {
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
  })

  const coordinate = await getCoordinate(
    canvas.getContext('2d').getImageData(0, 0, 1000, 1000)
  )
}
```

