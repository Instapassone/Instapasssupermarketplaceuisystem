#!/bin/bash

# Add import at line 24 (after AvatarAssistant import)
sed -i "24a import { HelpSupport } from './pages/HelpSupport';" /tmp/sandbox/src/app/routes.ts

# Replace NotFound with HelpSupport on line 122
sed -i "s/{ path: '\/help', Component: NotFound }/{ path: '\/help', Component: HelpSupport }/" /tmp/sandbox/src/app/routes.ts

echo "Routes updated successfully!"
grep -n "HelpSupport" /tmp/sandbox/src/app/routes.ts
