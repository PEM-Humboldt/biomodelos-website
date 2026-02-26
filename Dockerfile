# Stage 1: building dependencies and assets
FROM ruby:3.4.8-alpine3.23 AS builder

ENV BUILD_PACKAGES="build-base curl-dev openssh pkgconf"
ENV DEV_PACKAGES="tzdata libxml2-dev libxslt-dev postgresql-dev imagemagick imagemagick-dev git gmp-dev nodejs npm dos2unix yaml yaml-dev libjpeg-turbo libjpeg-turbo-dev libstdc++"

RUN apk --update --upgrade add $BUILD_PACKAGES $DEV_PACKAGES && rm -rf /var/cache/apk/*

RUN npm install -g yarn

ENV RAILS_ROOT=/var/www/BioModelos
ENV BOOTSNAP_CACHE_DIR=/tmp/bootsnap

WORKDIR $RAILS_ROOT

COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.6.5
RUN bundle install

COPY . .
RUN yarn install --check-files


# Stage 2: final image
FROM ruby:3.4.8-alpine3.23

ENV RAILS_ROOT=/var/www/BioModelos
ENV BOOTSNAP_CACHE_DIR=/tmp/bootsnap

WORKDIR $RAILS_ROOT

RUN apk add --no-cache \
  tzdata \
  postgresql-client \
  imagemagick \
  dos2unix \
  nodejs \
  npm \
  yarn \
  libjpeg-turbo \
  libstdc++ \

COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder $RAILS_ROOT $RAILS_ROOT

COPY entrypoint.sh /usr/bin/
RUN dos2unix /usr/bin/entrypoint.sh && chmod +x /usr/bin/entrypoint.sh

ENV RAILS_LOG_TO_STDOUT=true

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
