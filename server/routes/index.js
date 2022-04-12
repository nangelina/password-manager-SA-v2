const express = require('express');

const router = express.Router();
// add API routes to current router
// NOTE: All routes exported from apiRoutes will get placed under the /api path
// this is just to save a little typing so in my api routes I don't have to put
// /api in front of each route.
router.use('/api', require('./apiRoutes'));

module.exports = router;
