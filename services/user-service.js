const pool = require('../database/pool')
const userQuery = require('../queries/user-query')

exports.userLogin = async(id) => {
    try{
        let data = await pool.query(userQuery.getUser,id)
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}
exports.userUpdate = async(email,name,gender,password,id) =>{
    try{
        let data = await pool.query(userQuery.updateUser,[email,name,gender,password,id])
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}
// exports.getBoard = async (boardId) => {
//     try {
//         let data = await pool.query(BoardQuery.getBoard, boardId)
//         return data[0]
//     } catch (err) {
//         console.log(err)
//         throw Error(err)
//     }
// }

exports.userDelete = async(id) => {
    try{
        let data = await pool.query('delete from user where id=?',id)
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}
exports.userInsert = async(id,email,name,gender,password) => {
    try{
        let data = await pool.query(userQuery.insertUser,{id:id,email:email, name:name, gender:gender,password:password})
        return data[0]
    }catch(err){
        console.log(err)
        throw Error(err)
    }
}
