# If using CPU only replace the following line with:
# FROM ubuntu:18.04
#FROM nvidia/cuda:10.2-cudnn7-devel-ubuntu18.04
FROM nvcr.io/nvidia/l4t-cuda:10.2.460-runtime

ENV CUDA=10.2
ARG DEBIAN_FRONTEND=noninteractive


RUN mv /etc/apt/sources.list.d/cuda.list /etc/apt/sources.list.d/cuda.disabled \
    && apt-key adv --fetch-key https://repo.download.nvidia.com/jetson/jetson-ota-public.asc \
    && echo "deb https://repo.download.nvidia.com/jetson/common r32.7 main" | tee /etc/apt/sources.list.d/nvidia-l4t-apt-source.list \
    && echo "deb https://repo.download.nvidia.com/jetson/t186 r32.7 main" | tee /etc/apt/sources.list.d/nvidia-l4t-apt-source2.list \
    && apt-get update \
    && apt-get install -y python3-dev python3-pip ffmpeg libhdf5-dev libhdf5-serial-dev \
    && wget https://repo.download.nvidia.com/jetson/common/pool/main/c/cudnn/libcudnn7_7.6.3.28-1+cuda10.0_arm64.deb \
    && wget https://repo.download.nvidia.com/jetson/common/pool/main/c/cudnn/libcudnn7-dev_7.6.3.28-1+cuda10.0_arm64.deb \
    && dpkg -i libcudnn7_7.6.3.28-1+cuda10.0_arm64.deb libcudnn7-dev_7.6.3.28-1+cuda10.0_arm64.deb \
    && apt-get install -y libcublas-dev libcurand-dev-10-2 cuda-nvrtc-dev-10-2 cuda-cudart-dev-10-2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f libcudnn7_7.6.3.28-1+cuda10.0_arm64.deb libcudnn7-dev_7.6.3.28-1+cuda10.0_arm64.deb \
    && locale-gen en_US.UTF-8

ARG PROJECT=sova-asr
ARG PROJECT_DIR=/$PROJECT
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV OPENBLAS_CORETYPE ARMV8

RUN mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR

COPY requirements.txt .
COPY h5py-3.1.0-cp36-cp36m-linux_aarch64.whl .
RUN pip3 install --upgrade pip \
    && pip3 --no-cache-dir install -r requirements.txt \
    && pip3 install h5py-3.1.0-cp36-cp36m-linux_aarch64.whl \
    && pip3 install PuzzleLib==1.0.3a0 --install-option="--backend=cuda" --install-option="--no-runtime-check" \
    && rm -rf $PROJECT_DIR/*
