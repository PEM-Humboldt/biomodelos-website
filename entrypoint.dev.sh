#!/bin/bash
gem install bundler -v 2.3.26
bundle install

bower install --allow-root
rm -f tmp/pids/server.pid
bundle exec rails s -b 0.0.0.0
