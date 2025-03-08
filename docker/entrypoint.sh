#!/bin/sh

DIR_NAME=/usr/share/nginx/html
envsubst < "$DIR_NAME/settings.json.tpl" > "$DIR_NAME/settings.json"
nginx -g "daemon off;"
