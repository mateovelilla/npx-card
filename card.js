#!/usr/bin/env node
'use strict';
const util = require('util');
const path = require('path');
const fs = require('fs');
// var zlib = require('zlib');
const exec = util.promisify(require('child_process').exec);
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
    process.stdout.rows - MARGIN_AND_PADDING - 1,
    LANGUAGES_IMAGES_FOLDER = './imgs/languages',
    RESOLUTIONS = [
      {
        name: '800_x_600',
        columns: 64,
        rows: 22,
      },
      {
        name: '1024_x_768',
        columns: 85,
        rows: 30,
      },
      {
        name: '1152_x_864',
        columns: 94,
        rows: 34,
      },
      {
        name: '1280_x_720',
        columns: 108,
        rows: 28,
      },
      {
        name: '1280_x_768',
        columns: 108,
        rows:  30,
      },
      {
        name: '1280_x_800',
        columns: 108,
        rows: 31,
      },
      {
        name: '1280_x_960',
        columns: 108,
        rows: 38,
      },
      {
        name: '1280_x_1024',
        columns: 108,
        rows: 41,
      },
      {
        name: '1360_x_768',
        columns: 115,
        rows: 30,
      },
      {
        name: '1400_x_1050',
        columns: 119,
        rows: 42,
      },
      {
        name: '1440_x_900',
        columns: 122,
        rows: 35,
      },
      {
        name: '1600_x_1200',
        columns: 137,
        rows:  48,
      },
      {
        name: '1680_x_1050',
        columns: 144,
        rows: 42,
      },
      {
        name: '1792_x_1344',
        columns: 154,
        rows: 55,
      },
      {
        name: '1856_x_1392',
        columns: 160,
        rows: 57,
      },
      {
        name: '1920_x_1200',
        columns: 166,
        rows: 43,
      },
      {
        name: '1920_x_1440',
        columns: 166,
        rows: 48,
      },
    ];
const chars = [" ", " ", ".", ":", "!", "+", "*", "e", "$", "@", "8"];
const color = true;
const join = "";
const RATE = 30;
// var stopper = false;
const data = {
  me: `I'm ${chalk.hex('#97ce4c').bold('Mateo Velilla')} full stack developer, \n
        I just like to know how everything works and learn from it,
        I consider myself an eternal learner,
        I like to think that: ${
          chalk.hex('#97ce4c').bold(`
            Imagination is more important than knowledge.
            Knowledge is limited and imagination surrounds the world.`)}`,
  language_platforms: [
    {
      'title': 'Javascript',
      'img': 'javascript.png'
    },
    {
      'title': 'Node JS',
      'img': 'nodejs.jpg'
    },
    {
      'title': 'Rust',
      'img': 'rustlang.png'
    },
    {
      'title': 'CSS',
      'img': 'css.png'
    },
    {
      'title': 'AWS',
      'img': 'aws.png'
    },
    {
      'title': 'Google Cloud',
      'img': 'gc.jpg'
    }
  ],
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
  while (y != ROWS + 6) {
    const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y))
    const relativeLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b);
    let index = Math.floor(relativeLuminance / (255 / chars.length));
    if (chars[index]) pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r, g, b)}m` : ""}` + chars[index])
    else pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r, g, b)}m` : ""}` + chars[0])
    if (x !== COLUMNS - 12) x++;
    else {
      x = 0;
      y++;
      pixels.push("\n")
    }
  }
  return pixels
}

async function printFrame(imageUrl, title) {
  try {
    const image = await readFrame(imageUrl)
    const imageInAscci = convertImageToAscii(image)
    const frameInbox = boxen(join + imageInAscci.join(join), {
      title,
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
async function printFrames(frames, time) {
  console.log(frames.pop())
  const timer = setInterval(() => {
    if(frames.length) {
      clear()
      console.log(frames.pop())
    }else {
      clearInterval(timer)
    }
  },time)
}
// function getFrameWithRate(rate, value) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(function () {
//       return resolve(value)
//     }, rate)
//   })
// }

async function downloadBash() {
  return await exec(`curl -LJO ${URL_BASH}`);
}
async function loader({ message = "", stop = false, cb }) {
  const EMOJI = '🏃 🦖'
  const SIZE_columns = process.stdout.columns;
  const SIZE_ROWS = process.stdout.rows;
  let count = Math.round(SIZE_columns/2)  - message.length - 12
  const TIME = 100
  const timer = setInterval(()=>{
    if(count && count <= SIZE_columns) {
      count--;
      clear()
      const content = boxen(
        '\n'.repeat(SIZE_ROWS - 12),
        {
          title: chalk.hex('#ffdcb3').bold(
            message +
            new Array(count).fill(' ').join(' ') +
            EMOJI +
            new Array(SIZE_columns - count).fill(' ').join(' ')
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
async function buildImagesByResolution() {
  const logosToConvert = await fs.readdirSync(LANGUAGES_IMAGES_FOLDER)
  
  // Create Folders
  await Promise.all(RESOLUTIONS.map(({name}) => fs.mkdirSync(path.resolve(__dirname, `./imgs/${name}`))))
  await Promise.all(logosToConvert.map(async (logo) => {
    return await Promise.all(
      RESOLUTIONS
        .map(({
          name,
          columns,
          rows
        }) => exec(
            `./scripts/build-images-by-resolution.sh  ${LANGUAGES_IMAGES_FOLDER}/${logo} ${columns} ${rows} ./imgs/${name}/${logo}`
          )
        )
    )
  }))

}
async function main() {
  let timer;
  loader({ message: "Loading frames...", stop: false, cb: (error, interval) => {
    timer = interval
  }});
  await downloadBash();
  //BULD LOGOS BY COLUMNS AND ROWS
  // await exec(`chmod +x ./scripts/build-images.sh`);
  // await Promise.all(data.language_platforms.map(({img})=> exec(`./scripts/build-images.sh ./npx-card/imgs/${img} ${COLUMNS} ${ROWS} ./npx-card/frames/logos/${language} ${RATE}`)))
  // await exec(`./scripts/build-images.sh ./npx-card/imgs/nodejs.jpg ${COLUMNS} ${ROWS} ./npx-card/frames/logos/nodejs.jpg ${RATE}`)

  //BULD LOGOS
  // const laguages_platforms = data.language_platforms.map(async ({title, img})=> {
  //   return printFrame(
  //       path.resolve(__dirname,`./imgs/800_600/nodejs.jpg`),
  //       title
  //     )
  // })
  // const languages = await Promise.all(laguages_platforms)
  const images = await fs.readdirSync(LANGUAGES_IMAGES_FOLDER)
  clearInterval(timer);
  // console.log(await Promise.all(laguages_platforms))
  const node_js_logo_in_ascci =  await printFrame(path.resolve(__dirname,'./imgs/800_x_600/aws.png'));
  const frames = images.map((image)=> path.resolve(__dirname,`./imgs/800_x_600/${image}`))
  const framesToPrint = await Promise.all(frames.map(frame => printFrame(frame)))
  // const node
  // clearInterval(timer);
  // printFrames(languages,15000)
  clear()
  printFrames([
    ...framesToPrint,
    generateBox('Hi guys',data.me),
  ], 5000)
  // printFrames(laguages_platforms, 15000)
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
// buildImagesByResolution()