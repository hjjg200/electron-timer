.PHONY: start
start: css
	npm start

.PHONY: css
css:
	sass assets/stylesheets:assets/stylesheets

.PHONY: build
build: css
	npm run package-win