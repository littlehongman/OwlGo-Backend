require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:4000${path}`;

describe('Validate Registration and Login functionality', () => {
    let cookie;

    it('register new user', (done) => {
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

    it('login user', (done) => {
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

    // it('should give me three or more articles', (done) => {
    //     fetch(url('/articles'), {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    //     }).then(res => res.json()).then(res => {
    //         if (res instanceof Array)
    //             expect(res.length).toBeGreaterThan(2);
    //         done();
    //     });
    // });

});