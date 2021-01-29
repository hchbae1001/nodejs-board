const pool = require('../database/pool')
const BoardQuery = require('../queries/board-query')

exports.getBoard = async (boardId) => {
    try {
        let data = await pool.query(BoardQuery.getBoard, boardId)
        return data[0]
    } catch (err) {
        console.log(err)
        throw Error(err)
    }
}

exports.getBoards = async() => {
    try{
        let data = await pool.query(BoardQuery.getBoards)
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}

exports.insertBoard = async (title, content) =>{
    try{
        let insert = await pool.query(BoardQuery.insertBoard,{title:title,content:content})
        return insert[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}
exports.deleteBoard = async (boardId) => {
    try{
        await pool.query(BoardQuery.deleteBoard,boardId)
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}

exports.deleteComment = async (boardId, commentId) => {
    let conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        let del = await conn.query(BoardQuery.deleteComment, [commentId])
        if (del[0].affectedRows == 1) {
            let upd = await conn.query(BoardQuery.minusCommentCnt, [boardId])
        }
        await conn.commit()

        return del[0]
    } catch (err) {
        conn.rollback()
        console.log(err)
        throw Error(err)
    } finally {
        conn.release()
    }
}
exports.updateBoard = async (boardId,title,content) => {
    try{
        let update = await pool.query(BoardQuery.updateBoard, [title, content, boardId])
        return update[0]
    }catch(err){
        conn.rollback
        console.log(err)
        throw Error(err)
    }
}