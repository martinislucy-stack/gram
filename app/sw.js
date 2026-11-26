// Gram: obavijesti (v1.11) + rad bez interneta (v1.12.7)
const CACHE="gram-v1.13.1";
const CORE=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","favicon-32.png","/fonts/gram-fonts.css","https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,u.startsWith("http")?{mode:"cors"}:{})).catch(()=>{})))))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith("gram-")&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
const keep=(req,res)=>{if(res&&(res.ok||res.type==="opaque")){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c)).catch(()=>{})}return res};
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.origin!==self.location.origin&&u.hostname!=="cdn.jsdelivr.net")return; // Supabase i ostalo ide uvijek ravno na mrežu
 if(r.mode==="navigate"){ // stranica: prvo mreža (da je uvijek najnovija), bez interneta spremljena kopija
  e.respondWith(new Promise(ok=>{let done=false;const fb=()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("./")).then(m=>m||caches.match("index.html")).then(m=>{if(!done){done=true;ok(m||Response.error())}});
   const t=setTimeout(fb,4000);fetch(r).then(res=>{clearTimeout(t);keep(r,res);if(!done){done=true;ok(res)}}).catch(()=>{clearTimeout(t);fb()})}));return}
 // slova, ikone, biblioteke: spremljena kopija odmah, a u pozadini se osvježi
 e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(res=>keep(r,res)).catch(()=>m);return m||n}))});
self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={title:"Gram",body:e.data?e.data.text():""}}
 e.waitUntil(self.registration.showNotification(d.title||"Gram",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:d.tag||"gram",renotify:true,requireInteraction:!!d.urgent,data:{url:d.url||"./"}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const u=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
 e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(const c of l){if(c.url.startsWith(self.registration.scope)&&"focus" in c)return c.focus()}return self.clients.openWindow(u)}))});
