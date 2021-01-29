var express = require('express');
var router = express.Router();
const BoardController = require('../controllers/board-controller');

router.get('/new', function(req, res) {
  res.render('board/new');
});
router.get('/:boardId', BoardController.getBoard)
router.get('/', BoardController.getBoards)
router.post('/', BoardController.insertBoard)
router.patch('/:boardId', BoardController.updateBoard)
router.delete('/:boardId', BoardController.deleteBoard)

// router.get('/:boardId/comment', BoardController.getComments)
// router.post('/:boardId/comment', BoardController.insertComment)
// router.patch('/:boardId/comment/:commentId', BoardController.updateComment)
// router.delete('/:boardId/comment/:commentId', BoardController.deleteComment)

module.exports = router