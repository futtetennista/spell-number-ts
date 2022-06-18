SHELL=/bin/bash
ARCHIVE_NAME=stefano-home-task

.PHONY: start test format compress remove-archive build-image

build-image:
	docker build -t $(IMAGE_TAG) .

start:
	docker run --rm --name signal-ai -it -v `pwd`:/app -p 3000:3000 -w /app node:18-slim yarn start

test:
	docker exec -w '/app' signal-ai yarn test --forceExit --watchAll=false --detectOpenHandles

format:
	docker exec -w '/app' signal-ai yarn format

remove-archive:
	rm $(ARCHIVE_NAME).zip

compress: remove-archive
	zip $(ARCHIVE_NAME) . -r -q --exclude "node_modules/*" ".vscode/*" "dist/*"