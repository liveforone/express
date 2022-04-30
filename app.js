//==모듈==//
const { response } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');
const { request } = require('http');
const bodyParser = require('body-parser');  //미들웨어
const compression = require('compression'); //미들웨어
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const helmet = require('helmet');
const port = 3000;


//==미들 웨어==//
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));  //바디를 쉽게 가져옴
app.use(express.static('public'));  //정적인 파일 서비스('디렉토리')
app.use(compression());  //내용을 압축하여 용량을 줄임
app.get('*', (request, response, next) => {  //get방식의 대해서만 적용
    fs.readdir('./data', (error, filelist) => {
        request.list = filelist;
        next();
    });
});


//==템플릿 미들웨어==//
app.use('/', indexRouter);
app.use('/topic', topicRouter);


//==에러 미들웨어(미들웨어 최하위에 위치)==//
app.use((request, response, next) => {  //404에러
    response.status(404).send('Sorry can\'t find that!');
});

app.use((err, request, response, next) => {  //위치는 미들웨어 맨 아래에
    console.error(err.stack);
    response.status(500).send('ERROR!! ERROR!! This path is wrong!!');
});


//==express 서버 연결(전체 최하위에 위치)==//
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});