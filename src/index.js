const axios = require('axios').default;
const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs');
const delay = require('delay');
const download = require('image-downloader');
const inquirer = require('inquirer');
const { setTerminalTitle } = require('./util/setTerminalTitle');

const urlPrefix = 'https://prnt.sc/';

const headers = {
  'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
};

let checked = 0;
let success = 0;
let notAvailable = 0;

console.clear();

function printSlug() {

  console.log(`


██████╗ ██████╗ ███╗   ██╗████████╗███████╗ ██████╗     ██████╗██████╗  █████╗ ██╗    ██╗██╗     ███████╗██████╗  ${chalk.yellow('     ██╗███████╗')}    
██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔════╝    ██╔════╝██╔══██╗██╔══██╗██║    ██║██║     ██╔════╝██╔══██╗ ${chalk.yellow('     ██║██╔════╝')}    
██████╔╝██████╔╝██╔██╗ ██║   ██║   ███████╗██║         ██║     ██████╔╝███████║██║ █╗ ██║██║     █████╗  ██████╔╝ ${chalk.yellow('     ██║███████╗')}    
██╔═══╝ ██╔══██╗██║╚██╗██║   ██║   ╚════██║██║         ██║     ██╔══██╗██╔══██║██║███╗██║██║     ██╔══╝  ██╔══██╗ ${chalk.yellow('██   ██║╚════██║')}    
██║     ██║  ██║██║ ╚████║   ██║   ███████║╚██████╗    ╚██████╗██║  ██║██║  ██║╚███╔███╔╝███████╗███████╗██║  ██║ ${chalk.yellow('╚█████╔╝███████║')}    
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝  ╚═╝ ${chalk.yellow(' ╚════╝ ╚══════╝')}    
                                                                                                            ${chalk.yellow('by Josesilveiraa#6586')}

  `);
}

printSlug();

if(!fs.existsSync('./images')) {
  fs.mkdir('./images', (err) => {
    if(err) throw err;
  });
}

function saveImage(url) {

  axios.get(url, { headers, timeout: 3000, }).then((response) => {

    const $ = cheerio.load(response.data);
    const image = $('#screenshot-image').attr('src');

    download.image({ url: image, dest: './images',  }).then(({ filename }) => {
      checked++;
      success++;
      setTerminalTitle(`Checked: ${checked} | Success: ${success} | Not available: ${notAvailable}`);

      console.log(chalk.green(`[ + ] Screenshot ${url.split('/').pop()} saved to ${filename}`));
    }).catch(() => {
      checked++;
      notAvailable++;
      setTerminalTitle(`Checked: ${checked} | Success: ${success} | Not available: ${notAvailable}`);

      console.log(chalk.red(`[ - ] Screenshot ${url.split('/').pop()} doesn't exists.`));
    });

  }).catch((err) => {
    if(err) {
      if(err.response.status === 403) {
        console.clear();
        printSlug();
        console.log(chalk.red('[ - ] Cloudflare blocked your IP, use a VPN. Proxies are not supported yet.'));
        process.exit();
      }
    }
  });
}

function generateRandomId(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
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
    type: 'number',
    message: 'How much images do you want to download?',
  },
]).then((answer) => {
  if(!answer.images_length) {
    console.log(chalk.red('Please enter a valid number'));
  } else {
    const imagesLength = Number(answer.images_length);

    console.clear();
    printSlug();
    console.log(chalk.green(`Downloading ${imagesLength} images from https://prnt.sc\n\n`));

    downloadRandomImages(imagesLength);
  }
});