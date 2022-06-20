SHELL=/bin/bash
ARCHIVE_NAME=stefano-home-task

.PHONY: start test format compress remove-archive build-image run-image-detach run-image
		stop-container run-container

build-image:
	docker build -t $(IMAGE_TAG) .

run-image:
	docker run --name $(IMAGE_TAG) --rm -p $(PORT):$(PORT) $(IMAGE_TAG)

run-image-detach:
	docker run --name $(IMAGE_TAG) -d --rm -p $(PORT):$(PORT) $(IMAGE_TAG)

stop-container:
	docker stop $(IMAGE_TAG)

run-container:
	docker run -detach --rm --name signal-ai -it -v `pwd`:/app -p 3000:3000 -w /app node:18-slim bash

start:
	docker run -detach --rm --name signal-ai -it -v `pwd`:/app -p 3000:3000 -w /app node:18-slim yarn start

test:
	docker exec -w '/app' signal-ai yarn test --forceExit --watchAll=false --detectOpenHandles

format:
	docker exec -w '/app' signal-ai yarn format

remove-archive:
	rm $(ARCHIVE_NAME).zip

compress: remove-archive
	zip $(ARCHIVE_NAME) . -r -q --exclude "node_modules/*" ".vscode/*" "dist/*" "RESOURCES.md"