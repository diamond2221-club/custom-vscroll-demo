var D=s=>{throw TypeError(s)};var T=(s,e,i)=>e.has(s)||D("Cannot "+i);var t=(s,e,i)=>(T(s,e,"read from private field"),i?i.call(s):e.get(s)),a=(s,e,i)=>e.has(s)?D("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,i),u=(s,e,i,c)=>(T(s,e,"write to private field"),c?c.call(s,i):e.set(s,i),i),f=(s,e,i)=>(T(s,e,"access private method"),i);import z from"$/v-scroll.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const p of l.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&c(p)}).observe(document,{childList:!0,subtree:!0});function i(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function c(r){if(r.ep)return;r.ep=!0;const l=i(r);fetch(r.href,l)}})();const q=()=>{if(document.head.querySelector("#v-scroll-style"))return;const s=document.createElement("style");s.id="v-scroll-style",s.textContent=z,document.head.appendChild(s)},P=3,Y=16,M=(s,e,i)=>Math.max(Y,Math.round(s/e*i)),S=(s,e)=>s-e-P*2,U=(s,e,i)=>P+s/e*i,j=(s,e,i)=>s/i*e;var o,h,n,y,w,_,v,d,B,I,N,E,A,L,k,H,b,x,O;const F=(O=class extends HTMLElement{constructor(){super(...arguments);a(this,d);a(this,o,null);a(this,h,null);a(this,n,null);a(this,y,0);a(this,w,0);a(this,_,!1);a(this,v,null);a(this,E,()=>{const e=t(this,o).clientHeight;if(t(this,o).scrollHeight<=e){t(this,h).classList.remove("visible");return}t(this,h).classList.add("visible"),f(this,d,A).call(this)});a(this,L,()=>{f(this,d,A).call(this)});a(this,k,e=>{e.button===0&&(e.stopPropagation(),e.preventDefault(),t(this,n).setPointerCapture(e.pointerId),u(this,_,!0),u(this,y,e.clientY),u(this,w,t(this,o).scrollTop),t(this,n).setAttribute("part","bar bar-active"),t(this,h).setAttribute("part","track track-active"),t(this,n).addEventListener("pointermove",t(this,H)),t(this,n).addEventListener("pointerup",t(this,b)),t(this,n).addEventListener("pointercancel",t(this,b)))});a(this,H,e=>{if(!t(this,_))return;const i=e.clientY-t(this,y),c=t(this,o).clientHeight,r=t(this,o).scrollHeight,l=t(this,h).clientHeight,p=M(c,r,l),m=r-c,g=S(l,p),C=j(i,m,g);t(this,o).scrollTop=Math.max(0,Math.min(m,t(this,w)+C))});a(this,b,e=>{u(this,_,!1),t(this,n).releasePointerCapture(e.pointerId),t(this,n).setAttribute("part","bar"),t(this,h).setAttribute("part","track"),t(this,n).removeEventListener("pointermove",t(this,H)),t(this,n).removeEventListener("pointerup",t(this,b)),t(this,n).removeEventListener("pointercancel",t(this,b))});a(this,x,e=>{if(e.target===t(this,n))return;e.preventDefault();const i=t(this,h).getBoundingClientRect(),c=e.clientY-i.top,r=t(this,o).clientHeight,l=t(this,o).scrollHeight,p=t(this,h).clientHeight,m=M(r,l,p),g=l-r,C=S(p,m),R=(c-P-m/2)/C*g;t(this,o).scrollTo({top:Math.max(0,Math.min(g,R)),behavior:"smooth"})})}connectedCallback(){q(),f(this,d,B).call(this),f(this,d,I).call(this)}disconnectedCallback(){f(this,d,N).call(this)}},o=new WeakMap,h=new WeakMap,n=new WeakMap,y=new WeakMap,w=new WeakMap,_=new WeakMap,v=new WeakMap,d=new WeakSet,B=function(){const e=this.attachShadow({mode:"open"});u(this,o,document.createElement("div")),t(this,o).setAttribute("part","viewport");const i=document.createElement("slot");t(this,o).appendChild(i),u(this,h,document.createElement("s")),t(this,h).setAttribute("part","track"),u(this,n,document.createElement("b")),t(this,n).setAttribute("part","bar"),t(this,h).appendChild(t(this,n)),e.appendChild(t(this,o)),e.appendChild(t(this,h));const c=document.createElement("style");c.textContent=`
      :host {
        display: block;
        position: relative;
        overflow: hidden;
      }
      [part="viewport"] {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        /* 隐藏系统滚动条：webkit 方案 + 标准方案 */
        scrollbar-width: none;
        -ms-overflow-style: none;
        box-sizing: border-box;
      }
      [part="viewport"]::-webkit-scrollbar {
        display: none;
      }
      [part~="track"] {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
      }
      [part~="track"].visible {
        display: block;
      }
      [part~="bar"] {
        position: absolute;
        left: 0;
        right: 0;
      }
    `,e.prepend(c)},I=function(){t(this,o).addEventListener("scroll",t(this,L)),t(this,n).addEventListener("pointerdown",t(this,k)),t(this,h).addEventListener("pointerdown",t(this,x)),u(this,v,new ResizeObserver(t(this,E))),t(this,v).observe(t(this,o)),this.shadowRoot.querySelector("slot").addEventListener("slotchange",t(this,E))},N=function(){var e,i,c,r;(e=t(this,o))==null||e.removeEventListener("scroll",t(this,L)),(i=t(this,n))==null||i.removeEventListener("pointerdown",t(this,k)),(c=t(this,h))==null||c.removeEventListener("pointerdown",t(this,x)),(r=t(this,v))==null||r.disconnect(),u(this,v,null)},E=new WeakMap,A=function(){const e=t(this,o).clientHeight,i=t(this,o).scrollHeight,c=t(this,o).scrollTop,r=t(this,h).clientHeight,l=M(e,i,r),p=i-e,m=S(r,l),g=U(c,p,m);t(this,n).style.height=l+"px",t(this,n).style.top=g+"px"},L=new WeakMap,k=new WeakMap,H=new WeakMap,b=new WeakMap,x=new WeakMap,O);customElements.define("v-scroll",F);
