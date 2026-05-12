#!/bin/sh
set -e

npm ci
npx playwright install --with-deps chromium

echo "Waiting for frontend at http://frontend:80..."
i=0
while [ $i -lt 30 ]; do
  if wget -qO- http://frontend:80 > /dev/null 2>&1; then
    echo "Frontend ready after $i attempts"
    break
  fi
  i=$((i + 1))
  echo "Attempt $i/30..."
  sleep 3
done

npx playwright test
