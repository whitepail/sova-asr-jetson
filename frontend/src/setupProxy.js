const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

  app.use(
    '/asr/',
    createProxyMiddleware({
        target: 'https://asr-contest.nanosemantics.ai/',
        changeOrigin: true,
        auth:'ann:5CuiHOCS2ZQ1' 
    })
  );

  app.use( 
    '/synthesize/',
    createProxyMiddleware({
        target: 'https://tts.nanosemantics.ai',
        changeOrigin: true, 
        auth:'ann:5CuiHOCS2ZQ1'
    }) 
  );

};