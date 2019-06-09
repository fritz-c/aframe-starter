const path = require('path');
const express = require('express');
const fallback = require('express-history-api-fallback');

const app = express();

module.exports = app;

app.use((req, res, next) => {
  // -----------------------------------------------------------------------
  // authentication middleware

  const auth = {
    login: process.env.BASIC_AUTH_USERNAME || 'koko',
    password: process.env.BASIC_AUTH_PASSWORD || 'koko',
  };

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    next();
    return;
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="lion-thing"'); // change this
  res.status(401).send('Authentication required.'); // custom message

  // -----------------------------------------------------------------------
});

const docRoot = __dirname;
app.use('/dist', express.static(path.join(docRoot, 'dist')));
app.use('/assets', express.static(path.join(docRoot, 'assets')));
app.use(fallback('index.html', { root: docRoot }));

const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`); // eslint-disable-line no-console
});
