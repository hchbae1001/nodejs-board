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

exports.updateBoard = async (boardId,title,content) => {
    try{
        let update = await pool.query(BoardQuery.updateBoard, [title, content, boardId])
        return update[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}
exports.getComment = async(boardId) =>{
    try{
        let data = await pool.query(BoardQuery.getComment,boardId)
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}
exports.insertComment = async(boardId,comment) =>{
    try{
        let data = await pool.query(BoardQuery.insertComment, {board_id:boardId, board_comment:comment})
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}

exports.viewComment = async(commentId) =>{
    try{
        let data = await pool.query(BoardQuery.viewComment,commentId)
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}

exports.updateComment = async(comment, commentId) =>{
    try{
        let data = await pool.query(BoardQuery.updateComment, [comment, commentId])
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}

exports.deleteComment = async(commentId) =>{
    try{
        let data = await pool.query(BoardQuery.deleteComment, commentId)
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}