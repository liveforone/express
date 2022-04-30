//==< /topic 경로의 템플릿 소스 코드 >==//


//==모듈==//
const express = require('express');
const router = express.Router(); //express 의 router를 사용
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');  //최상위 = (..) 기준에서 lib 디렉토리


//==메인 소스 코드==//
router.get('/create', (request, response) => {
    let title = 'WEB - create';
    let list = template.list(request.list);
    let html = template.HTML(title, list, `
        <form action="/topic/create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
    `, '');
    response.send(html);
});


router.post('/create', (request, response) => {
    let post = request.body;
    let title = post.title;
    let description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', 
    (err) => {
        response.redirect(`/topic/${title}`);
    });
});

router.get('/update/:pageId', (request, response) => {
    let filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        let title = request.params.pageId;
        let list = template.list(request.list);
        let html = template.HTML(title, list,
        `
        <form action="/topic/update" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
            <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
            <input type="submit">
            </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        response.send(html);
    });
});

router.post('/update', (request, response) => {
    let post = request.body;
    let id = post.id;
    let title = post.title;
    let description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, 
    (error) => {
    fs.writeFile(`data/${title}`, description, 'utf8', 
    (err) => {
        response.redirect(`/topic/${title}`);
        });
    });
});

router.post('/delete', (request, response) => {
    let post = request.body;
    let id = post.id;
    let filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, 
    (error) => {
    response.redirect('/');
    });
});

router.get('/:pageId', (request, response, next) => {
    let filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        if (err) {
            next(err);
        } else {
            let title = request.params.pageId;
            let sanitizedTitle = sanitizeHtml(title);
            let sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
            });
            let list = template.list(request.list);
            let html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`
            );
            response.send(html);
        }
    });
});

module.exports = router;