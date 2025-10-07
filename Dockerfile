# Etapa 1: build de dependencias y assets
FROM ruby:3.1.6-alpine AS builder

ENV BUILD_PACKAGES="build-base curl-dev openssh"
ENV DEV_PACKAGES="tzdata libxml2-dev libxslt-dev postgresql-dev imagemagick imagemagick-dev git gmp-dev nodejs npm dos2unix"

RUN apk --update --upgrade add $BUILD_PACKAGES $DEV_PACKAGES && rm -rf /var/cache/apk/*
RUN npm install -g yarn

ENV RAILS_ROOT=/var/www/BioModelos
WORKDIR $RAILS_ROOT

COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.6.5
RUN bundle install

COPY . .
RUN yarn install --check-files

# Precompila assets solo para produccion
ARG RAILS_ENV
ENV RAILS_ENV=${RAILS_ENV}
RUN if [ "$RAILS_ENV" != "development" ]; then bundle exec rake assets:precompile; fi

# Etapa 2: imagen final
FROM ruby:3.1.6-alpine

ENV RAILS_ROOT=/var/www/BioModelos
WORKDIR $RAILS_ROOT

RUN apk add --no-cache \
  tzdata \
  postgresql-client \
  imagemagick \
  dos2unix \
  nodejs \
  npm \
  yarn

  
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder $RAILS_ROOT $RAILS_ROOT


COPY entrypoint.sh /usr/bin/
RUN dos2unix /usr/bin/entrypoint.sh && chmod +x /usr/bin/entrypoint.sh


ARG RAILS_ENV
ENV RAILS_ENV=${RAILS_ENV}
ENV RAILS_LOG_TO_STDOUT=true

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
