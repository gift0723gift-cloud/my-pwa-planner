
const DB='boonwave_media_v1',STORE='files';let dbp;
function db(){if(dbp)return dbp;dbp=new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});return dbp}
export async function putFile(file){const id=crypto.randomUUID();const d=await db();await new Promise((res,rej)=>{const t=d.transaction(STORE,'readwrite');t.objectStore(STORE).put(file,id);t.oncomplete=res;t.onerror=()=>rej(t.error)});return {id,name:file.name,type:file.type,size:file.size}}
export async function getUrl(id){const d=await db();const blob=await new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});return blob?URL.createObjectURL(blob):''}
export async function delFile(id){const d=await db();return new Promise((res,rej)=>{const t=d.transaction(STORE,'readwrite');t.objectStore(STORE).delete(id);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
