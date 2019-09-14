# SE Fortune Capital
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Website naereen.github.io](https://img.shields.io/website-up-down-green-red/https/naereen.github.io.svg)](http://esoma-sefc.s3-website.us-east-2.amazonaws.com/)  

SE Fortune Capital (SEFC) is an online investment website that provides the latest market data and allows users to invest in real market assets with virtual currency.

***This website is merely a market simulator, meaning that no real transaction will ever occur. Users can deposit any amount of USD into their accounts, and any asset that a user owns remains virtual forever.***

**API Update: Sad news, IEX had a few changes to their API policies again, including restricting access to certain endpoints for free accounts. I have decided to stop code updates due to their excessive inconsistencies.**

## Build
### Prerequisites
*SEFC is developed with pure HTML, CSS, and JavaScript. No additional software is required to run the application other than a functional browser. The website uses Google Firebase for user authentication and persisting data.*

### Run
1. Connect to the Internet.
2. Clone the repository and change into the project directory.
3. Open index.html in a browser (Chrome or Firefox).

## Features
### Market Data
* Visitors can view the latest cryptocurrency prices with live updates 24/7.
* Visitors can view the stock sector performances with live updates when the market is open.
* Visitors can view the top gainers and losers of the stock market with live updates when the market is open.
* Visitors can look up any stock by its ticker symbol and view its latest data.
* Visitors can view the recent news of any public company listed in the major exchanges.

### Investment Simulator
* Users can sign up for free.
* Users will be able to login with e-mail and password after their accounts have been created.
* Users can deposit and withdraw virtual USD at any time with no limitations or restrictions.
* Users can view their total assets and asset distribution on the dashboard.
* Users can buy virtually any stock on the market at the current trading price.
* Users can buy from a selection of ten cryptocurrencies at the current trading price.
* Users can sell their assets at any time.
* Users can close their accounts.

## Warning
***This project utilizes a public API (IEX) as a source for querying market data. There is no guarantee that the API will always be actively maintained, and the website will stop functioning if the API goes down.***  

***Currently, IEX does not allow too many requests to be sent simultaneously, so if a user owns too many assets, his/her home page might not load properly due to the server rejecting excessive HTTP requests.***