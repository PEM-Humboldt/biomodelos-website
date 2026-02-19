# =========================
# Stage 1: build
# =========================
FROM ruby:3.4.8 AS builder

ENV RAILS_ROOT=/var/www/BioModelos
ENV BOOTSNAP_CACHE_DIR=/tmp/bootsnap

WORKDIR $RAILS_ROOT

# Dependencias del sistema (Debian)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      curl \
      openssh-client \
      tzdata \
      libxml2-dev \
      libxslt-dev \
      libpq-dev \
      libyaml-dev \
      imagemagick \
      git \
      libgmp-dev \
      nodejs \
      npm \
      dos2unix && \
    rm -rf /var/lib/apt/lists/*

# Yarn (forma correcta en Debian)
RUN npm install -g yarn

# Gems
COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.6.5
RUN bundle install

# App
COPY . .

# Assets
RUN yarn install --check-files

# =========================
# Stage 2: runtime
# =========================
FROM ruby:3.4.8

ENV RAILS_ROOT=/var/www/BioModelos
ENV BOOTSNAP_CACHE_DIR=/tmp/bootsnap

WORKDIR $RAILS_ROOT

# Dependencias runtime (más livianas)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      tzdata \
      postgresql-client \
      imagemagick \
      nodejs \
      npm \
      dos2unix && \
    rm -rf /var/lib/apt/lists/*

# Yarn runtime
RUN npm install -g yarn

# Copiar gems y app
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder $RAILS_ROOT $RAILS_ROOT

# Entrypoint
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN dos2unix /usr/bin/entrypoint.sh && chmod +x /usr/bin/entrypoint.sh

ENV RAILS_LOG_TO_STDOUT=true

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
