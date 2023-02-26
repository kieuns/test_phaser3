vite

* vite-template : <https://github.com/vitejs/vite/tree/main/packages/create-vite>

How to Catch Unhandled Javascript Errors
* <https://stackoverflow.com/questions/951791/javascript-global-event-mechanism>

```js
<script type="text/javascript">
//  window.onerror = function(msg, url, line, col, error) {
//     // Note that col & error are new to the HTML 5 spec and may not be
//     // supported in every browser.  It worked for me in Chrome.
//     var extra = !col ? '' : '\ncolumn: ' + col;
//     extra += !error ? '' : '\nerror: ' + error;
//
//     // You can view the information in an alert to see things working like this:
//     alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
//     //console.error("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
//
//     // TODO: Report this error via ajax so you can keep track
//     //       of what pages have JS issues
//
//     var suppressErrorAlert = true;
//     // If you return true, then error alerts (like in older versions of
//     // Internet Explorer) will be suppressed.
//     return suppressErrorAlert;
//  };
</script>
```

널 초기화 하려는데 아래 같은 에러가 뜬다면,

```'null' 형식은 'GameStat' 형식에 할당할 수 없습니다.ts(2322)```

tsconfig.json 파일에서 ```"strictNullChecks": false,``` 를 추가해서 검사를 막는다.
