#!/bin/bash
set -e
echo "Setting current state as safe version..."

# Ensure git is initialized and configured
if [ ! -d ".git" ]; then
  git init
  git config user.name "AI Studio"
  git config user.email "aistudio@build.internal"
fi

# Stage and commit current state
git add -A
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  git commit -m "Safe version checkpoint: $(date -u '+%Y-%m-%d %H:%M:%SZ')"
fi

# Update tags and branches
git tag -f safe-save
git tag -f safe-checkpoint
git tag -f safe-version
git branch -f safe-save 2>/dev/null || true
git branch -f safe-checkpoint 2>/dev/null || true
git branch -f safe-version 2>/dev/null || true

# Update tarball archive backups
tar --exclude='node_modules' --exclude='.git' -czf /app/safe-save.tar.gz -C /app/applet . 2>/dev/null || true
cp /app/safe-save.tar.gz /app/safe-version.tar.gz 2>/dev/null || true

echo "✓ Current state successfully marked as safe version (Git tags: safe-save, safe-checkpoint, safe-version; archive: /app/safe-save.tar.gz)"
