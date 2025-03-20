#!/bin/bash
gem install bundler -v 2.6.5
bundle install

yarn install 
rm -f tmp/pids/server.pid
bundle exec rails s -b 0.0.0.0
