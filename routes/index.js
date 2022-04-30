//==< welcome 페이지의 소스코드 >==//


//==모듈==//
const express = require('express');
const router = express.Router(); //express 의 router를 사용
const template = require('../lib/template.js');  //최상위 = (..) 기준에서 lib 디렉토리


//==메인 소스 코드==//
router.get('/', (request, response) => {
    let title = 'Welcome';
    let description = 'Hello, Node.js';
    let list = template.list(request.list);
    let html = template.HTML(title, list,
        `
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin:10px;">
        `,
        `<a href="/topic/create">create</a>`
    );
    response.send(html);
});

module.exports = router;