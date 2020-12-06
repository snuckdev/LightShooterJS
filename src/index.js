const axios = require('axios').default;
const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs');
const delay = require('delay');
const download = require('image-downloader');
const inquirer = require('inquirer');

const urlPrefix = 'https://prnt.sc/';

const headers = {
  'User-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0',
};

console.clear();

console.log(chalk.green(`


██████╗ ██████╗ ███╗   ██╗████████╗███████╗ ██████╗     ██████╗██████╗  █████╗ ██╗    ██╗██╗     ███████╗██████╗          ██╗███████╗
██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔════╝    ██╔════╝██╔══██╗██╔══██╗██║    ██║██║     ██╔════╝██╔══██╗         ██║██╔════╝
██████╔╝██████╔╝██╔██╗ ██║   ██║   ███████╗██║         ██║     ██████╔╝███████║██║ █╗ ██║██║     █████╗  ██████╔╝         ██║███████╗
██╔═══╝ ██╔══██╗██║╚██╗██║   ██║   ╚════██║██║         ██║     ██╔══██╗██╔══██║██║███╗██║██║     ██╔══╝  ██╔══██╗    ██   ██║╚════██║
██║     ██║  ██║██║ ╚████║   ██║   ███████║╚██████╗    ╚██████╗██║  ██║██║  ██║╚███╔███╔╝███████╗███████╗██║  ██║    ╚█████╔╝███████║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝  ╚═╝     ╚════╝ ╚══════╝


`));

if(!fs.existsSync('./images')) {
  fs.mkdir('./images', (err) => {
    if(err) throw err;
  });
}

function saveImage(url) {

  const fileName = url.split('/')[1];
  let data;

  axios.get(url, { headers, timeout: 3000, }).then((response) => {

    const $ = cheerio.load(response.data);
    const image = $('#screenshot-image').attr('src');

    download.image({ url: image, dest: './images',  }).then(({ filename }) => {
      console.log(chalk.green('[ + ] Saved image to ' + filename))
    }).catch(() => {
      console.log(chalk.red('[ - ] The screenshot was removed or image does not exists.'));
    });

  }).catch((err) => {
    if(err) {
      if(err.response.status === 403) {
        console.log(chalk.red('[ - ] Cloudflare blocked your IP, use a VPN.'));
      }
    }
  });
}

function generateRandomId(length) {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function downloadRandomImages(images) {

  for(let i = 0; i < images; i++) {
    saveImage(`${urlPrefix}${generateRandomId(6)}`);
    await delay(500);
  }

}

inquirer.prompt([
  {
    name: 'images_length',
    type: 'input',
    message: 'How much images do you want to download?',
  },
]).then((answer) => {
  const imagesLength = Number(answer.images_length);

  console.log(chalk.green(`Downloading ${imagesLength} images from PrintScreen's website.\n\n`));

  downloadRandomImages(imagesLength);
});