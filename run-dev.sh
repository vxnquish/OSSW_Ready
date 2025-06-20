#!/usr/bin/env bash
set -e

# 백엔드 띄우기 (백그라운드)
echo "🚀 Starting backend..."
pushd backend > /dev/null
./gradlew bootRun & 
BACKEND_PID=$!
popd > /dev/null

# 프론트엔드 띄우기 (포그라운드)
echo "🎨 Starting frontend..."
pushd frontend > /dev/null
npm run dev
popd > /dev/null

# (선택) 백엔드도 같이 종료하려면
# kill $BACKEND_PID
