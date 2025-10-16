#!/bin/sh
set -e

echo "🚀 Iniciando contenedor BioModelos con entorno: ${RAILS_ENV:-development}"

if [ -f tmp/pids/server.pid ]; then
  echo "🧹 Eliminando PID antiguo..."
  rm -f tmp/pids/server.pid
fi

if [ "$RAILS_ENV" = "development" ]; then
  echo "📦 Verificando dependencias..."
  bundle check || bundle install
  yarn install --check-files || yarn install
fi

if [ "$RAILS_ENV" = "production" ]; then
  echo "Precompilando assets..."
  bundle exec rake assets:precompile
fi

if [ "$RAILS_ENV" = "production" ]; then
  echo "🧭 Ejecutando migraciones..."
  bundle exec rails db:migrate 2>/dev/null || echo "⚠️ Saltando migraciones (puede que ya estén aplicadas)"
fi

echo "🏁 Iniciando aplicación Rails..."
exec "$@"
```
