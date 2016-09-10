let koa = require('koa');
let app = koa();
let router = require('koa-router');
let mount = require('koa-mount');
let api = require('./api/api.js');
let logger = require('koa-logger');
let limit = require('koa-better-ratelimit');
let compress = require('koa-compress');
let opts =  { 
    filter: function (content_type) { return /text/i.test(content_type) }, // filter requests to be compressed using regex 
    threshold: 2048, //minimum size to compress
    flush: require('zlib').Z_SYNC_FLUSH };
            }
 
let APIv1 = new router();
APIv1.get('/all', api.all);
APIv1.get('/single', api.single);

app.use(function *(next){
    try{
        yield next; //pass on the execution to downstream middlewares
    } catch (err) { //executed only when an error occurs & no other middleware responds to the request
        this.type = 'json'; //optional here
        this.status = err.status || 500;
        this.body = { 'error' : 'The application just went bonkers, hopefully NSA has all the logs ;) '};
        //delegate the error back to application
        this.app.emit('error', err, this);
    }
});

app.use(limit({ duration: 1000*60*3 , // 3 min
                max: 10, blacklist: []}));
app.use(logger());
app.use(compress(opts));
 
 
app.use(mount('/v1', APIv1.middleware()));
if (!module.parent) app.listen(3000);
console.log('Dictapi is Running on http://localhost:3000/');