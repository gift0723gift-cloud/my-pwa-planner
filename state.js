
export const VERSION='7.0.0';
export const state={userId:null,data:null,space:'work',camera:{x:0,y:0,scale:1},selectedId:null,actionsId:null,detailId:null,editId:null,linkSourceId:null,selectedLinkId:null,gesture:{mode:'IDLE',pointers:new Map()},lastTap:{id:null,time:0},ui:{hint:true,authMode:'login'}};
export const TYPE_LABELS={project:'Проект',process:'Рабочий процесс',person:'Человек',idea:'Идея',goal:'Цель'};
export const LEVELS=[1,2,3];
export const uid=()=>crypto.randomUUID?.()||`${Date.now()}_${Math.random().toString(16).slice(2)}`;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
