#!/bin/bash
#git remote set-url origin git@github.com-parax-front:frontend/CMS_Parax_FrontEnd.git
#git pull origin main
sudo docker compose -f docker-compose.production.yml up -d --build --force-recreate
