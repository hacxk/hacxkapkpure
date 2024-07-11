# APKPure Scraper



[![npm version](https://img.shields.io/npm/v/hacxkapkpure.svg)](https://www.npmjs.com/package/hacxkapkpure) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)



A Node.js scraper for extracting APK information and search results from the APKPure website.



## Features



- **Fetch Detailed APK Data:** Get comprehensive details about a specific APK, including title, rating, version, description, developer, release date, and more.

- **Search for APKs:** Perform searches on APKPure and retrieve a list of relevant APKs with their essential information.

- **Promise-based:** Utilizes Promises for clean and asynchronous code flow.

- **Error Handling:** Includes error handling to gracefully manage potential issues during scraping.



## Installation



1. Make sure you have Node.js and npm (Node Package Manager) installed.

2. Install the scraper via npm:



```bash

npm install hacxkapkpure

```



## Usage



```javascript

const APKPureScraper = require('hacxkapkpure'); 



const scraper = new APKPureScraper();



// Fetch detailed APK data by URL

scraper.fetchAPKData('[https://apkpure.com/pubg-mobile-for-android/com.tencent.ig](https://apkpure.com/pubg-mobile-for-android/com.tencent.ig)')

    .then(data => {

        console.log(data); // { title: 'PUBG MOBILE', rating: '8.7', ... }

    })

    .catch(error => console.error('Error fetching APK data:', error));



// Search for APKs

scraper.fetchAPKPureListData('free fire')

    .then(results => {

        console.log(results); 

        /*

        {

            author: 'HACXK', 

            version: '1.0.3',

            result: [

                { name: 'Free Fire MAX', developer: 'Garena International I', ...},

                { name: 'PUBG MOBILE', developer: 'Level Infinite', ...},

                // ... (more results)

            ]

        }

        */

    })

    .catch(error => console.error('Error searching for APKs:', error));

```



## API Reference



### `fetchAPKData(url)`



- **Parameters:**

  - `url` (string): The APKPure URL of the app.

- **Returns:**

  - A Promise that resolves with an object containing the detailed APK data.

  

### `fetchAPKPureListData(query)`

- **Parameters:**

  - `query` (string): The search query for APKs.

- **Returns:**

  - A Promise that resolves with an object containing the search results and scraper information. 





## License



This project is licensed under the MIT License.



## Disclaimer



This scraper is for educational and informational purposes only. Please use it responsibly and respect the terms of service of APKPure and the app developers.




