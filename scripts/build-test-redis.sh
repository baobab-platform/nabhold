#!/usr/bin/env bash
# Isolated CI/local integration dependency, not a runtime deployment. Pin both
# source tag and exact commit; refuse a moved tag and keep builds outside the
# checkout. The caller owns cleanup of the scratch destination.
set -euo pipefail
if [ "$#" -ne 1 ] || [ -e "$1" ]; then
  echo 'Provide one new scratch directory for the Redis test build' >&2
  exit 2
fi
for tool in git cc make openssl; do
  command -v "$tool" >/dev/null || { echo "Redis fixture requires $tool" >&2; exit 2; }
done
fixture_root="$1"
git clone --depth 1 --branch 8.10.2 https://github.com/redis/redis.git "$fixture_root"
test "$(git -C "$fixture_root" rev-parse HEAD)" = 498ecd0d6d007db11ddb3aea9428552598a78622
# TLS requires the platform's OpenSSL development headers. No daemon, system
# package, persistent database or well-known test password is installed.
make -C "$fixture_root" -j2 BUILD_TLS=yes MALLOC=libc OPTIMIZATION=-O1 redis-server
