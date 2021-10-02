#! /bin/bash
git clone https://github.com/mateovelilla/npx-card.git
rm -fr ./npx-card/frames/*
mkdir ./npx-card/frames
rm -fr ./npx-card/audios/rickAndMortySong.mp3
yes "yes" | ffmpeg -i $1 -vf scale=$2:$3 ./npx-card/output.mp4
yes "yes" | ffmpeg -i ./npx-card/output.mp4 -r $4/1 ./npx-card/frames/frame%08d.jpg
yes "yes" | ffmpeg -i ./npx-card/output.mp4 ./npx-card/audios/rickAndMortySong.mp3
rm -f ./npx-card/output.mp4