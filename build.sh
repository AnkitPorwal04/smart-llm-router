#!/usr/bin/env bash
# Render build script — installs backend + builds frontend
set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install .

# Build frontend
cd frontend
npm ci
npm run build
