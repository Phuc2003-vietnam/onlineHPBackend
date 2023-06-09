const jwt = require('jsonwebtoken');
const path=require('path')
const accConnection = require("../../config/db/account.js");
const QUERY = require("../models/wdtquery")
const cookieParser = require('cookie-parser');
require("dotenv").config();
class LoginController{
    signup(req,res){
        async function check ()
        {
            var check=(await accConnection.query(QUERY.SELECT_LOGIN_CHECK_USER,[req.body.email,req.body.password]))[0][0]
            if(!check.Existing)
            {
               await accConnection.query(QUERY.INSERT_SIGNUP_USER,[req.body.email,req.body.password])
               res.status(200).send('Signup Succesfully')
            }
            else{
               res.status(400).send('Signup Failed')
            }
        }
        check()
    }
    checkAndSendToken(req,res)
    {
        async function check ()
        {
            try{
                        var check1=(await accConnection.query(QUERY.SELECT_LOGIN_CHECK_USER,[req.body.email,req.body.password]))[0][0]
                        var check2=(await accConnection.query(QUERY.SELECT_LOGIN_CHECK_EMPLOYEE,[req.body.email,req.body.password]))[0][0]
                        console.log(check1);
                        console.log(check2);
                        if(check2.Existing)
                        {
                        var roleId=(await accConnection.query(QUERY.SELECT_LOGIN_ROLEID,[req.body.email,req.body.password]))[0][0]
                        var employeeID=(await accConnection.query(QUERY.SELECT_LOGIN_EMPLOYEEID,[req.body.email,req.body.password]))[0][0]
                        var avatar=(await accConnection.query(QUERY.SELECT_LOGIN_AVATAR,[req.body.email,req.body.password]))[0][0]
                        // var token=  jwt.sign({email:req.body.email,roleID:roleId.roleId},process.env.SECRET)
                        var token={
                            email:req.body.email,
                            roleID:roleId.roleId,
                            employeeID:employeeID.id,
                            avatar:avatar.avatar
                        }
                        // res.cookie('token', token,{
                        //     sameSite: 'None',
                        //     secure: true
                        //   });
                        // res.setHeader('Set-Cookie', `token=${token}; Secure; SameSite=None`);
                        res.status(200).json(token)
                        }
                        else if(check1.Existing)
                        {
                            var id=(await accConnection.query(QUERY.SELECT_LOGIN_USERID,[req.body.email,req.body.password]))[0][0]
                            // var token=  jwt.sign({id:id.id,},process.env.SECRET)
                            var token={
                                id :id.id
                            }
                            res.cookie('token', token);
                            res.status(200).json(token)
                        }
                        else{
                        res.status(400).send('Login Failed')
                        }
            }
            catch(error)
            {
                res.status(400).json(error)
            }
     }
        check()
    }
    // checkTokenExist(req,res,next)  {    
    //     try{
    //         var ketqua=jwt.verify(req.cookies.token,process.env.SECRET)
    //         next();
    //     }
    //     catch(err){
    //         res.status(401).send('Unauthorized')
    //     }
    // }
    // logout(req,res,next)
    // {
    //     res.clearCookie('token');
    //     res.status(200).send('Logout Successfully')
    // }
}

module.exports=new LoginController()