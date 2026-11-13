function L(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var $={exports:{}},n={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h=Symbol.for("react.element"),U=Symbol.for("react.portal"),B=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),F=Symbol.for("react.profiler"),N=Symbol.for("react.provider"),z=Symbol.for("react.context"),H=Symbol.for("react.forward_ref"),W=Symbol.for("react.suspense"),X=Symbol.for("react.memo"),K=Symbol.for("react.lazy"),b=Symbol.iterator;function G(e){return e===null||typeof e!="object"?null:(e=b&&e[b]||e["@@iterator"],typeof e=="function"?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},j=Object.assign,M={};function d(e,t,r){this.props=e,this.context=t,this.refs=M,this.updater=r||g}d.prototype.isReactComponent={};d.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};d.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function O(){}O.prototype=d.prototype;function w(e,t,r){this.props=e,this.context=t,this.refs=M,this.updater=r||g}var S=w.prototype=new O;S.constructor=w;j(S,d.prototype);S.isPureReactComponent=!0;var x=Array.isArray,P=Object.prototype.hasOwnProperty,C={current:null},A={key:!0,ref:!0,__self:!0,__source:!0};function I(e,t,r){var o,u={},c=null,l=null;if(t!=null)for(o in t.ref!==void 0&&(l=t.ref),t.key!==void 0&&(c=""+t.key),t)P.call(t,o)&&!A.hasOwnProperty(o)&&(u[o]=t[o]);var i=arguments.length-2;if(i===1)u.children=r;else if(1<i){for(var s=Array(i),f=0;f<i;f++)s[f]=arguments[f+2];u.children=s}if(e&&e.defaultProps)for(o in i=e.defaultProps,i)u[o]===void 0&&(u[o]=i[o]);return{$$typeof:h,type:e,key:c,ref:l,props:u,_owner:C.current}}function J(e,t){return{$$typeof:h,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function E(e){return typeof e=="object"&&e!==null&&e.$$typeof===h}function Q(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var R=/\/+/g;function _(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Q(""+e.key):t.toString(36)}function v(e,t,r,o,u){var c=typeof e;(c==="undefined"||c==="boolean")&&(e=null);var l=!1;if(e===null)l=!0;else switch(c){case"string":case"number":l=!0;break;case"object":switch(e.$$typeof){case h:case U:l=!0}}if(l)return l=e,u=u(l),e=o===""?"."+_(l,0):o,x(u)?(r="",e!=null&&(r=e.replace(R,"$&/")+"/"),v(u,t,r,"",function(f){return f})):u!=null&&(E(u)&&(u=J(u,r+(!u.key||l&&l.key===u.key?"":(""+u.key).replace(R,"$&/")+"/")+e)),t.push(u)),1;if(l=0,o=o===""?".":o+":",x(e))for(var i=0;i<e.length;i++){c=e[i];var s=o+_(c,i);l+=v(c,t,r,s,u)}else if(s=G(e),typeof s=="function")for(e=s.call(e),i=0;!(c=e.next()).done;)c=c.value,s=o+_(c,i++),l+=v(c,t,r,s,u);else if(c==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return l}function m(e,t,r){if(e==null)return e;var o=[],u=0;return v(e,o,"","",function(c){return t.call(r,c,u++)}),o}function Y(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var a={current:null},k={transition:null},Z={ReactCurrentDispatcher:a,ReactCurrentBatchConfig:k,ReactCurrentOwner:C};function T(){throw Error("act(...) is not supported in production builds of React.")}n.Children={map:m,forEach:function(e,t,r){m(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return m(e,function(){t++}),t},toArray:function(e){return m(e,function(t){return t})||[]},only:function(e){if(!E(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};n.Component=d;n.Fragment=B;n.Profiler=F;n.PureComponent=w;n.StrictMode=q;n.Suspense=W;n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Z;n.act=T;n.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=j({},e.props),u=e.key,c=e.ref,l=e._owner;if(t!=null){if(t.ref!==void 0&&(c=t.ref,l=C.current),t.key!==void 0&&(u=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(s in t)P.call(t,s)&&!A.hasOwnProperty(s)&&(o[s]=t[s]===void 0&&i!==void 0?i[s]:t[s])}var s=arguments.length-2;if(s===1)o.children=r;else if(1<s){i=Array(s);for(var f=0;f<s;f++)i[f]=arguments[f+2];o.children=i}return{$$typeof:h,type:e.type,key:u,ref:c,props:o,_owner:l}};n.createContext=function(e){return e={$$typeof:z,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:N,_context:e},e.Consumer=e};n.createElement=I;n.createFactory=function(e){var t=I.bind(null,e);return t.type=e,t};n.createRef=function(){return{current:null}};n.forwardRef=function(e){return{$$typeof:H,render:e}};n.isValidElement=E;n.lazy=function(e){return{$$typeof:K,_payload:{_status:-1,_result:e},_init:Y}};n.memo=function(e,t){return{$$typeof:X,type:e,compare:t===void 0?null:t}};n.startTransition=function(e){var t=k.transition;k.transition={};try{e()}finally{k.transition=t}};n.unstable_act=T;n.useCallback=function(e,t){return a.current.useCallback(e,t)};n.useContext=function(e){return a.current.useContext(e)};n.useDebugValue=function(){};n.useDeferredValue=function(e){return a.current.useDeferredValue(e)};n.useEffect=function(e,t){return a.current.useEffect(e,t)};n.useId=function(){return a.current.useId()};n.useImperativeHandle=function(e,t,r){return a.current.useImperativeHandle(e,t,r)};n.useInsertionEffect=function(e,t){return a.current.useInsertionEffect(e,t)};n.useLayoutEffect=function(e,t){return a.current.useLayoutEffect(e,t)};n.useMemo=function(e,t){return a.current.useMemo(e,t)};n.useReducer=function(e,t,r){return a.current.useReducer(e,t,r)};n.useRef=function(e){return a.current.useRef(e)};n.useState=function(e){return a.current.useState(e)};n.useSyncExternalStore=function(e,t,r){return a.current.useSyncExternalStore(e,t,r)};n.useTransition=function(){return a.current.useTransition()};n.version="18.3.1";$.exports=n;var y=$.exports;const ne=L(y);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),V=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var te={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=y.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:u="",children:c,iconNode:l,...i},s)=>y.createElement("svg",{ref:s,...te,width:t,height:t,stroke:e,strokeWidth:o?Number(r)*24/Number(t):r,className:V("lucide",u),...i},[...l.map(([f,D])=>y.createElement(f,D)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=(e,t)=>{const r=y.forwardRef(({className:o,...u},c)=>y.createElement(re,{ref:c,iconNode:t,className:V(`lucide-${ee(e)}`,o),...u}));return r.displayName=`${e}`,r};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=p("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=p("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=p("Bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=p("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=p("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=p("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=p("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=p("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);export{ue as A,ce as B,se as C,ie as M,le as P,ne as R,ae as T,fe as X,oe as a,y as r};
