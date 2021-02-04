const session = require('express-session')
const { write } = require('fs')
const { addColors } = require('winston/lib/winston/config')
const models = require('../models')

exports.getBoard = async (req, res) => {
    let { boardId } = req.params
    try {
        let rows = await models.board.findOne({where : {board_id:boardId}})
        let comment = await models.board_comment.findAll({where: {board_id:boardId}})
        res.render('board/view',{ data: rows, comment: comment})
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.getBoards = async (req, res) => {
    try{
        let rows = await models.board.findAll()
        res.render('board/board', {data:rows});
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.insertBoard = async(req,res) =>{
    sess = req.session
    let { title,content } = req.body
    try{
        if(sess.user_id){
            writer = sess.user_id
            await models.board.create({title:title,content:content,id:writer})
        }else{
            await models.board.create({title:title, content:content})
        }
        res.redirect('/board')
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.deleteBoard = async(req,res) =>{
    let { boardId } = req.params
    try{
        await models.board.destroy({where:{board_id:boardId}})
        res.redirect('/board')
    }catch(err){
        return res.status(500).json(err)
    }
}

exports.updateBoard = async(req,res) =>{
    let { boardId } = req.params
    let {title, content} = req.body
    try{
        await models.board.update({title:title, content:content},{where:{board_id:boardId}})
        res.redirect('/board')
    }catch(err){
        return res.status(500).json(err)
    }
}



exports.insertComment = async (req,res) =>{
    let {boardId} = req.params
    let {comment} = req.body
    let moveBack = '/board/' + boardId
    try{
        await models.board_comment.create({board_id:boardId, board_comment:comment})
        return res.redirect(moveBack)
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.viewComment = async (req,res) => {
    let {commentId} = req.params
    try{
        let comment = await models.board_comment.findOne({
            where : {comment_id:commentId}
        })
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
        await models.board_comment.update({board_comment:comment},{where:{comment_id:commentId}})
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
        await models.board_comment.destroy({where: {comment_id:commentId}})
        return res.redirect(moveback)
    }catch(err){
        return res.status(500).json(err)
    }
}