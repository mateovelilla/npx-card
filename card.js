#!/usr/bin/env node
'use strict';
const util = require('util');
const path = require('path');
// const fs = require('fs');
// var zlib = require('zlib');
// const exec = util.promisify(require('child_process').exec);
const boxen = require('boxen');
const clear = require('clear')
const Jimp = require("jimp");
const chalk = require('chalk')
// const player = require('play-sound')();
const MARGIN_AND_PADDING = 12;
const cliSpinners = require('cli-spinners');
// const rdl = require("readline");
const URL_BASH = "https://raw.githubusercontent.com/mateovelilla/npx-card/master/buildVideo.sh",
  COLUMNS = (process.stdout.columns - MARGIN_AND_PADDING) % 2 === 0 ?
    process.stdout.columns - MARGIN_AND_PADDING :
    process.stdout.columns - MARGIN_AND_PADDING - 1,
  ROWS = (process.stdout.rows - MARGIN_AND_PADDING) % 2 === 0 ?
    process.stdout.rows - MARGIN_AND_PADDING :
    process.stdout.rows - MARGIN_AND_PADDING - 1;
const chars = [" ", " ", ".", ":", "!", "+", "*", "e", "$", "@", "8"];
const color = true;
const join = "";
// const RATE = 30;
// var stopper = false;
const data = {
  me: `I'm ${chalk.hex('#97ce4c').bold('Mateo Velilla')} full stack developer, \n
        I just like to know how everything works and learn from them,
        I consider myself an eternal learner,
        I like to think that: ${
          chalk.hex('#97ce4c').bold(`
            Imagination is more important than knowledge.
            Knowledge is limited and imagination surrounds the world.`)}`,
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
  interests: chalk.cyan("Tests ") +
    chalk.green("Nodejs ") +
    chalk.yellow("Javascript ") +
    chalk.keyword("orange")("Rust ") +
    chalk.keyword("pink")("CSS ") +
    chalk.yellow("AWS ") +
    chalk.red("Pentesting"),
  lofiMusic: "https://www.chosic.com/download-audio/24220/",
  labelWork: chalk.white.bold('        Work:'),
  labelTwitter: chalk.white.bold('        Twitter:'),
  labelGitHub: chalk.white.bold('        GitHub:'),
  labelLinkedIn: chalk.white.bold('        LinkedIn:'),
  labelWeb: chalk.white.bold('        Web:'),
  labelCard: chalk.white.bold('        Card:'),
  labelInterests: chalk.white('        Interest:'),
  labelLofiMusic: "       🎵🎵🎵 Lofi Music:"

};
// let contentCard = [
//   `${data.name}`,
//   ``,
//   `${data.labelWork}  ${data.work}`,
//   ``,
//   `${data.labelTwitter}  ${data.twitter}`,
//   `${data.labelGitHub}  ${data.github}`,
//   `${data.labelLinkedIn}  ${data.linkedin}`,
//   `${data.labelWeb}  ${data.web}`,
//   `${data.labelInterests}  ${data.interests}`,
//   ``,
//   `${data.labelCard}  ${data.npx}`,
//   ``,
//   `${data.labelLofiMusic}  ${data.lofiMusic}`,
//   ``,
//   `${chalk.bold(
//     "- I am one of those who think that humor and curiosity are the purest form of intelligence. -"
//   )}`,
//   `${chalk.bold("please wait for the animation, meanwhile listen to this song")}`
// ];
// const me = boxen(
//   contentCard.join('\n') + '\n'.repeat(ROWS - 15),
//   {
//     margin: 1,
//     float: 'center',
//     padding: 1,
//     borderStyle: 'round',
//     borderColor: '#97ce4c',
//   }
// );

async function readFrame(framePath) {
  if (!framePath)
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
  while (y != ROWS) {
    const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y))
    const relativeLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b);
    let index = Math.floor(relativeLuminance / (255 / chars.length));
    if (chars[index]) pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r, g, b)}m` : ""}` + chars[index])
    else pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r, g, b)}m` : ""}` + chars[0])
    if (x !== COLUMNS) x++;
    else {
      x = 0;
      y++;
      pixels.push("\n")
    }
  }
  return pixels
}

