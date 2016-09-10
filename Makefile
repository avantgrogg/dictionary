test:
    @NODE_ENV=test ./node_modules/.bin/mocha \
        --require should \
        --reporter nyan \
        --bail \
        api/tests.js
 
.PHONY: test