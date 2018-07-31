const got = require('got');
const md5 = require('md5');

module.exports = class {
    constructor(pid, key) {
        this.pid = pid;
        this.key = key;
        this.url = 'http://fanyi.sogou.com/reventondc/api/sogouTranslate';
    }
    
    async translate(q, from, to) {
        const salt = String((Math.random() * 10000).toFixed());
        const res = await got(this.url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            form: true,
            body: { q, from, to, salt,
                pid: this.pid,
                sign: md5('' + this.pid + q + salt + this.key)
            }
        })
        
        if (res.statusCode != 200) {
            throw new Error(`API returns status: ${res.statusCode}, status message: ${res.statusMessage}`);
        }
        
        let result;
        try {
            result = JSON.parse(res.body); // In practice, the response may not be a valid JSON...
        } catch(err) {
            throw new Error(`API returns invalid response: ${res.body}`);
        }
        
        if (result.errorCode != 0) {
            throw new Error(`API returns with errorCode: ${result.errorCode}`);
        }

        return result.translation;
    }
};