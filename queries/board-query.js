// exports.getBoards = 'select board_id, title from board limit ?, ?'
exports.getBoards = 'select board_id, title from board'
exports.getBoard = 'select board_id, title, content from board where board_id = ?'
exports.insertBoard = 'insert into board set ?'
exports.updateBoard = 'update board set title = ?, content = ? where board_id = ?'
exports.deleteBoard = 'delete from board where board_id = ?'

// exports.getComments = 'select board_id, title, content from board where board_id = ?'
exports.getComment = 'select * from board_comment where board_id = ?'
exports.viewComment = 'select * from board_comment where comment_id = ?'
exports.insertComment = 'insert into board_comment set ?'

exports.plusCommentCnt = 'update board set board_comment = board_comment + 1 where board_id = ?'
exports.minusCommentCnt = 'update board set board_comment = board_comment - 1 where board_id = ?'

exports.updateComment = 'update board_comment set board_comment = ? where comment_id = ?'
exports.deleteComment = 'delete from board_comment where comment_id = ?'
exports.foreignCheck0 = 'set foreign_key_checks = 0'
exports.foreignCheck1 = 'set foreign_key_checks = 1'