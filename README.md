# Jetson version of SOVA.ai ASR

System can be run on jetson Nano/TX2 with Jetpack 4.6
Differences to original sova-asr:
1) commented punctuator (too huge model. not enought resources to run)
2) compiled wav2letter for arm64
3) modified Dockerfile, for jetson image based on nvcr.io/nvidia/l4t-cuda:10.2.460-runtime

in case of error during installation of PuzzleLib please comment this line in Dockerfile, rebuild image and then reinstall PuzzleLib manually.

Docker image: https://hub.docker.com/r/whitepail/sova-asr-jetson
