"use strict"; // eslint-disable-line
const express = require('express');
const app = express();
const server = require('http').Server(app); // eslint-disable-line
const port = process.env.PORT || 3000;
const path = require('path');
const html = require('html');
const imperio = require('imperio')(server);

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
        res.render('./../client/tapMobile.ejs');
      }
      else {
        res.render('./../client/rootmobile.ejs');
      }
    }
    else if (req.imperio.isDesktop) {
      res.render('./../dist/desktop.html');
    }
  }
);
// Nonce in URL
app.get('/:nonce', imperio.init(),
  (req, res) => {
    if (req.imperio.isDesktop) {
      res.render('./../dist/desktop.html');
    }
    else if (req.imperio.isMobile) {
      if (req.imperio.connected) {
        res.render('./../client/mobileConn.ejs');
      }
      else {
        res.render('./../client/mobile.ejs');
      }
    }
  }
);
// 404 error on invalid endpoint
app.get('*', (req, res) => {
  res.status(404)
     .render('./../client/404.html');
});

/* ----------------------------------
 * --------      Server      --------
 * ---------------------------------- */

server.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line
});
