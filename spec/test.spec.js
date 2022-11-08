require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:4000${path}`;

describe('Basic Unit Tests', () => {
    let cookie;
    let articleId;

    it('validate POST /register', (done) => {
        let regUser = {username: 'mrj3', password: '1234'};
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('mrj3');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('validate POST /login', (done) => {
        let loginUser = {username: 'mrj3', password: '1234'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');

            return res.json()
        }).then(res => {
            expect(res.username).toEqual('mrj3');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('validate POST /article', (done) => {
        let post = { text: "This is a test" };

        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
            body: JSON.stringify(post),
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            articleId = res.articles.at(-1).pid;
            
            console.info(articleId);
            done();
        });
    });
    
    it('validate GET /articles', (done) => {
        fetch(url(`/articles/${articleId}`), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.article.text).toEqual("This is a test");

            done();
        });
    });
});