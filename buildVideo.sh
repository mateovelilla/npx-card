#! /bin/bash
rm -fr frames/*
<<<<<<< HEAD
rm -fr audios/rickAndMortySong.mp3
yes "yes" | ffmpeg -i $1 -vf scale=$2:$3 output.mp4
yes "yes" | ffmpeg -i output.mp4 -r $4/1 frames/frame%08d.jpg
yes "yes" | ffmpeg -i output.mp4 audios/rickAndMortySong.mp3
rm -f output.mp4
=======
yes "yes" | ffmpeg -i $1 -vf scale=$2:$3 output.mp4
yes "yes" | ffmpeg -i output.mp4 -r $4/1 frames/frame%03d.jpg
rm -f output.mp4
>>>>>>> 35f30910f24ccfda556657e074f8bd81ec83a7d3
