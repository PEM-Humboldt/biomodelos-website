FROM ruby:2.5-alpine
MAINTAINER Daniel Lopez <dlopez@humboldt.org.co>

ENV BUILD_PACKAGES="curl-dev build-base openssh"
#gmp-dev for nokogiri gem on Ubuntu
ENV DEV_PACKAGES="tzdata libxml2-dev libxslt-dev postgresql-dev imagemagick imagemagick-dev git gmp-dev nodejs npm"

RUN apk --update --upgrade add $BUILD_PACKAGES $DEV_PACKAGES && rm -rf /var/cache/apk/*
RUN npm install -g bower

ENV RAILS_ROOT /var/www/BioModelos
RUN mkdir -p $RAILS_ROOT
WORKDIR $RAILS_ROOT

COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.3.26
RUN bundle install

COPY . .

RUN bower install --allow-root
RUN bundle exec rake assets:precompile

CMD ["sh", "-c", "rm -f tmp/pids/server.pid && bundle exec rails s -b 0.0.0.0 -e production"]
