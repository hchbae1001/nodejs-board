const bcrypt = require('bcrypt')
const { addColors } = require('winston/lib/winston/config')
const models = require('../models')

exports.userLogin = async (req,res) => {
    let { id,pwd } = req.body
    try{
        let row = await models.user.findOne({where : {id:id}})
        const pwdsame = bcrypt.compareSync(pwd,row.password);
        if(pwdsame === true && id === row.id){
            sess = req.session
            sess.username = row.name
            sess.user_id = row.id
            return res.render('index', {title: 'logined', name: sess.username,id:sess.user_id})
        }else{
            return res.redirect('/')
        }
    }catch(err){
        return res.status(500).json(err)
    }
}

exports.userView = async (req,res) => {
    sess = req.session
    const {id} = req.params
    if(id === sess.user_id){
      try{
        let row = await models.user.findOne({where:{id:id}})
        res.render('user/view', {data: row})
      }catch(err){
        return res.status(500).json(err)
      }
    }else{
      return res.redirect('/')
    }
}
exports.userUpdate = async (req,res) =>{
    const {id,email,name,gender,password}=req.body
    const encodedPwd = bcrypt.hashSync(password,10)
    try{
        await models.user.update({email:email,name:name,gender:gender,password:encodedPwd},{where:{id:id}})
        await req.session.destroy(function(){
            req.session;
        });
        return res.redirect('/users/logout')
      }catch(err){
        return res.status(500).json(err)
      }
}
exports.userDelete = async (req,res) =>{
    const { id } = req.params
    try{
        await models.user.destroy({where:{id:id}})
        await req.session.destroy(function(){
            req.session;
        })
        return res.redirect('/')
    }catch(err){
        return res.status(500).json(err)
    }
}
exports.userLogout = function (req,res){
    const {id} = req.params
    sess = req.session
    if(id){
      req.session.destroy(function(err){
          sess=null
        if(err){
          console.log(err)
        }else{
          res.redirect('/')
        }
      })
    }else{
      res.redirect('/')
    }
}

exports.userInsert = async (req,res) =>{
    const {id,email,name,gender,password} = req.body
    const encodedPassword = bcrypt.hashSync(password, 10)
    try{
      await models.user.create({id:id, email:email, name:name, gender:gender,password:encodedPassword})
      res.redirect('/')
    }catch(err){
      return res.status(500).json(err)
    }
}