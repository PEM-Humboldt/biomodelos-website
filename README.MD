# BioModelos v2.5.0

[BioModelos](http://biomodelos.humboldt.org.co) is a web app that facilitates the generation, validation and consultation of hypothesis of species distribution for the continental biodiversity of Colombia. As such, it provides tools to (1) improve existing species distribution models (SDMs) by integrating expert's opinion, (2) generate expert maps and (3) publish SDMs. Our objective is to provide freely and openly access to the most up to date information on species distributions, validated by a large network of researchers, to support national environmental decision making processes and research.


# Requirements

## Services
Deploy these services before setting up the app:

- BioModelos API Service [GitHub Repo](https://github.com/LBAB-Humboldt/biomodelos_db_api)
- SQL Database Service


## Software

- Ruby v2.6.3
- Nodejs v8.17.0
- Google account to use Maps, reCaptcha and Gmail services
- [Docker](https://www.docker.com) version 17.05 or up.
- Git

# Setup

## Download the source code

Clone the repo to the server where you are deploying the app:

```$ git clone git://github.com/LBAB-Humboldt/BioModelos.v2.git```

## Configuration
Some files and paths in BioModelos need to be configured in order for the app to work as intended.

### Database
- Create a [database.yml](https://edgeguides.rubyonrails.org/configuring.html#configuring-a-database) file with the configuration of your SQL Service and add it to the */config/* path.

### Files
- public/models folder with raster files.
- public/thumbs folder with thumbnails image files.
- public/zip folder with zip files of the models.
- public/methods
- public/uploads

### API
You need to setup a path to the BioModelos API service URL using the file *[/config/initializers/url.rb](config/initializers/url.rb)*

```BASE_URI = "http://localhost:3000/v2"; ```


### Keys and credentials
The app needs the following keys which you can set up in a *local_env.yml* file under the *config* folder like this:

```
SECRET_KEY_BASE: [secret key base]

\# Google Maps API
GOOGLE_MAPS_KEY: [key]

\# Google reCaptcha
RECAPTCHA_SITE_KEY: [site key]
RECAPTCHA_SECRET_KEY: [secret key]

\# Mail Server Gmail
GMAIL_USERNAME: [username]
GMAIL_PASSWORD: [password]

\# API GATEWAY
GATEWAY_API_KEY: [site key]
```
There, you should put information about:
- Rails Application key.
- Google maps key.
- Recaptcha key.
- SMTP credentials.
- [Optional] Credentials for api gateway if you have one

# Run

## Install dependencies

### Ruby dependencies
- `gem install bundler`
- `bundle install`

### Javascript dependencies
- `npm install bower`
- `npx bower install` (If you installed bower globally omit `npx` command)

## Copying static files

If you are part of the biomodelos team or has an agreement with us, there are some static .PDF, .PNG and .ZIP files you need to copy to the /public/ folder. Those files are part of the guides and graphic pieces to advertise BioModelos and are not part of our repo.

### [Optional] Run database migrations

If the database is new or has a different schema from the one in [db/schema](db/schema.rb) you need to execute the **migrations** (*/db/migrate/*) following [this guide](https://guides.rubyonrails.org/v4.2/active_record_migrations.html#running-migrations).

### Run
#### With development environment
`bundle exec rails s -b0.0.0.0`
#### With production environment
First make sure the credentials in the [database config file](config/database.yml) are correct for the production environment.

Next precompile assets:

`bundle exec rake assets:precompile`

And run:

`bundle exec rails s -b0.0.0.0 -e production`

# Deploy with docker

## Build the image
On the root path of the rails app you enter this command to build the image:

```$ docker build -t <image name>:<tag> --no-cache .```

### Starting the container

Once you have the image, it's recommended to use [docker-compose](https://docs.docker.com/compose/) to run the container.

You need to create a docker-compose.yml file and set the volumes according to the models, thumbnails, zip and uploads folders like this:

```
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

  ```$ docker-compose -d up```


## LICENSE

The MIT License (MIT) 2018 - [Instituto de Investigación de Recursos Biológicos Alexander von Humboldt](http://humboldt.org.co). Please have a look at the [LICENSE.md](LICENSE.md) file for more details.
