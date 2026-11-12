import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/premium.css':'premium.css','/assets/azure-pro.png':'assets/azure-pro.png','/app.js':'app.js'};
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',png:'image/png'};
http.createServer(async(req,res)=>{const path=new URL(req.url,'http://localhost').pathname;const file=files[path];if(!file){res.writeHead(404);res.end('Not found');return;}try{const data=await readFile(new URL('./dist/'+file,import.meta.url));res.writeHead(200,{'Content-Type':types[file.split('.').pop()]});res.end(data);}catch{res.writeHead(500);res.end('Unable to load preview');}}).listen(4173,'127.0.0.1',()=>console.log('Azure preview: http://127.0.0.1:4173'));
