#!/bin/bash
git add .
git commit -m $1 || "Pushed From c9.io/tramans/grove"
git push origin master
