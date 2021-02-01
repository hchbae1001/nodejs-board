const { addColors } = require('winston/lib/winston/config')
const pool = require('../database/pool')
const BoardService = require('../services/board-service')

exports.getBoard = async (req, res) => {
    let { boardId } = req.params
    try {
        let rows = await BoardService.getBoard(boardId)
        let comment = await BoardService.getComment(boardId)
        res.render('board/view',{ data: rows, comment: comment})
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.getBoards = async (req, res) => {
    try{
        let rows = await BoardService.getBoards()
        // let data = await BoardService.getComment()
        res.render('board/board', {data:rows});
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.insertBoard = async(req,res) =>{
    let { title,content } = req.body
    try{
        await BoardService.insertBoard(title,content)
        res.redirect('/board')
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.deleteBoard = async(req,res) =>{
    let { boardId } = req.params
    try{
        await BoardService.deleteBoard(boardId)
        res.redirect('/board')
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.updateBoard = async(req,res) =>{
    let { boardId } = req.params
    let {title, content} = req.body
    try{
        await BoardService.updateBoard(boardId, title, content)
        res.redirect('/board')
    }catch(err){
        return res.status(500).json(err)
    }
}

exports.deleteComment = async (req, res, next) => {
    let { boardId, commentId } = req.params
    try {
        let del = await BoardService.deleteComment(boardId, commentId)
        return res.json(del)
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.insertComment = async (req,res) =>{
    let {boardId} = req.params
    let {comment} = req.body
    let moveBack = '/board/' + boardId
    try{
        await BoardService.insertComment(boardId,comment)
        return res.redirect(moveBack)
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.viewComment = async (req,res) => {
    let {commentId} = req.params
    try{
        let comment = await BoardService.viewComment(commentId)
        return res.render('board/commentView',{data: comment})
    }catch(err){
        return res.status(500).json(err)
    }
}

exports.updateComment = async (req,res) => {
    let {commentId} = req.params
    let {comment,board_id} = req.body
    let moveback = '/board/'+ board_id
    try{
        await BoardService.updateComment(comment,commentId)
        return res.redirect(moveback)
    }catch(err){
        return res.status(500).json(err)
    }
}

exports.deleteComment = async (req,res) => {
    let {commentId} = req.params
    let {board_id} = req.body
    let moveback = '/board/' + board_id
    try{
        await BoardService.deleteComment(commentId)
        return res.redirect(moveback)
    }catch(err){
        return res.status(500).json(err)
    }
}