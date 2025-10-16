if [ ! -f "dist/server/index.js" ]; then
  echo "❌ Server build output missing"
  ls -la dist/server/
  exit 1
fi
