IMAGE=odi-frontend

OPENSEARCH_URL?=http://127.0.0.1:5601
API_URL?=http://127.0.0.1:8085/api/v1

dev-run:
	docker run \
		--rm \
		-it \
		-u 1000 \
		--name odi-frontend \
		-p 127.0.0.1:3000:5173 \
		-v "$(PWD):/app" \
		--workdir /app \
		"node:lts" \
		"bash"

docker-build:
	docker build \
		-t "$(IMAGE)" \
		.

docker-run:
	docker run \
		--rm \
		--name odi-frontend \
		-e "OPENSEARCH_URL=$(OPENSEARCH_URL)" \
		-e "API_URL=$(API_URL)" \
		-p 8080:80 \
		"$(IMAGE)"
