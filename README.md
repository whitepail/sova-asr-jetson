# Система автопротоколирования конференций в онлайн режиме

## Системные требования:
Операционная система, поддерживающая работу с Docker, предпочтительно Ubuntu 20.04, минимум 16 GB RAM, минимум 4 ядра, процессор с тактовой частотой не ниже 2.50 GHz, видеокарта NVIDIA с объёмом графической памяти не меньше 8 GB, 15 GB свободного места на SSD.

Рекомендуемая конфигурация: инстанс типа g4dn.2xlarge в AWS с Ubuntu 20.04 и 50 GB SSD.

## Инструкция по разворачиванию:
Клонируем репозиторий и переходим в папку проекта:
```
git clone https://github.com/sxdxfan/sova-asr
cd sova-asr
```

Устанавливаем Docker и docker-compose с поддержкой NVIDIA:
```
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $(whoami)
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | \
    sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.list | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
sudo apt-get update
sudo apt-get install nvidia-container-runtime
sudo echo -e '{\n    "runtimes": {\n        "nvidia": {\n            "path": "nvidia-container-runtime",\n            "runtimeArgs": []\n        }\n    },\n    "default-runtime": "nvidia"\n}' >> /etc/docker/daemon.json
sudo systemctl restart docker.service
```

Скачиваем и разворачиваем веса моделей:
```
wget http://dataset.sova.ai/SOVA-ASR/data.tar.gz
tar -xvf data.tar.gz && rm data.tar.gz
```

Запускаем бэкенд часть (поднимутся сервисы на портах 8888, 8889, 8890):
```
sudo docker-compose build
sudo docker-compose up -d sova-asr sova-asr-decoder sova-asr-punctuator
```

Переходим в подпапку с фронтендом и устанавливаем зависимости:
```
cd frontend
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install -y --upgrade npm node-gyp nodejs-dev libssl1.0-dev yarn
sudo npm install -g n
sudo n stable
yarn install
```

Производим билд:
```
yarn build
```

После билда в папке фронтенда появится подпапка build, к которой необходимо указать путь в конфигурации веб сервера (например, nginx). Также необходимо сконфигурировать пути обращений к API бэкенда. Пример конфигурации nginx:

```
server {
	index index.html index.php index.htm index.php;
	add_header X-Frame-Options "SAMEORIGIN";
	add_header X-Content-Type-Options "nosniff";
	client_max_body_size 700M;
	proxy_connect_timeout 600;
	proxy_send_timeout 600;
	proxy_read_timeout 600;
	send_timeout 600;
	location = /robots.txt {
		add_header Content-Type text/plain;
		return 200 "User-agent: *\nDisallow: /\n";
	}
	location / {
		index index.html index.php index.htm index.php;
		root /var/www/sova-asr/frontend/build;
		client_max_body_size 256M;
		try_files $uri $uri/ /index.html;
	}
	location /asr {
		proxy_pass http://localhost:8888;
		client_max_body_size 700M;
         }
	server_name SERVER_NAME;
	listen 443 ssl http2; 
	ssl_certificate SSL_CERTIFICATE; 
	ssl_certificate_key SSL_CERTIFICATE_KEY;
	access_log /var/log/nginx/asr-access.log;
	error_log /var/log/nginx/asr-error.log;
}
```
