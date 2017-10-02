const generateBMFont  = require('msdf-bmfont');
const colors          = require('colors');
const fs              = require('fs');
const path            = require('path');
const { spawn } = require('child_process');

// Path to directory..
let pathToFonts = path.join(__dirname, 'fonts'),
    fonts = [],
    current = 0;

let processFonts = ()=>{
  if (!fonts[current]) { return; }
  createBMFont(fonts[current].path, fonts[current].name);
  current++;
}

// Generate Font..
let createBMFont = (pathToFont, name) => {
  const child = spawn('node', ['generate.js', pathToFont, name]);
  child.on('error', function (error) {
    console.log(`child error ${error}`);
  });

  var result = '';
  child.stdout.on('data', function(data) {
    result += data.toString();
  });
  child.on('close', function(code) {
    console.log(result);
    processFonts();
  });
}

// List fonts in fonts/ directory
let listFonts = ()=>{
  var directories = fs.readdirSync(pathToFonts);
  for (let dir of directories) {
    let fullPath = path.join(pathToFonts, dir);
    if (fs.lstatSync(fullPath).isDirectory()) {
      var files = fs.readdirSync(fullPath);
      for (let file of files) {
        if (file.endsWith('ttf')) {
          fonts.push({
            path: fullPath,
            name: file.replace('.ttf', '')
          });
        }
      }
    }
  }
  processFonts();
}

// Added to make the repo lighter....
let removeTTF = ()=>{
  var directories = fs.readdirSync(pathToFonts);
  for (let dir of directories) {
    let fullPath = path.join(pathToFonts, dir);
    if (fs.lstatSync(fullPath).isDirectory()) {
      var files = fs.readdirSync(fullPath);
      for (let file of files) {
        if (file.endsWith('ttf')) {
          fs.unlinkSync(path.join(fullPath, file))
        }
      }
    }
  }
  processFonts();
}

removeTTF();

// .. Run..
//listFonts();
