DOCKER_COMPOSE_VERSION := 1.24.0
NAMESPACE := sr2020
SERVICE := platform
IMAGE := $(or ${image},${image},maps-n-magic)
GIT_TAG := $(shell git tag -l --points-at HEAD | cut -d "v" -f 2)
TAG := :$(or ${tag},${tag},$(or ${GIT_TAG},${GIT_TAG},latest))
ENV := $(or ${env},${env},local)
cest := $(or ${cest},${cest},)

current_dir = $(shell pwd)

build:
	docker build -t ${NAMESPACE}/${IMAGE}${TAG} -t ${NAMESPACE}/${IMAGE}:latest .

push:
	docker push ${NAMESPACE}/${IMAGE}

deploy:
	{ \
	sshpass -p $(password) ssh -o StrictHostKeyChecking=no deploy@$(server) "cd /var/services/$(SERVICE) ;\
	docker-compose pull admin-client-app ;\
	docker-compose up -d --no-deps admin-client-app" ;\
	}

up:
	docker-compose up -d

dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

down:
	docker-compose down

reload:
	make down
	make up

restart:
	docker-compose down -v
	docker-compose up -d

install:
	cp .env.example .env

install-docker-compose:
	curl -L https://github.com/docker/compose/releases/download/$(DOCKER_COMPOSE_VERSION)/docker-compose-Linux-x86_64 > /tmp/docker-compose
	chmod +x /tmp/docker-compose
	sudo mv /tmp/docker-compose /usr/local/bin/docker-compose
	docker-compose -v
