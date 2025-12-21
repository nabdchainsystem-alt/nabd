#!/bin/bash

# This script will replace localStorage.setItem with storageService.setItem across all TypeScript files

cd /Users/max/nabd/src

# Find all .tsx and .ts files and replace
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/localStorage\.setItem/storageService.setItem/g' {} +

echo "✅ Replaced all localStorage.setItem with storageService.setItem"
echo "⚠️  Remember to add: import { storageService } from '../path/to/services/storageService';"
