const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Customer} = require('../models/Customer');
const { Token } = require('../models/Token');
const {auth} = require('../middlewares/auth');
const { resetPassword } = require('../utils/emailTemplates');
const { sendEmail } = require('../utils/sendEmail');


router.post("/register", (req, res) => {
    Customer.find({email: req.body.email}).exec().then((customer) => {
        if(customer.length >=1){
            return res.status(401).json({
                status: false,
                message: "Email exists",
                data: undefined
            })
        }else{
            bcrypt.hash(req.body.password, 2, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        status:false,
                        message: "Error, cannot encrypt password",
                        data: undefined
                    })
                }else{
                    const customer = new Customer({...req.body, password: hash});
                    customer.save((err, doc) => {
                        if(err) return res.json({
                            status:false,
                            message: err,
                            data: undefined
                        })
                        return res.status(200).json({
                            status:true,
                            message: "Register successfully!",
                            data: doc
                        })
                    })
                }
            })
        }
    })
})

router.post("/login", (req, res) => {
    Customer.findOne({email: req.body.email}).exec()
        .then((customer) => {
            if(!customer){
                return res.status(401).json({
                    message: "User not found",
                    status: false,
                    data: undefined
                })
            }
            bcrypt.compare(req.body.password, customer.password, async (err, result) => {
                if(err){
                    return res.status(401).json({
                        status: false,
                        message: "Server error, authentication failed",
                        data: undefined
                    })
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: customer.email,
                            customerId: customer._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "2h"
                        }
                    );
                    
                    await Token.findOneAndUpdate({_customerId: customer._id, tokenType: "login"}, {token: token}, {new: true, upsert: true})
                    return res.status(200).json({
                        status: true,
                        message: "Login successfully!",
                        data: {
                            token,
                            customer
                        }
                    })
                        
                }
                return res.status(401).json({
                    status: false,
                    message: "Wrong password, login failed",
                    data: undefined
                })
            })
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error, authentication failed",
                data: undefined
            })
        })
});

router.get("/logout", auth, (req, res) => {
    Token.findOneAndDelete({_customerId: req.customerId, tokenType: "login"}, (err, doc) => {
        if(err) return res.status(401).json({
            status: false,
            message: "Server error, logout failed",
        })
        return res.status(200).json({
            status: true,
            message: 'Logout successfully'
        })
    })
})

router.get("/authUser", auth, (req, res) => {
    const customerId = req.customerId
    Customer.findById(customerId, (err, customer) => {
        if(err){
            return res.status(401).json({
                status: false,
                message: "Authentication failed",
                data: undefined
            })
        }
        if(customer){
            res.status(200).json({
                data: customer,
                message: "Authentication successfully!",
                status: true,
            })
        }
    })
})

router.put("/resetPassword/:token",  (req, res) => {
    const token = req.params.token;
    const { newPassword } = req.body;
    console.log('object')
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_RESET_PW_KEY);
      Token.findOne({_customerId: decoded.customerId, token: token, tokenType:'resetPassword'}, async (err, doc)  => {
        if(err){
          console.log(err);
            return res.status(500).json({
              status: false,
              message: "Invalid token",
              data: err,
            });
        }
        const customer = await Customer.findOne({ email: decoded.email });
        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              status: false,
              message: "Error, cannot encrypt password",
              data: err,
            });
          }
          customer.password = hash;
          customer
            .save()
            .then(async(result) => {
              await Token.findOneAndDelete({_customerId: customer.id, tokenType:'resetPassword'});
              res.status(200).json({
                status: true,
                message: "Password reset successfully",
                data: result,
              });
            })
            .catch((err) => {
              res.status(400).json({
                status: false,
                message: "server error",
                data: err,
              });
            });
        });
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Server error",
        data: error,
      });
    }
});



router.put("/forgotPassword", (req, res) => {
    const {email} = req.body;

    Customer.findOne({email}, (err, customer) => {
        if(err|| !customer){
            return res.status(400).json({
                status: false,
                message: "Error or email does not exist",
                data: undefined
            })
        }
        const token = jwt.sign(
            {
            email: customer.email,
            customerId: customer._id
            },
            process.env.JWT_RESET_PW_KEY,
            {
                expiresIn: "20m",
            }
        )
        Token.findOneAndUpdate({_customerId: customer._id, tokenType: "resetPassword"}, {token: token}, {
            new: true, upsert: true
        }, (err, doc) => {
            if(doc){
                const emailTemplate = resetPassword(email, token);
                sendEmail(emailTemplate);
                res.status(200).json({
                    status: true,
                    message: "Email for reset password has been sent",
                })
            }else{
                return res.status(400).json({
                    status: false,
                    message: "Server error",
                    data: undefined
                })
            }
        })
    })
});

router.put("/changePassword", auth, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const customerId = req.customerId;
    const customer = await Customer.findById(customerId);
    if(customer){
        bcrypt.compare(oldPassword, customer.password, (err, isMatch) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: "Server error",
                    error: err
                })
            }else if(isMatch){
                bcrypt.hash(newPassword, 10, async (err ,hash) => {
                    if(err){
                        return res.status(500).json({
                            status: false,
                            message: "Error, cannot encrypt password",
                            error: err
                        })
                    }
                    customer.password = hash;
                    customer.save().then(updatedCustomer => {
                        return res.status(200).json({
                            status: true,
                            message: "Password has been changed successfully",
                            data: updatedCustomer
                        })
                    })
                })
            }else{
                return res.status(401).json({
                    status: true,
                    message: "Old password incorrect",
                    data: undefined
                })
            }
        })
    }
})





module.exports = router;