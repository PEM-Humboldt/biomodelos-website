# BioModelos v2.13.2

[BioModelos](http://biomodelos.humboldt.org.co) is a web app that facilitates the generation, validation and consultation of hypothesis of species distribution for the continental biodiversity of Colombia. As such, it provides tools to (1) improve existing species distribution models (SDMs) by integrating expert's opinion, (2) generate expert maps and (3) publish SDMs. Our objective is to provide freely and openly access to the most up to date information on species distributions, validated by a large network of researchers, to support national environmental decision making processes and research.

## Requirements

### Services

Deploy these services before setting up the app:

- BioModelos API Service [GitHub Repo](https://github.com/LBAB-Humboldt/biomodelos_db_api)
- PosgresSQL Database Service v.17

### Software

- [Ruby](https://www.ruby-lang.org/en/documentation/) version 3.4.8. It is advisable to use [rbenv](https://github.com/rbenv/rbenv#installation) to install and manage ruby local version.
- [Docker](https://www.docker.com) version 17.05 or up.
- [Git](https://git-scm.com/).
- [npm](https://www.npmjs.com/) version 10.8.2.
- [Yarn classic](https://classic.yarnpkg.com/lang/en/) version 1.22.22. Install it using [npm](https://www.npmjs.com/package/yarn).

## Setup

### Download the source code

Clone the [repository](https://github.com/PEM-Humboldt/biomodelos-website) to the server where you are deploying the app:

```sh
$ git clone https://github.com/PEM-Humboldt/biomodelos-website.git
```

## Configuration

Some files and paths in BioModelos need to be configured in order for the app to work as intended.

### Files

- Models folder with raster files.
- Thumbnails folder with thumbnails image files.
- Zip folder with zip files of the models.

### Credentials and Keys

You need to configure the secret credentials in an encrypted file such as ENVIRONMENT.yml.enc, where ENVIRONMENT must be: production, development or test.

There are more [Information](https://webcrunch.com/posts/the-complete-guide-to-ruby-on-rails-encrypted-credentials) about how to setup the credentials.

These credentials files require the master key file (ENVIRONMENT.key) to decrypt and modify the keys according to your specific requirements.

In this file you should put information about:

- Google maps key.
- Recaptcha keys (Version 2 and 3).
- SMTP credentials.

Content file example:

```sh
# Rails Secret Key
SECRET_KEY_BASE: "secret key"

# Google Maps API
google_maps:
  GOOGLE_MAPS_KEY: "secret key"

# Google reCaptcha
recaptcha:
  RECAPTCHA_SITE_KEY_V2: "secret key"
  RECAPTCHA_SECRET_KEY_V2: "secret key"
  RECAPTCHA_SITE_KEY_V3: "secret key"
  RECAPTCHA_SECRET_KEY_V3: "secret key"

# Mail Server Gmail
mail_server:
  GMAIL_USERNAME: "secret email"
  GMAIL_PASSWORD: "secret password"
```

For Humboldt organization, you must copy the encrypted files and the master keys from the internal repository to `config/credentials`.

### Environment variables and other BioModelos services

To run the application, you need to setup the environment variables in the .env file, as in this [example](./env.example) into the root project folder. This file contains environment variables for the rails application, configuration variables for the docker container, database and other BioModelos services as geoserver and [api](https://github.com/PEM-Humboldt/biomodelos-api).

## Web app database

To build the database according to the schema file using the SQL Service, you should follow the next steps:

1. You must setup the database variables at the .env file.
2. After that you may execute the **migrations** `/db/migrate/` following [this guide](https://edgeguides.rubyonrails.org/active_record_migrations.html#running-migrations).

## Run

**Important**: You should have installed previously Ruby 3.4.8.

Install dependencies using these commands in your terminal

```sh
$ gem install bundler -v 2.6.5

$ bundle install

$ yarn
```

For run the app at local terminal, you must set the env variables such as:

```sh
$ BASE_URI=http://yourAPI \
GEOSERVER_URI=http://yourGeoserver/ \
DB_DATABASE=database \
DB_USER=user \
DB_PASSWORD=pass \
DB_HOST=localhost \
DB_PORT=5432 \
bin/rails server -p PORT
```

Extra configuration are at the internal repository.

## Dockerization

### Dev env with docker

You must config the variable `config.web_console.allowed_ips` at [development.rb](config/environments/development.rb) to allow the local ips for debug.

You can create a docker container for development purposes, just build the image with the [docker-compose.dev.yml](./docker-compose.dev.yml) file:

```sh
$ docker-compose -f docker-compose.dev.yml up -d --build
```

And remember to configure the volumes in the .env file

## Deploy

### Copying static files

First, there are some static .PDF, .PNG and .ZIP files that you need to copy to the `/public/` folder. Those files are part of the guides and graphic pieces to advertise BioModelos and are not part of our repo.

### Environment variables

Configure the .env file according to the [example](./env.example).

You must modify the .env file and configure the volumes according to the methods, models, thumbs, zip, uploads and credentials folders.

### Running the container

It's recommended to use [docker-compose](https://docs.docker.com/compose/) to build the image and run the container.

The [production docker-compose](./docker-compose.prod.yml) file is included in the repository.

On the root path of the rails app you enter this command to build the image and run the container:

```sh
$ docker-compose -f docker-compose.prod.yml up -d --build
```

## LICENSE

The MIT License (MIT) 2018 - [Instituto de Investigación de Recursos Biológicos Alexander von Humboldt](http://humboldt.org.co). Please have a look at the [LICENSE.md](LICENSE.md) file for more details.
