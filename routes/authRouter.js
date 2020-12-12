const express = require('express');
const Router = express.Router();
const User = require('../models/userSchema');

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
                console.log(err)
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
            return res.status(200).json({
                message: "Logged in successfully!"
            });
        }
    });
});

module.exports = Router;