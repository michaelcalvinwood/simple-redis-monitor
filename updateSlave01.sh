#!/bin/bash
rsync -av --exclude "node_modules" --exclude '.git' . root@104.130.134.55:/home/simple-redis-monitor
