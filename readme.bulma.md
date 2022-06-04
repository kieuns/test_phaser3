
# 카드형 모달

``` html
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">(타이틀)</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success">Start</button>
      <button class="button">Close</button>
    </footer>
  </div>
</div>
```

```<div class="modal">``` 의 클래스에  ```is-active```를 더하면 화면에 표시. 지우면 안보임.

이런 스크립트를 임의로 만들어야한다.

``` javascript
function openModal($el) {
    $el.classList.add('is-active');
}

function closeModal($el) {
    $el.classList.remove('is-active');
}
```

# 테이블

``` html
<table class="table">
  <thead>
    <tr>
      <th><abbr title="맵의 번호 (툴팁)">번호</abbr></th>
      <th>제이슨 데이터</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>abcde abcde abce</td>
    </tr>
    <tr>
      <th>2</th>
      <td>zzzzz zzzzz </td>
    </tr>
  </tbody>
</table>
```

# 이미지 모달

```
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">
    <p class="image is-1by1">
      <img src="https://bulma.io/images/placeholders/1280x960.png" alt="">
    </p>
  </div>
  <button class="modal-close is-large" aria-label="close"></button>
</div>
```

이미지의 크기 프리셋 (More in Bulma Images)

```
image
image.is-16x16
image.is-24x24
image.is-32x32
image.is-48x48
image.is-64x64
image.is-96x96
image.is-128x128
image.is-square
image.is-1by1
image.is-5by4
image.is-3by2
image.is-5by3
image.is-16by9
image.is-2by1
image.is-3by1
image.is-4by5
image.is-3by4
image.is-2by3
image.is-3by5
image.is-9by16
image.is-1by2
image.is-1by3
has-ratio
```