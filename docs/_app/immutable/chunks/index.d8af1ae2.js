function p(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function g(e,n){return e==null||n==null?NaN:n<e?-1:n>e?1:n>=e?0:NaN}class o extends Map{constructor(n,t=d){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:t}}),n!=null)for(const[s,f]of n)this.set(s,f)}get(n){return super.get(u(this,n))}has(n){return super.has(u(this,n))}set(n,t){return super.set(c(this,n),t)}delete(n){return super.delete(h(this,n))}}function u({_intern:e,_key:n},t){const s=n(t);return e.has(s)?e.get(s):t}function c({_intern:e,_key:n},t){const s=n(t);return e.has(s)?e.get(s):(e.set(s,t),t)}function h({_intern:e,_key:n},t){const s=n(t);return e.has(s)&&(t=e.get(s),e.delete(s)),t}function d(e){return e!==null&&typeof e=="object"?e.valueOf():e}export{o as I,g as d,p as e};