var express = require('express');
var router = express.Router();

var siteTitle = 'OBEC Administration Panel';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: siteTitle });
});

/*
 * GET users page.
 */
router.get('/users/', function(req, res) {
    res.render( 'users', {title: siteTitle });
});


module.exports = router;
