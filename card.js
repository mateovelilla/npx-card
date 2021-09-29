#!/usr/bin/env node

'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const boxen = require('boxen');
const clear = require('clear');
const Jimp = require("jimp");
const chalk = require('chalk');
const MARGIN_AND_PADDING = 12;
const COLUMNS = (process.stdout.columns - MARGIN_AND_PADDING) % 2 === 0 ? 
  process.stdout.columns - MARGIN_AND_PADDING :
  process.stdout.columns - MARGIN_AND_PADDING + 1,
ROWS = (process.stdout.rows - MARGIN_AND_PADDING) % 2 === 0 ?
  process.stdout.rows - MARGIN_AND_PADDING :
  process.stdout.rows - MARGIN_AND_PADDING + 1;
const chars = [" ", " ", ".", ":", "!", "+", "*", "e", "$", "@", "8"];
const color = true;
const join = "";
const RATE = 30
clear();

const data = {
  name: chalk.hex("#c7fa6c").bold('           Mateo Velilla Ospina'),
  work: `${chalk.white('Full Stack Developer at')} ${chalk
    .hex('#cca918')
    .bold('Condor Labs')}`,
  github: chalk.cyan("https://github.com/mateovelilla"),
  twitter: chalk.cyan('https://twitter.com/r3v3r5ing'),
  linkedin:
    chalk.cyan('https://www.linkedin.com/in/mateo-velilla-ospina'),
  web: chalk.cyan('https://www.mateovelilla.com/'),
  npx: chalk.red('npx') + ' ' + chalk.white('mateovelilla'),
  interests:  chalk.cyan("Tests ") +
              chalk.green("Nodejs ") +
              chalk.yellow("Javascript ") +
              chalk.keyword("orange")("Rust ") +
              chalk.keyword("pink")("CSS ") +
              chalk.yellow("AWS ") +
              chalk.red("Pentesting"),
  labelWork: chalk.white.bold('        Work:'),
  labelTwitter: chalk.white.bold('        Twitter:'),
  labelGitHub: chalk.white.bold('        GitHub:'),
  labelLinkedIn: chalk.white.bold('        LinkedIn:'),
  labelWeb: chalk.white.bold('        Web:'),
  labelCard: chalk.white.bold('        Card:'),
  labelInterests: chalk.white('        Interest:')
};

const me = boxen(
  [
    `${data.name}`,
    ``,
    `${data.labelWork}  ${data.work}`,
    ``,
    `${data.labelTwitter}  ${data.twitter}`,
    `${data.labelGitHub}  ${data.github}`,
    `${data.labelLinkedIn}  ${data.linkedin}`,
    `${data.labelWeb}  ${data.web}`,
    `${data.labelInterests}  ${data.interests}`,
    ``,
    `${data.labelCard}  ${data.npx}`,
    ``,
    `${chalk.bold(
      "- I am one of those who think that humor and curiosity are the purest form of intelligence. -"
    )}`,
    `${chalk.bold("            🤪🤪🤪 please wait for the animation....")}`
  ].join('\n') + '\n'.repeat(ROWS - 15 ),
  {
    margin: 1,
    float: 'center',
    padding: 1,
    borderStyle: 'round',
    borderColor: '#97ce4c',
  }
);

async function readFrame(framePath) {
  if(!framePath)
    throw new Error('Path not found!');
  const image = await Jimp.read(framePath)
  return image
}

function rgbToAnsi256(r, g, b) {
  if (r === g && g === b) {
      if (r < 8) {
          return 16;
      }

      if (r > 248) {
          return 231;
      }

      return Math.round(((r - 8) / 247) * 24) + 232;
  }

  const ansi = 16
      + (36 * Math.round(r / 255 * 5))
      + (6 * Math.round(g / 255 * 5))
      + Math.round(b / 255 * 5);

  return ansi;
}
function convertImageToAscii(image) {
  let pixels = [] 
  let x = 0;
  let y = 0;
  while(y != ROWS){
    const {r,g,b} = Jimp.intToRGBA(image.getPixelColor(x, y))
    const relativeLuminance = (0.2126*r + 0.7152*g + 0.0722*b); 
    let index = Math.floor(relativeLuminance / (255 / chars.length));
    if(chars[index]) pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r,g,b)}m` : ""}`+chars[index])
    else pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r,g,b)}m` : ""}`+chars[0])
    if(x !== 136) x++;
    else {
        x = 0;
        y++;
        pixels.push("\n")
    }
  }
  return pixels
}

async function printFrame(frame){
  try {
    let pixels = [];
    let row = ''
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        row+='8'
      }
      pixels.push(row);
      row = ''
    }

    const image = await readFrame(`${__dirname}/frames/${frame}`)
    const imageInAscci = convertImageToAscii(image)
    const frameInbox = boxen(join+imageInAscci.join(join), {
      margin: 1,
      float: 'center',
      padding: 1,
      borderStyle: 'single',
      borderColor: '#97ce4c'
    })
    return frameInbox
  } catch (error) {
    console.log(error)
  }
}
function getFrameWithRate(rate, value){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      return resolve(value)
    },rate)
  })
}
async function main(){
  process.stdout.write(me);
  await exec(`./buildVideo.sh ./videos/morty.mp4 ${COLUMNS} ${ROWS} ${RATE}`)
  let files = require("fs").readdirSync(__dirname+"/frames/");
  const frames = []
  for (let i = 0; i < files.length; i++) {
    const frame = files[i];
    const frameToPrint = await printFrame(frame);
    frames.push(frameToPrint);
  }
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const frameWithRate = await getFrameWithRate(1000/RATE, frame);
    process.stdout.write("\u001b[0;0H");
    process.stdout.write(frameWithRate);
  }

}
main()