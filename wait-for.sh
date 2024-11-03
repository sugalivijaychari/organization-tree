#!/bin/sh

# wait-for.sh
set -e

host="${1:-localhost}"  # Default to localhost if no host is specified
port="${2:-5432}"       # Default to PostgreSQL's standard port
shift 2
cmd="$@"

# Wait for the PostgreSQL server to be reachable
until nc -z "$host" "$port"; do
  >&2 echo "Waiting for PostgreSQL at $host:$port to be ready..."
  sleep 1
done

>&2 echo "PostgreSQL is up - executing command"
exec $cmd
