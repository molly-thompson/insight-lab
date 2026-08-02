#!/usr/bin/env bash

# General error handler
set -e

trap 'echo "Error: update failed (line $LINENO)." >&2' ERR

# Error checking
BRANCH=$(git branch --show-current)

if [[ "$BRANCH" == "main" ]]; then
    echo "Error: this script must be run from a feature branch, not main."
    exit 1
fi

STASHED=false

# If there are local changes, stash them
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Stashing local changes..."
    git stash
    STASHED=true
fi

echo "Pulling changes from upstream to local main..."
git switch main
git pull upstream main

echo "Updating remote main with the changes..."
git push origin main

echo "Updating $BRANCH..."
git switch "$BRANCH"
git fetch origin
git merge origin/main

# If stashed changes, restore them
if git stash list | grep -q .; then
    echo "Restoring local changes..."
    git stash pop
fi

echo "Update completed"