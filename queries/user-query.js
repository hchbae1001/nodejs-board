exports.insertUser = 'insert into user set ?';
exports.getUser = 'select * from user where id=?';
exports.updateUser = 'update user set email = ?, name = ?, gender = ?, password = ?, updatedAt=now() where id =?';
exports.deleteUser = 'delete from user where id = ?';
