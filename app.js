let koa = require('koa');
let app = koa();
let router = require('koa-router');
let mount = require('koa-mount');
 
let handler = function *(next){
    this.type = 'json';
    this.status = 200;
    this.body = {'Welcome': 'This is a level 2 Hello World Application!!'};
};
 
let APIv1 = new router();
APIv1.get('/all', handler);
 
app.use(mount('/v1', APIv1.middleware()));
if (!module.parent) app.listen(3000);
console.log('Hello World is Running on http://localhost:3000/');