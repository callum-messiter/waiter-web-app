let baseUrl = ''

if(process.env.NODE_ENV === 'production') {
   baseUrl = 'http://localhost:3000/api';
} else if(process.env.NODE_ENV === 'development') {
   baseUrl = 'http://localhost:3000/api';
}

module.exports.apiBaseUrl = baseUrl;
