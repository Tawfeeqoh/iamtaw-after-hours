import {spawnSync} from 'node:child_process';
import {readFile,access} from 'node:fs/promises';
for(const f of ['dist/app.js','dist/software-renderer.js','server.mjs']){const r=spawnSync(process.execPath,['--check',f],{stdio:'inherit'});if(r.status!==0)process.exit(1);}
const html=await readFile('dist/index.html','utf8');
for(const m of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)){await access('dist/'+m[1]);}
for(const f of ['dist/vendor/three.module.js','dist/vendor/three.core.js','dist/assets/manrope-800.woff2','dist/assets/dm-sans.ttf'])await access(f);
console.log('JavaScript syntax and local entry-point assets checked.');
