#! /bin/bash
ls
rm -fr ./frames/*
rm -fr ./audios/rickAndMortySong.mp3
yes "yes" | ffmpeg -i $1 -vf scale=$2:$3 output.mp4
yes "yes" | ffmpeg -i ./output.mp4 -r $4/1 ./frames/frame%08d.jpg
yes "yes" | ffmpeg -i ./output.mp4 ./audios/rickAndMortySong.mp3
rm -f ./output.mp4