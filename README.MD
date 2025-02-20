# BioModelos v2.11.1

[BioModelos](http://biomodelos.humboldt.org.co) is a web app that facilitates the generation, validation and consultation of hypothesis of species distribution for the continental biodiversity of Colombia. As such, it provides tools to (1) improve existing species distribution models (SDMs) by integrating expert's opinion, (2) generate expert maps and (3) publish SDMs. Our objective is to provide freely and openly access to the most up to date information on species distributions, validated by a large network of researchers, to support national environmental decision making processes and research.

# Requirements

## Services

Deploy these services before setting up the app:

- BioModelos API Service [GitHub Repo](https://github.com/LBAB-Humboldt/biomodelos_db_api)
- PosgresSQL Database Service v.17

## Software

- Ruby version 3.1.6. It is advisable to use [rbenv](https://github.com/rbenv/rbenv#installation) to install and manage ruby local version.
- [Docker](https://www.docker.com) version 17.05 or up.
- [Git](https://git-scm.com/)
- [Bower](https://bower.io/)

# Setup

## Download the source code

Clone the repo to the server where you are deploying the app:

```sh
$ git clone git://github.com/LBAB-Humboldt/BioModelos.v2.git
```

## Web app database

To build the database according to the schema file using the SQL Service, you should follow the next steps:

1. Create a [database.yml](https://edgeguides.rubyonrails.org/configuring.html#configuring-a-database) file with the configuration of your SQL Service and add it to the _/config/_ path. Use _database_template.yml_ as a template which is located at _/config/_ folder
2. Once you have the Docker container running, you may execute the **migrations** (_/db/migrate/_) following [this guide](https://edgeguides.rubyonrails.org/active_record_migrations.html#running-migrations).

## Configuration

Some files and paths in BioModelos need to be configured in order for the app to work as intended.

### Files

- Models folder with raster files.
- Thumbnails folder with thumbnails image files.
- Zip folder with zip files of the models.

### Connection to other BioModelos services

You need to setup a path for the BioModelos API service URL and geoserver URL, then, you must create a new file _url.rb_ under the _/config/initializers/_ folder and setup the next env vars:

```sh
BASE_URI = "http://localhost:3000/v2";
GEOSERVER_URI = "http://localhost:8080/geoserver";
```

### Credentials and Keys

Is necessary to setup the secret keys and credentials in an encrypted file credentials.yml.enc. This file is specific for each environment (production, development or test).
This file needs the master key file to decrypt and modified the keys according to your specific requirements.
There is some [Information](https://webcrunch.com/posts/the-complete-guide-to-ruby-on-rails-encrypted-credentials) about how to setup the credentials.

In this file you should put information about:

- Rails Application key.
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

For Humboldt organization you must ask for the master keys file which you must add to config/credentials, it is inside the internal repository.

## Run

Install dependencies

```sh
$ gem install bundler

$ bundle install

$ bower install --allow-root
```

Run the following command to execute the app in your local env

```sh
$ bundle exec rails s -b 0.0.0.0
```
Extra configuration are at the internal repository.

### Dev env with docker

You can create a docker container for development purposes, just build the image with the dev file:

```sh
$ docker build -f Dockerfile.dev -t <image name> .
```

And remember to mount the volumes (or link them) in your source code path

## Deploy

### Copying static files

First, there are some static .PDF, .PNG and .ZIP files you need to copy to the /public/ folder. Those files are part of the guides and graphic pieces to advertise BioModelos and are not part of our repo.

### Building the image

On the root path of the rails app you enter this command to build the image:

```sh
$ docker build -t <image name>:<tag> .
```

### Starting the container

Once you have the image, it's recommended to use [docker-compose](https://docs.docker.com/compose/) to run the container.

You need to create a docker-compose.yml file and set the volumes according to the models, thumbnails, zip and uploads folders like this:

```sh
version: '3'
services:
  biomodelos:
    image: [image name]
    ports:
     - [host port]:[container port]"
    volumes:
     - /path/to/host/methods:/var/www/BioModelos/public/methods
     - /path/to/host/models:/var/www/BioModelos/public/models
     - /path/to/host/thumbs:/var/www/BioModelos/public/thumbs
     - /path/to/host/zip:/var/www/BioModelos/public/zip
     - /path/to/host/uploads:/var/www/BioModelos/public/uploads

```

Finally, you run the container with the next command:

```sh
$ docker-compose up -d
```

## LICENSE

The MIT License (MIT) 2018 - [Instituto de Investigación de Recursos Biológicos Alexander von Humboldt](http://humboldt.org.co). Please have a look at the [LICENSE.md](LICENSE.md) file for more details.
