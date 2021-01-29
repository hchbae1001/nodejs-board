var express = require('express');
var router = express.Router();
const userController = require('../controllers/user-controller');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user/login')
})
router.post('/',userController.userLogin)
router.get('/:id',userController.userView)
router.patch('/:id',userController.userUpdate)
router.delete('/:id',userController.userDelete)

router.get('/:id/logout', userController.userLogout)
router.get('/option/new', function(req,res){
  res.render('user/new')
})
router.post('/option/new', userController.userInsert)

module.exports = router;
