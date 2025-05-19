#!/bin/bash
cd /home/ubuntu/PalaverliteBackend
pm2 start dist/socketServer.js --name "palaverlite"
pm2 save
