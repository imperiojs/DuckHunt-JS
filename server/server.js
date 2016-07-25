"use strict"; // eslint-disable-line
const express = require('express');
const app = express();
const server = require('http').Server(app); // eslint-disable-line
const port = process.env.PORT || 3000;
const path = require('path');
const html = require('html');
const imperio = require('imperio')(server, {globalRoomLimit: 2});

/* ----------------------------------
 * -----   Global Middleware   ------
 * ---------------------------------- */

app.use(express.static(path.join(`${__dirname}/../client`)));
app.use(express.static(path.join(`${__dirname}/../dist`)));
// app.set('view engine', 'ejs');

/* ----------------------------------
 * --------      Routes      --------
 * ---------------------------------- */
 app.get('/favicon.ico', (req, res) => {
   console.log('favicon workaround handled!');
   res.send();
 });

 // App will serve up different pages for client & desktop
app.get('/', imperio.init(),
  (req, res) => {
    console.log('hit to the get route');
    console.log('isMobile status:', req.imperio.isMobile);
    if (req.imperio.isMobile) {
      if (req.imperio.connected) {
        res.sendFile(path.join(`${__dirname}/../client/tapmobile.html`));
      }
      else {
        res.sendFile(path.join(`${__dirname}/../client/rootmobile.html`));
      }
    }
    else if (req.imperio.isDesktop) {
      res.sendFile(path.join(`${__dirname}/../dist/desktop.html`));
    }
  }
);
// Nonce in URL
app.get('/:nonce', imperio.init(),
  (req, res) => {
    if (req.imperio.isDesktop) {
      res.sendFile(path.join(`${__dirname}/../dist/desktop.html`));
    }
    else if (req.imperio.isMobile) {
      if (req.imperio.connected) {
        res.sendFile(path.join(`${__dirname}/../client/tapmobile.html`));
      }
      else {
        res.sendFile(path.join(`${__dirname}/../client/rootmobile.html`));
      }
    }
  }
);
app.post('/', imperio.init(),
  (req, res) => {
    if (req.imperio.isMobile) {
      if (req.imperio.connected) {
        res.sendFile(path.join(`${__dirname}/../client/tapmobile.html`));
      } else {
        res.sendFile(path.join(`${__dirname}/../client/rootmobile.html`));
      }
    } else {
      res.status(404)
         .render(`${__dirname}/../client/browser.html`, { error: 'NO POST' });
    }
  }
);
// 404 error on invalid endpoint
app.get('*', (req, res) => {
  res.status(404)
     .send('./../client/404.html');
});

/* ----------------------------------
 * --------      Server      --------
 * ---------------------------------- */

server.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line
});
