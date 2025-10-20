#!/bin/sh
set -e

echo "🚀 Starting BioModelos container with environtment: ${RAILS_ENV:-development}"

if [ -f tmp/pids/server.pid ]; then
  echo "🧹 Removing old PID..."
  rm -f tmp/pids/server.pid
fi

if [ "$RAILS_ENV" = "development" ]; then
  echo "📦 Checking dependencies..."
  bundle check || bundle install
  yarn install --check-files || yarn install
fi

if [ "$RAILS_ENV" = "production" ]; then
  echo "Gathering assets..."
  bundle exec rake assets:precompile
fi

if [ "$RAILS_ENV" = "production" ]; then
  echo "🧭 Doing migrations..."
  bundle exec rails db:migrate 2>/dev/null || echo "⚠️ Avoiding migrations (They could be already aplied)"
fi

echo "🏁 Starting Rails application..."
exec "$@"
```
