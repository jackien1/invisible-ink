const routes = require('next-routes');
module.exports = routes()
    .add('/', 'index')
    .add('/register/:type', 'Register')
    .add('/faq', 'FAQPage')
    .add('/cases', 'AdminCases')
    .add('/case', 'Case');
