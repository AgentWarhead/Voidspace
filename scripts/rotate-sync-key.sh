#!/bin/bash

# Generate a new 64-character hex random key
new_key=$(openssl rand -hex 32)

echo "🔄 Generated new SYNC_API_KEY:"
echo "$new_key"
echo ""
echo "📋 Instructions to update:"
echo ""
echo "1. LOCAL DEVELOPMENT:"
echo "   Add to .env.local:"
echo "   SYNC_API_KEY=$new_key"
echo ""
echo "2. VERCEL PRODUCTION:"
echo "   Run the following command:"
echo "   vercel env add SYNC_API_KEY"
echo "   When prompted, paste: $new_key"
echo "   Select Production environment"
echo ""
echo "   Or via Vercel dashboard:"
echo "   https://vercel.com/your-team/voidspace/settings/environment-variables"
echo ""
echo "⚠️  IMPORTANT: Update both environments before deploying changes that use the new key!"