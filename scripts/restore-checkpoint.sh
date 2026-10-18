#!/bin/bash
set -e
echo "Restoring to safe-save / safe-checkpoint..."
if [ -d ".git" ]; then
  git checkout safe-checkpoint -f 2>/dev/null || git checkout safe-save -f
  git reset --hard safe-checkpoint 2>/dev/null || git reset --hard safe-save
  echo "Git repository restored to: $(git rev-parse HEAD)"
elif [ -f "/app/safe-save.tar.gz" ]; then
  tar -xzf /app/safe-save.tar.gz -C /app/applet
  echo "Restored from /app/safe-save.tar.gz backup archive."
fi
echo "✓ Restore complete. Safe-checkpoint active."
