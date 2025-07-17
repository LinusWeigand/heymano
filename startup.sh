#!/bin/sh
set -e

echo "Starting Cloud SQL Proxy..."
/usr/local/bin/cloud-sql-proxy --port 5432 --health-check $DB_CONNECTION_NAME &

echo "Waiting for Cloud SQL Proxy to be ready..."
sleep 20

echo "Starting backend..."
./backend &

echo "Starting frontend (Next.js)..."
npm run start -- --port 3000 --hostname 0.0.0.0 &

echo "Starting Nginx..."
nginx -g 'daemon off;'
