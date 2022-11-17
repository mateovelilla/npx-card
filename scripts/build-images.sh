#! /bin/bash
rm -rf ./npx-card
git clone https://github.com/mateovelilla/npx-card.git
rm -rf ./npx-card/frames/logos/*
mkdir ./npx-card/frames/logos
yes "yes" | ffmpeg -i $1 -vf scale=$2:$3 $4.jpg
# yes "yes" | ffmpeg -i ./$4 -r $5/1 ./npx-card/frames/logos/$4
# rm -rf ./$4