require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:4000${path}`;

describe('Basic Unit Tests', () => {
    let cookie;
    let articleId;

    it('validate POST /register', (done) => {
        let regUser = {username: 'testUser', password: '123'};
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('validate POST /login', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');

            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
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
            //expect(res.articles.length).toEqual(1);
            articleId = res.articles.at(-1).pid;
            
            const articleText = res.articles.at(-1).text;
            expect(articleText).toEqual("This is a test");
            // console.info(articleId);
            done();
        });
    });
    
    it('validate GET /articles/:id', (done) => {
        fetch(url(`/articles/${articleId}`), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.article.text).toEqual("This is a test");

            done();
        });
    });

    it('validate GET /articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.articles.at(-1).text).toEqual("This is a test");

            done();
        });
    });

    it('validate PUT /headline', (done) => {
        const headline = { headline: "Winning" } 

        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
            body: JSON.stringify(headline),
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual("testUser");
            expect(res.headline).toEqual("Winning");

            done();
        });
    });


    it('validate GET /headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual("testUser");
            expect(res.headline).toEqual("Winning");

            done();
        });
    });

   
    it('validate PUT /Logut', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        }).then(res => {
            expect(res.status).toEqual(200);
            done();
        });
    });

});