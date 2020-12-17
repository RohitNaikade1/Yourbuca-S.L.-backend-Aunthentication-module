const express = require('express');
const Router = express.Router();
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const key = require('../config/keys')

Router.post('/signup', (req, res) => {
    const { name, email, password, number, DOB } = req.body;

    User.findOne({
        email
    }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is already exists!'
            });
        } else {
            const user = new User({
                email,
                name,
                password,
                number,
                DOB
            });
            user.save((err, user) => {
                if (err) {
                    console.log('Save error', err);
                    return res.status(401).json({
                        errors: err
                    });
                } else {
                    return res.status(200).json({
                        message: 'Signup successful!'
                    });
                }
            });
        }
    });
});

Router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    User.findOne({
        email
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                errors: 'User with that email does not exist'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                errors: 'Email and password do not match'
            });
        } else {
            const name = user.name;
            const email = user.email;
            const password = user.hashed_password;
            const number = user.number;
            const DOB = user.DOB;
            const token = jwt.sign(
                {
                    name,
                    email,
                    password,
                    number,
                    DOB
                },
                key.SECRET_KEY,
                {
                    expiresIn: '1d'
                }
            );
            return res.status(200).json({
                message: token
            });
        }
    });
});


Router.post('/getCreds', (req, res) => {
    const token = req.body.token;

    const dt = jwt.decode(token, {
        complete: true
    })
    return res.status(200).json({
        credentials: dt.payload
    });
});

module.exports = Router;