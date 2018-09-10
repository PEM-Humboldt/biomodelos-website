# BioModelos v2  
<div align="center">
![BioModelos](http://biomodelos.humboldt.org.co/biomodelosFB.jpg)
</div> 
 
[BioModelos]([biomodelos.humboldt.org.co](http://biomodelos.humboldt.org.co)) is a web app that facilitates the generation, validation and consultation of hypothesis of species distribution for the continental biodiversity of Colombia. As such, it provides tools to (1) improve existing species distribution models (SDMs) by integrating expert's opinion, (2) generate expert maps and (3) publish SDMs. Our objective is to provide freely and openly access to the most up to date information on species distributions, validated by a large network of researchers, to support national environmental decision making processes and research.  
  
  
# Requirements  
  
  
## Services  
Deploy these services before setting up the app:
  
- MongoDB Database Service [GitHub Repo](https://github.com/LBAB-Humboldt/biomodelos_db_api)  
- BioModelos API Service [GitHub Repo](https://github.com/LBAB-Humboldt/biomodelos_db_api)  
- SQL Database Service  
  
  
## Software  
  
- [Docker](https://www.docker.com) version 17.05 or up.  
- Git  
  
  
# Setup  
  
## Download the source code  
  
Clone the repo to the server where you are deploying the app:  
  
```$ git clone git://github.com/LBAB-Humboldt/BioModelos.v2.git```
  
## Web app database  
  
To build the database according to the schema file using the SQL Service, you should follow the next steps:

1. Create a [database.yml](https://edgeguides.rubyonrails.org/configuring.html#configuring-a-database) file with the configuration of your SQL Service and add it to the */config/* path.
2. Once you have the Docker container running, you may execute the **migrations** (*/db/migrate/*) following [this guide](https://edgeguides.rubyonrails.org/active_record_migrations.html#running-migrations).
  
## Configuration  
Some files and paths in BioModelos need to be configured in order for the app to work as intended.  
  
### Files  
- Models folder with raster files.  
- Thumbnails folder with thumbnails image files.  
- Zip folder with zip files of the models.  
  
### API  
You need to setup a path to the BioModelos API service URL using the file */config/initializers/url.rb*  
  
```BASE_URI = "http://localhost:3000/v2"; ```
  
  
### Keys and credentials  
The app needs the following keys which you can set up in a *local_env.yml* file like this: 

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
```
There, you should put information about:
- Rails Application key.  
- Google maps key.  
- Recaptcha key.  
- SMTP credentials.  
  
  
## Docker  
  
### Building the image  
On the root path of the rails app you enter this command to build the image:  
  
```$ docker build -t <image name>:<tag> .```  
  
### Starting the container  
  
  Once you have the image, you can run the container with the next command:
  
  ```$ docker run  --restart always -t -d -p <host port>:3000 -v /path/to/BioModelos.v2:/home/BioModelos.v2 <image name>:<tag>```
  
### Configuration

To finish the configuration process and start the server, you have to access the container entering this command:
```$ docker exec -it <container name or ID> /bin/sh```

Then go to the app directory:
``` cd /home/BioModelos.v2/ ```

To install all the rails dependencies you must install the Bundler gem first:
 ```gem install bundler```

And finally you install all the gems specified in the Gemfile file:
```bundle install```

### Installing the Javascript libraries
To install the javascript libraries declared in the Bower file (bower.json) :

```$ bower install --allow-root```

  
### Running the app

When all the gems, libraries, URLs and file paths have been configured, you can use the WEBrick server to run the app like this: 

```$ rails s -d -e production -b 0.0.0.0```

Then you can exit the docker container.

## LICENSE

The MIT License (MIT) 2018 - [Instituto de Investigación de Recursos Biológicos Alexander von Humboldt](http://humboldt.org.co). Please have a look at the LICENSE.md file for more details.