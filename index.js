'use strict'
const path = require('path')
const fs = require('fs')
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
    const asccii_images = resize_images.map(({img,title}) => {
        return {
            img: convertImageToAscii(img),
            title
        }
    })
    const boxen_images = asccii_images.map(({img,title})=> boxen(
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
    printFrames(boxen_images, 3000)
}
main()