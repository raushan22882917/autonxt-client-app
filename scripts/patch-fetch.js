const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(__dirname, '../node_modules/whatwg-fetch/fetch.js'),
  path.join(__dirname, '../node_modules/whatwg-fetch/dist/fetch.umd.js')
];

const targetStr = 'xhr.onload = function() {';
const patchStr = `xhr.onload = function() {
        if (xhr.status === 0 && !(request.url.indexOf('file://') === 0 || request.url.indexOf('content://') === 0)) {
          setTimeout(function() {
            reject(new TypeError('Network request failed'));
          }, 0);
          return;
        }`;

filesToPatch.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found, skipping patch: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("reject(new TypeError('Network request failed'))") && content.includes("xhr.status === 0")) {
    console.log(`File already patched: ${filePath}`);
    return;
  }
  
  if (!content.includes(targetStr)) {
    console.error(`Target string not found in file: ${filePath}`);
    return;
  }
  
  content = content.replace(targetStr, patchStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully patched: ${filePath}`);
});
