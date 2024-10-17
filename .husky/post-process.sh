#!/bin/sh

# Compile TypeScript files
npx tsc --project tsconfig.scripts.json

# Rename .js files to .mjs
for file in dist/scripts/**/*.js; do
  mv "$file" "${file%.js}.mjs"
done

# Update import statements
for file in dist/scripts/scripts/content.mjs dist/scripts/lib/pageroutes.mjs; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # Use perl instead of sed for better cross-platform compatibility
    perl -i -pe 's|import \{ Documents \} from '\''@/settings/documents'\''|import { Documents } from '\''../settings/documents.mjs'\''|g' "$file"

    if [ $? -ne 0 ]; then
      echo "Error: Failed to update $file"
      exit 1
    fi
    
    echo "$file updated successfully."
  else
    echo "$file not found!"
  fi
done

# Run the content script
node dist/scripts/scripts/content.mjs || exit 1