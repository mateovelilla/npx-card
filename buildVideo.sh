#! /bin/bash
rm -rf ./npx-card
git clone https://github.com/mateovelilla/npx-card.git
rm -rf ./npx-card/frames/*
mkdir ./npx-card/frames
rm -rf ./npx-card/audios/rickAndMortySong.mp3
yes "yes" | ffmpeg -i $1 -vf scale=$2:$3 output.mp4
yes "yes" | ffmpeg -i ./output.mp4 -r $4/1 ./npx-card/frames/frame%08d.jpg
yes "yes" | ffmpeg -i ./output.mp4 ./npx-card/audios/rickAndMortySong.mp3
rm -rf ./output.mp4