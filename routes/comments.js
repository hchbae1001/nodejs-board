var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  sess = req.session
  res.render('index', { title: 'Express133232', name:req.session.username, id:req.session.user_id });
});

module.exports = router;
