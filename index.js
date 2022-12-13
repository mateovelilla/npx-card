'use strict'
const path = require('path')
const fs = require('fs');
const util = require('util')
const {setTimeout: timerPromise } = require('timers/promises');
const Jimp = require('jimp');
const boxen = require('boxen');
const clear = require('clear');
const chalk = require('chalk');
const chars = [" ", " ", ".", ":", "!", "+", "*", "e", "$", "@", "8"];
const color = true;
const data = {
    me: `I'm ${chalk.hex('#97ce4c').bold('Mateo Velilla')} full stack developer, \n
          I just like to know how everything works and learn from it,
          I consider myself an eternal learner,
          I like to think that: ${
            chalk.hex('#97ce4c').bold(`
              Imagination is more important than knowledge.
              Knowledge is limited and imagination surrounds the world.`)}
          My main interests are:`,
    name: chalk.hex("#c7fa6c").bold('           Mateo Velilla Ospina'),
    work: `${chalk.white('Full Stack Developer at')} ${chalk
      .hex('#cca918')
      .bold('Condor Labs')}`,
    github: chalk.cyan("https://github.com/mateovelilla"),
    twitter: chalk.cyan('https://twitter.com/r3v3r5ing'),
    linkedin:
      chalk.cyan('https://www.linkedin.com/in/mateo-velilla-ospina'),
    web: chalk.cyan('https://www.mateovelilla.dev/'),
    npx: chalk.red('npx') + ' ' + chalk.white('mateovelilla'),
    lofiMusic: "https://www.chosic.com/download-audio/24220/",
    labelWork: chalk.white.bold('        Work:'),
    labelTwitter: chalk.white.bold('        Twitter:'),
    labelGitHub: chalk.white.bold('        GitHub:'),
    labelLinkedIn: chalk.white.bold('        LinkedIn:'),
    labelWeb: chalk.white.bold('        Web:'),
    labelCard: chalk.white.bold('        Card:'),
  
};
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
    while (y !== process.stdout.rows - 5) {
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y))
      const relativeLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b);
      let index = Math.floor(relativeLuminance / (255 / chars.length));
      if (chars[index]) pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r, g, b)}m` : ""}` + chars[index])
      else pixels.push(`${color ? `\x1b[38;5;${rgbToAnsi256(r, g, b)}m` : ""}` + chars[0])
      if (x !== process.stdout.columns - 5) x++;
      else {
        x = 0;
        y++;
        pixels.push("\n")
      }
    }
    return pixels
}

async function printFrames(frames, time) {
    for await (const frame of frames) {
        clear()
        console.log(frame)
        await timerPromise(time, 'exmaple')
    }
}
async function main() {
    const images = fs.readdirSync(path.resolve(__dirname, './imgs/languages'))
    const images_processed= []
    for await (const image of images) {
        const image_read = await Jimp.read(
            path.resolve(
            __dirname,
            './imgs/languages/',
            image
            )
        )
        images_processed.push({
            img: image_read,
            title: image.split('.')[0].toUpperCase()
        })
    }
    
    const resize_images = images_processed.map(({title, img}) => {
        return {
            img: img.resize(process.stdout.columns - 5,process.stdout.rows - 5),
            title
        }
    })
    const ascii_images = resize_images.map(({img,title}) => {
        return {
            img: convertImageToAscii(img),
            title
        }
    })
    const boxen_images = ascii_images.map(({img,title})=> boxen(
        img.join(""),
        {
            title: title,
            titleAlignment: 'center',
            margin: 0,
            padding: 0,
            borderStyle: 'round',
            borderColor: '#97ce4c',
            backgroundColor: '#171421'
        }
    ))
    const about_me = boxen(data.me + `\n`.repeat(process.stdin.rows - data.me.split('\n').length), {
        title: chalk.hex('#ffdcb3').bold(
          'Hi guys' +
          new Array(process.stdout.columns - 'Hi guys'.length).fill(' ').join(' ')
        ), 
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: 'round',
        borderColor: '#97ce4c',
        backgroundColor: '#171421'
      })
    console.log(about_me)
    await timerPromise(15000)
    const {me, ...personal_information}= data;
    const last_slide = boxen(
      [
        `${personal_information.name}`,
        ``,
        `${personal_information.labelWork}  ${personal_information.work}`,
        ``,
        `${personal_information.labelTwitter}  ${personal_information.twitter}`,
        `${personal_information.labelGitHub}  ${personal_information.github}`,
        `${personal_information.labelLinkedIn}  ${personal_information.linkedin}`,
        `${personal_information.labelWeb}  ${personal_information.web}`,
        ``,
        `${personal_information.labelCard}  ${personal_information.npx}`,
      ].join('\n'),
      {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: 'round',
        borderColor: '#97ce4c',
        backgroundColor: '#171421'
      }
    );
    boxen_images.push(last_slide)
    printFrames(boxen_images, 3000)
}
// main()
async function asyncprintVideo(frames_path) {
  const folder_frames = fs.readdirSync(path.resolve(__dirname, frames_path))
  const file = fs.createWriteStream('movie.txt',{
    flags: 'a+',
  })
  for await (const img of folder_frames) {
    const frame = await Jimp.read(
      path.resolve(
      __dirname,
      frames_path,
      img
      )
    )
    const frame_resize = frame.resize(process.stdout.columns - 5,process.stdout.rows - 5)
    const frame_convert_to_ascci = convertImageToAscii(frame_resize)
    file.write('break - line' + frame_convert_to_ascci.join(""))
  }
  const movie = fs.readFileSync(path.resolve(__dirname, 'movie.txt'))
  const movie_splitting = movie.toString().split('break - line')
  printFrames(movie_splitting, 50)
  console.log("finished!")
}
if (process.argv[2]) {
  if(process.argv[2] === "--video=samurai") {
    asyncprintVideo('./frames/samurai_jack')
  } else {
    asyncprintVideo('./frames/rick_and_morty')
  }
} else {
  main()
}