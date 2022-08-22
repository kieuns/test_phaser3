
// DOM 노드 : 주요 노트 프로퍼티 : https://ko.javascript.info/basic-dom-node-properties
// Element : https://developer.mozilla.org/ko/docs/Web/API/Element
// Document : https://developer.mozilla.org/ko/docs/Web/API/Document

// export class PopupA
// {
//     /** @type {Element} */
//     _rootElem = null;
//     _x = 0;
//     _y = 0;
//     /** @param {string} elemId */
//     constructor(elemId){
//         this._rootElem = document.getElementById(elemId);
//         console.log.apply(console, [this._rootElem]);
//         // this._rootElem.style.left;
//         // this._rootElem.style.top;
//     }
//     /** @param {boolean} show */
//     show(show)
//     {
//         if(show) {
//             this._rootElem.setAttribute("visibility", "visible");
//         }
//         else {
//             this._rootElem.setAttribute("visibility", "hidden");
//         }
//     }
// }

export function makePopup(elemId) {
    console.log(elemId);
    //return new PopupA(elemId);  
}



// /** @param {string} elemId */
// var PopupA = function(elemId) {
//     console.log('PopupA started');
//     this._rootElem = document.getElementById(elemId);
//     console.log.apply(console, [this._rootElem]);
//     // this._rootElem.style.left;
//     // this._rootElem.style.top;
// }
// /** @param {boolean} show */
// PopupA.prototype.show = function(show) {
//     if(show) {
//         this._rootElem.setAttribute("visibility", "visible");
//     }
//     else {
//         this._rootElem.setAttribute("visibility", "hidden");
//     }
// }