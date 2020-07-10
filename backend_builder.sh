#!/bin/bash
if [ ! "$cached_data" ]; then
  echo "Downloading data..."
  wget -q --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1Rj0Flov3WTKwLygASM_42t57tJx3SYnr' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1Rj0Flov3WTKwLygASM_42t57tJx3SYnr" -O cached_data.tar.gz && rm -rf /tmp/cookies.txt
  tar -xzf cached_data.tar.gz
fi

gunicorn server:app -c ./gunicorn.conf.py