async function printFrame(imageUrl) {
  try {
    // const image = await readFrame(`./npx-card/frames/${frame}`)
    const image = await readFrame(imageUrl)
    const imageInAscci = convertImageToAscii(image)
    const frameInbox = boxen(join + imageInAscci.join(join), {
      margin: 1,
      float: 'center',
      padding: 1,
      borderStyle: 'round',
      borderColor: '#97ce4c',
      backgroundColor: '#171421'
    })
    return frameInbox
  } catch (error) {
    console.log(error)
  }
}

// function getFrameWithRate(rate, value) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(function () {
//       return resolve(value)
//     }, rate)
//   })
// }

// async function downloadBash() {
//   return await exec(`curl -LJO ${URL_BASH}`);
// }
async function loader({ message = "", stop = false, cb }) {
  const EMOJI = '🏃 🦖'
  const SIZE_COLUMS = process.stdout.columns;
  const SIZE_ROWS = process.stdout.rows;
  let count = Math.round(SIZE_COLUMS/2)  - message.length - 12
  const TIME = 100
  const timer = setInterval(()=>{
    if(count && count <= SIZE_COLUMS) {
      count--;
      clear()
      const content = boxen(
        '\n'.repeat(SIZE_ROWS - 12),
        {
          title: chalk.hex('#ffdcb3').bold(
            message +
            new Array(count).fill(' ').join(' ') +
            EMOJI +
            new Array(SIZE_COLUMS - count).fill(' ').join(' ')
          ), 
          margin: 1,
          float: 'center',
          padding: 1,
          borderStyle: 'round',
          borderColor: '#97ce4c',
          backgroundColor: '#171421'
          
        }
      );
      console.log(content)
    }else{
      count = Math.round(SIZE_COLUMS/2)  - message.length - 12
    }
  }, TIME ) 
  return cb(null,timer)
}
function generateBox(title, message) {
  return boxen(message + `\n`.repeat(ROWS - message.split('\n').length), {
    title: chalk.hex('#ffdcb3').bold(
      title +
      new Array(COLUMNS - title.length).fill(' ').join(' ')
    ), 
    margin: 1,
    float: 'center',
    padding: 1,
    borderStyle: 'round',
    borderColor: '#97ce4c',
    backgroundColor: '#171421'
  })
}
async function main() {
  const frames = []
  let timer;
  loader({ message: "Loading frames...", stop: false, cb: (error, interval) => {
    timer = interval
  }});
  //BULD NODEJS LOGO
  const node_js_logo_in_ascci =  await printFrame(path.resolve(__dirname,'./media/node-js-icon.jpg'));
  clearInterval(timer)
  console.log(node_js_logo_in_ascci)
  clear()
  console.log(generateBox('Hi guys',data.me))
  // setTimeout(()=> {
  //   console.log('Entro aca')
  //   clearInterval(timer)
  // },2000)
  // console.log('eeepa')
  // await downloadBash();
  // await loader({ stop: true });
  // clear();
  // loader({ message: "Permissions to bash" });
  // await exec(`chmod +x ./buildVideo.sh`);
  // await loader({ stop: true });
  // loader({ message: "Building frames" });
  // await exec(`./buildVideo.sh ./npx-card/videos/morty.mp4 ${COLUMNS} ${ROWS} ${RATE}`)
  // await loader({ stop: true });
  // let files = require("fs").readdirSync("./npx-card/frames/");
  // loader({ message: "Loading frames" });
  // for (let i = 0; i < files.length; i++) {
  //   const frame = files[i];
  //   const frameToPrint = await printFrame(frame);
  //   frames.push(frameToPrint);
  // }
  // await loader({ stop: true });
  // clear();
  // process.stdout.write(await getFrameWithRate(5000, me));
  // clear();
  // const audioRickAndMorty = player.play('./npx-card/audios/rickAndMortySong.mp3', function (err) {
  //   if (err && !err.killed) throw err
  // })
  // for (let i = 0; i < frames.length; i++) {
  //   const frame = frames[i];
  //   const frameWithRate = await getFrameWithRate(80 / RATE, frame);
  //   process.stdout.write("\u001b[0;0H");
  //   process.stdout.write(frameWithRate);
  // }
  // audioRickAndMorty.kill();

}
main()