#!/bin/sh
# line endings must be \n, not \r\n !
echo "window._env_ = {" > ./env-config.js
awk -F '=' '{st = index($0,"="); print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : substr($0,st+1)) "\"," }' ./.env >> ./env-config.js
echo "}" >> ./env-config.js