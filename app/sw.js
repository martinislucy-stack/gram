// Gram: obavijesti (v1.11)
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={title:"Gram",body:e.data?e.data.text():""}}
 e.waitUntil(self.registration.showNotification(d.title||"Gram",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:d.tag||"gram",renotify:true,requireInteraction:!!d.urgent,data:{url:d.url||"./"}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const u=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
 e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(const c of l){if(c.url.startsWith(self.registration.scope)&&"focus" in c)return c.focus()}return self.clients.openWindow(u)}))});
