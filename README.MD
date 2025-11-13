# BioModelos v2.12.5

[BioModelos](http://biomodelos.humboldt.org.co) is a web app that facilitates the generation, validation and consultation of hypothesis of species distribution for the continental biodiversity of Colombia. As such, it provides tools to (1) improve existing species distribution models (SDMs) by integrating expert's opinion, (2) generate expert maps and (3) publish SDMs. Our objective is to provide freely and openly access to the most up to date information on species distributions, validated by a large network of researchers, to support national environmental decision making processes and research.

## Requirements

### Services

Deploy these services before setting up the app:

- BioModelos API Service [GitHub Repo](https://github.com/LBAB-Humboldt/biomodelos_db_api)
- PosgresSQL Database Service v.17

### Software

- [Ruby](https://www.ruby-lang.org/en/documentation/) version 3.1.6. It is advisable to use [rbenv](https://github.com/rbenv/rbenv#installation) to install and manage ruby local version.
- [Docker](https://www.docker.com) version 17.05 or up.
- [Git](https://git-scm.com/).
- [npm](https://www.npmjs.com/) version 10.8.2.
- [Yarn classic](https://classic.yarnpkg.com/lang/en/) version 1.22.22. Install it using [npm](https://www.npmjs.com/package/yarn).

## Setup

### Download the source code

Clone the [repository](https://github.com/PEM-Humboldt/biomodelos-website/tree/develop) to the server where you are deploying the app:

```sh
$ git clone https://github.com/PEM-Humboldt/biomodelos-website.git
```

## Web app database

To build the database according to the schema file using the SQL Service, you should follow the next steps:

1. Create a [database.yml](https://edgeguides.rubyonrails.org/configuring.html#configuring-a-database) file with the configuration of your SQL Service and add it to the ```/config/``` path. Use _database_template.yml_ as a template which is located at ```/config/``` folder
2. Once you have the Docker container running, you may execute the **migrations** ```/db/migrate/``` following [this guide](https://edgeguides.rubyonrails.org/active_record_migrations.html#running-migrations).

## Configuration

Some files and paths in BioModelos need to be configured in order for the app to work as intended.

### Files

- Models folder with raster files.
- Thumbnails folder with thumbnails image files.
- Zip folder with zip files of the models.

### Connection to other BioModelos services

You need to setup a path for the BioModelos API service URL and geoserver URL, then, you must create a new file ```url.rb``` under the ```/config/initializers/``` folder and setup the next env vars:

```sh
BASE_URI = "http://localhost:3000/v2";
GEOSERVER_URI = "http://localhost:8080/geoserver";
```

### Credentials and Keys

You need to configure the secret credentials in an encrypted file such as ENVIRONMENT.yml.enc, where ENVIRONMENT must be: production, development or test.

There are more [Information](https://webcrunch.com/posts/the-complete-guide-to-ruby-on-rails-encrypted-credentials) about how to setup the credentials.

These credentials files require the master key file (ENVIRONMENT.key) to decrypt and modify the keys according to your specific requirements.

For deploy, each master secret key must be added to the .env file according to the environment.
You will find more information below in the Environment variables section.

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

For Humboldt organization, you must copy the encrypted files and the master keys from the internal repository to ```config/credentials```.

These keys are required for the .env file and the dockerization. See the section below.

## Run

**Important**: You should have installed previously Ruby 3.1.6.

Install dependencies using these commands in your terminal

```sh
$ gem install bundler -v 2.6.5

$ bundle install

$ yarn
```

Run the following command to execute the app in your local env terminal

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

First, there are some static .PDF, .PNG and .ZIP files you need to copy to the ```/public/``` folder. Those files are part of the guides and graphic pieces to advertise BioModelos and are not part of our repo.

### Building the image

On the root path of the rails app you enter this command to build the image:

```sh
$ docker build -t <image name>:<tag> .
```
### Environment variables

There is [example](https://github.com/PEM-Humboldt/biomodelos-website/blob/JorgeHiguita/LIB-321/docker-compose.dev.yml) for the .env file for development environment, you must create the .env file based on this file for your environments. 

### Starting the container

Once you have the image, it's recommended to use [docker-compose](https://docs.docker.com/compose/) to run the container.

The docker compose files are included in the repository, there are two corresponding to development and production environments. 

You must need to modify the docker-compose.yml file and set the volumes according to the methods, models, thumbs, zip, uploads and credentials folders.

You have two environments, development and production, from the same image.
You can run the development environment container with the next command:

```sh
$ docker-compose -f docker-compose.dev.yml up -d --build
```

Or, you can run the production environment container with the next command:

```sh
$ docker-compose -f docker-compose.prod.yml up -d --build
```

## LICENSE

The MIT License (MIT) 2018 - [Instituto de Investigación de Recursos Biológicos Alexander von Humboldt](http://humboldt.org.co). Please have a look at the [LICENSE.md](LICENSE.md) file for more details.
