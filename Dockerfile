FROM public.ecr.aws/docker/library/ruby:3.1.6-alpine

ENV BUILD_PACKAGES="curl-dev build-base openssh"

ENV DEV_PACKAGES="tzdata libxml2-dev libxslt-dev postgresql-dev imagemagick imagemagick-dev git gmp-dev nodejs npm"

ENV BASE_URI="http://build-placeholder/api/v2"
ENV GEOSERVER_URI="http://build-placeholder/geoserver/"

RUN apk --update --upgrade add $BUILD_PACKAGES $DEV_PACKAGES && rm -rf /var/cache/apk/*
RUN npm install -g yarn

ENV RAILS_ROOT=/var/www/BioModelos
RUN mkdir -p $RAILS_ROOT
WORKDIR $RAILS_ROOT

COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.6.5
RUN bundle install

COPY . .

RUN yarn install --check-files
RUN bundle exec rake assets:precompile

CMD ["sh", "-c", "rm -f tmp/pids/server.pid && bundle exec rails s -b 0.0.0.0 -e production"]
