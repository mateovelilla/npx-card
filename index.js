#!/usr/bin/env node
'use strict'
const path = require('path')
const fs = require('fs');
const os = require('os')
const { execSync } = require('child_process')
const { setInterval: setIntervalPromise, setTimeout: timerPromise } = require('timers/promises');
const Jimp = require('jimp');
const boxen = require('boxen');
const clear = require('clear');
const chalk = require('chalk');
const cliSpinners = require('cli-spinners');
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
async function card(path_to_work) {
    const images = fs.readdirSync(path.resolve(path_to_work, './imgs/languages'))
    const images_processed= []
    for  (const image of images) {
        const image_read = await Jimp.read(
            path.resolve(
              path_to_work,
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
    await printFrames(boxen_images, 3000)
}
async function asyncPrintVideo(frames_path) {
  
  const folder_frames = fs.readdirSync(frames_path)
  const file = fs.createWriteStream(path.resolve(frames_path, 'movie.txt'),{
    flags: 'a+',
  })
  const ac = new AbortController();
  const { signal } = ac;
  loader('Loading frames....', signal)
  for await (const img of folder_frames) {
    const frame = await Jimp.read(
      path.resolve(
      frames_path,
      img
      )
    ) 
    const frame_resize = frame.resize(process.stdout.columns - 5,process.stdout.rows - 5)
    const frame_convert_to_ascci = convertImageToAscii(frame_resize)
    file.write('break - line' + frame_convert_to_ascci.join(""))
  }
  ac.abort()
  const movie = fs.readFileSync(path.resolve(frames_path, 'movie.txt'))
  const movie_splitting = movie.toString().split('break - line') 
  await printFrames(movie_splitting, 30)
}
function deleteFolderRecursive (path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
async function loader(message, signal) {
  try {
    const loader_spinner = cliSpinners.bouncingBall.frames;
    let count = 0;
    for await (const timer of setIntervalPromise(90, 'Hola', { signal }) ) {
      clear()
      if (count < loader_spinner.length - 1) {
        count++;
        const frameToPrint = framesInTheBox(
          chalk.hex('#97ce4c').bold(message + loader_spinner[count]),
          new Array(process.stdout.rows - 4).fill(
            new Array(process.stdout.columns).fill(' ').join('') +
            '\n'
          ).join('')
        )
        console.log(frameToPrint)
      }else {
        count = 0;
      }
    }
  } catch (error) {
    return false
  }
}

async function main(){
  clear()
  const tempdir = os.tmpdir()
  if(!fs.existsSync(path.resolve(tempdir,'./npx-card'))) {
    const ac = new AbortController();
    const { signal } = ac;
    loader('Downloading repo....', signal)
    execSync(
      `git clone https://github.com/mateovelilla/npx-card.git`,
      {
        cwd: tempdir
      }
    )
    ac.abort()
  }
  if (process.argv[2]) {
    if(process.argv[2] === "--video=samurai") {
      await asyncPrintVideo(path.resolve(tempdir, './npx-card/frames/samurai_jack' ))
  
    } else {
      await asyncPrintVideo(path.resolve(tempdir, './npx-card/frames/rick_and_morty' ))
    }
  } else {
    await card(path.resolve(tempdir,'npx-card'))
  }
  if(fs.existsSync(path.resolve(tempdir,'./npx-card'))) deleteFolderRecursive(path.resolve(tempdir, './npx-card'))
}

function framesInTheBox(title,content) {
  return boxen(
    content,
    {
        title: title,
        titleAlignment: 'center',
        margin: 0,
        padding: 0,
        borderStyle: 'round',
        borderColor: '#97ce4c',
        backgroundColor: '#171421'
    }
  )
}
main()
