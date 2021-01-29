const BoardService = require('../services/board-service')

exports.getBoard = async (req, res) => {
    let { boardId } = req.params
    try {
        let rows = await BoardService.getBoard(boardId)
        // return res.json(rows[0])
        res.render('board/view',{ data: rows})
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.getBoards = async (req, res) => {
    try{
        let rows = await BoardService.getBoards()
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