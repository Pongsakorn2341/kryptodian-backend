<a name="readme-top"></a>


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* Node.js 20.* and above
* Yarn - [Download & Install yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable). Yarn package manager.

### A typical top-level directory layout

    .
    ├── ...
    ├── kryptodian                    # Your project directory
    │   ├── kryptodian-frontend         # clone and installation frontend
    │   ├────── .env                         # Your Frontend environments
    │   ├── kryptodian-backend         # clone and installation backend
    │   ├────── .env                         # Your Backend environments
    │   └── docker-compose.yml          # docker file for start web application






## Installation

```bash
$ yarn install
```


## Setup


```
NODE_ENV=development
PORT=4444

# * BACKEND BASE ENDPOINT
BASE_ENDPOINT="http://localhost:4444"

# * JWT SECRET
JWT_SECRET=tottee

# * DATABASE URL
# postgresql://{database_username}:{database_password}@db:5432/{database_name}
DATABASE_URL=

# * COIN GECKO API KEY
COIN_GECKO_API_URL=https://pro-api.coingecko.com/api/v3
COIN_GECKO_API_KEY=

# * COIN MARKETCAP API KEY
COIN_MARKETCAP_API_URL=
COIN_MARKETCAP_API_KEY=

```

### Obtaining API KEYS

* Require Coin Gecko plan atleast 'Analyst'
[Coin GeckoAPI](https://www.coingecko.com/en/api/pricing)

[Coin Market Cap](https://coinmarketcap.com/api/pricing/)

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Diagram
![Diagram](./kryptodian-diagram.jpg)

## Contact

Pongsakorn Parsoppornpiboon - pongsakorn.psb@gmail.com
<br />
Github : https://github.com/Pongsakorn2341

<p align="right">(<a href="#readme-top">back to top</a>)</p>