
import {VERSION,uid} from './state.js';
const ACCOUNTS='boonwave_v7_accounts',SESSION='boonwave_v7_session',DATA='boonwave_v7_data_';
export function accounts(){try{return JSON.parse(localStorage.getItem(ACCOUNTS)||'{}')}catch{return {}}}
export function register(email,password){const a=accounts(); if(a[email])throw new Error('Аккаунт уже существует'); a[email]={password,id:uid()}; localStorage.setItem(ACCOUNTS,JSON.stringify(a)); return a[email].id}
export function login(email,password){const a=accounts(); if(!a[email]||a[email].password!==password)throw new Error('Неверный email или пароль'); return a[email].id}
export function setSession(id){localStorage.setItem(SESSION,id)} export function getSession(){return localStorage.getItem(SESSION)} export function clearSession(){localStorage.removeItem(SESSION)}
export function blank(){return {schema:1,version:VERSION,nodes:[],links:[],settings:{hintDismissed:false,cameras:{}},updatedAt:Date.now()}}
export function load(id){let raw=localStorage.getItem(DATA+id); if(raw){try{return normalize(JSON.parse(raw))}catch{}}
 const migrated=migrateV6(id); return migrated||blank();}
export function save(id,data){data.updatedAt=Date.now();data.version=VERSION;localStorage.setItem(DATA+id,JSON.stringify(data))}
function normalize(d){d.schema=1;d.nodes=(d.nodes||[]).map(n=>({level:2,assets:[],archived:false,locked:false,...n}));d.links=d.links||[];d.settings=d.settings||{hintDismissed:false,cameras:{}};return d}
function migrateV6(id){const keys=Object.keys(localStorage).filter(k=>k.startsWith('boonwave_v6_data_')); if(!keys.length)return null; let best=null;for(const k of keys){try{const d=JSON.parse(localStorage.getItem(k));if(!best||Number(d.updatedAt||0)>Number(best.updatedAt||0))best=d}catch{}} if(!best)return null;const out=normalize(best);localStorage.setItem(DATA+id,JSON.stringify(out));return out}
export function exportData(data){return new Blob([JSON.stringify(data,null,2)],{type:'application/json'})}
export function importData(text){return normalize(JSON.parse(text))}
