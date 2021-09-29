#! /bin/bash
rm -fr frames/*
yes "yes" | ffmpeg -i $1 -vf scale=$2:$3 output.mp4
yes "yes" | ffmpeg -i output.mp4 -r $4/1 frames/frame%03d.jpg
rm -f output.mp4
