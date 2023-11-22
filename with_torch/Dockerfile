FROM sova-asr:master

ENV CUDA=10.2
ARG DEBIAN_FRONTEND=noninteractive


RUN apt-get update \
    && apt-get install -y libopenblas-dev libcudnn8 libopenmpi2 libomp-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f libcudnn7_7.6.3.28-1+cuda10.0_arm64.deb libcudnn7-dev_7.6.3.28-1+cuda10.0_arm64.deb \
    && wget https://developer.download.nvidia.cn/compute/redist/jp/v461/pytorch/torch-1.11.0a0+17540c5+nv22.01-cp36-cp36m-linux_aarch64.whl \
    && pip3 install torch-1.11.0a0+17540c5+nv22.01-cp36-cp36m-linux_aarch64.whl \
    && rm -f torch-1.11.0a0+17540c5+nv22.01-cp36-cp36m-linux_aarch64.whl

