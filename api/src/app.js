const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const services = require('./services');

const app = express(feathers());

// Enable CORS, security, compression and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up REST
app.configure(express.rest());

// Set up services
app.configure(services);

module.exports = app;
