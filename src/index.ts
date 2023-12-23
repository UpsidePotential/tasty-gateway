import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { routes } from './routes';
import * as CometdNodejsClient from 'cometd-nodejs-client'
import { TastyClient } from './services/tastyclient';

const helmet = require('helmet')

require('dotenv').config();

CometdNodejsClient.adapt()

const app = express();
app.set('view engine', 'pug');
app.use(express.static('./assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

app.locals.tastyClient = new TastyClient;

helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "https://code.highcharts.com"],
      },
    },
  }) 
app.use('/', routes);


  const PORT = process.env.PORT || 80;
  const server = app.listen(PORT, () => {
      const address = server.address();
      console.log("server is listening at", address);
  });

