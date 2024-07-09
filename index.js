const axios = require('axios');

const cheerio = require('cheerio');



class APKPureScraper {

  constructor() {

    this.baseUrl = 'https://apkpure.com';

    this.headers = {

      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',

      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',

      'Accept-Language': 'en-US,en;q=0.5',

      'Accept-Encoding': 'gzip, deflate, br, zstd',

      'Referer': 'https://apkpure.com/',

      'Upgrade-Insecure-Requests': '1',

      'Sec-Fetch-Dest': 'document',

      'Sec-Fetch-Mode': 'navigate',

      'Sec-Fetch-Site': 'same-origin',

      'Sec-Fetch-User': '?1',

      'Connection': 'keep-alive',

      'TE': 'trailers'

    };

  }



  async fetchHTML(url) {

    try {

      const response = await axios.get(url, { headers: this.headers });

      return response.data;

    } catch (error) {

      throw new Error(`Failed to fetch HTML: ${error.message}`);

    }

  }



  async fetchAPKData(appUrl) {

    if (!appUrl) {

      throw new Error('Please provide the APKPure app URL');

    }



    try {

      const html = await this.fetchHTML(appUrl);

      const $ = cheerio.load(html);



      const title = $('div.title_link h1').text().trim();

      const rating = $('span.details_stars.icon').text().trim();

      const reviews = $('a.details_score.icon').text().trim();

      const version = $('p.details_sdk span').first().text().trim();

      const developer = $('span.developer a').text().trim();

      const releaseDate = $('p.date').text().trim();



      const description = $('div').find('p').toArray().map(p => $(p).text().trim()).join('\n');



      const whatsNewTitle = $('.whats-new-info h3').text().trim();

      const whatsNewDate = $('.whats-new-info .date').text().trim();

      const whatsNewContent = $('.whats-new-info p').next().text().trim();



      const additionalInfo = [];

      $('.additional-item').each((i, elem) => {

        const title = $(elem).find('.title').text().trim();

        const info = $(elem).find('.additional-info').text().trim();

        additionalInfo.push({ title, info });

      });



      const screenshots = [];

      $('.screen').each((i, elem) => {

        const links = [];

        const videoLink = $(elem).find('.details-tube').attr('data-src');

        links.push(videoLink);

        $(elem).find('.screen-pswp').each((j, linkElem) => {

          const imageLink = $(linkElem).attr('href');

          links.push(imageLink);

        });

        screenshots.push({ links });

      });



      const tags = [];

      $('.tag-box .tag-item').each((i, elem) => {

        const tag = $(elem).find('a').text().trim();

        tags.push(tag);

      });



      const gamesData = [];

      $('.scroll-box a.apk').each((i, elem) => {

        const name = $(elem).attr('title');

        const star = $(elem).find('.stars-box .star').text();

        const link = $(elem).attr('href');

        const packageName = $(elem).data('dt-app');



        gamesData.push({

          name,

          star,

          link,

          packageName

        });

      });



      const htmlDown = await this.fetchHTML(`${appUrl}/download`);

      const $$ = cheerio.load(htmlDown);

      const moreInfo = [];



      $$('div.module.more-info ul li').each((index, element) => {

        const label = $$(element).find('.info .label').text().trim();

        const value = $$(element).find('.info .value').text().trim();

        if (label && value) {

          moreInfo.push({ label, value });

        }

      });



      return {

        author: 'HACXK',

        version: '1.0.3',

        data: {

          title,

          rating,

          reviews,

          version,

          developer,

          releaseDate,

          description,

          screenshots,

          whatsNew: {

            title: whatsNewTitle,

            date: whatsNewDate,

            content: whatsNewContent

          },

          additionalInfo,

          tags,

          moreInfo,

          downloadLink: `https://d.apkpure.com/b/APK/${moreInfo[0].value}?version=latest`,

          similarApps: gamesData

        }

      };

    } catch (error) {

      throw new Error(`Error fetching APK data: ${error.message}`);

    }

  }



  async fetchAPKPureListData(searchTerm) {

    const url = `${this.baseUrl}/search?q=${searchTerm}`;

    try {

      const html = await this.fetchHTML(url);

      const $ = cheerio.load(html);

      const data = [];

      const dataTwo = [];



      $('li').each((index, element) => {

        const app = {};

        app.name = $(element).find('.r .p1').text().trim();

        app.developer = $(element).find('.r .p2').text().trim();

        app.category = $(element).find('.r .tags .tag').text().trim();

        app.size = $(element).find('.right_button .is-download').attr('data-dt-filesize');

        app.version = $(element).find('.right_button .is-download').attr('data-dt-version');

        app.versionCode = $(element).find('.right_button .is-download').attr('data-dt-versioncode');

        app.package = $(element).find('.right_button .is-download').attr('data-dt-app');

        app.downloadUrl = $(element).find('.right_button .is-download').attr('href');

        app.iconUrl = $(element).find('.l img').attr('src');



        if (app.name && app.developer && app.category && app.size && app.version && app.versionCode && app.package && app.downloadUrl && app.iconUrl) {

          data.push(app);

        }

      });



      $('.search-res li').each((index, element) => {

        const appTwo = {};

        const $dl = $(element).find('dl');

        appTwo.name = $dl.find('.p1').text().trim();

        appTwo.developer = $dl.find('.p2').text().trim();

        appTwo.category = $dl.find('.tag').text().trim();

        appTwo.imgUrl = $dl.find('.l img').attr('src');

        appTwo.downloadUrl = $dl.find('.is-download').attr('href');



        if (appTwo.name && appTwo.developer && appTwo.category && appTwo.imgUrl && appTwo.downloadUrl) {

          dataTwo.push(appTwo);

        }

      });



      return { author: 'HACXK', version: '1.0.3', result: data, suggestions: dataTwo };

    } catch (error) {

      throw new Error(`Failed to fetch data from APKPure: ${error.message}`);

    }

  }

}



module.exports = APKPureScraper;