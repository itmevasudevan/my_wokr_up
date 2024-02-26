module.exports.ServerPort = 8083;
let ENV = 'DEV';

module.exports.base_url = 'https://example.com';
if (ENV == 'UAT') {
    module.exports.base_url = 'https://example.com';
} else if (ENV == 'PROD') {
    module.exports.base_url = 'https://example.com';
}