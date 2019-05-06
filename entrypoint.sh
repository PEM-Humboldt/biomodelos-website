#!/bin/sh

bundle exec rake assets:precompile
sh -c "rm -f tmp/pids/server.pid && bundle exec rails s -b0.0.0.0 -e production"

exec "$@"
