/**
 * Created by Karim on 31.03.2016.
 */
var express = require('express');
var UserRouter = express.Router();
var User = require('../models/User');

var HttpError = require('../error');

UserRouter.route('/')
    .post(function(req, res, next){
        User.find({username: req.body.username}, function(err, user) {
            if(err) return next(err);
            if(user.length > 0) {
                return next(new HttpError(302, "User with this username has already"));
            } else {
                User.create(req.body, function(err, user) {
                    if(err) return next(err);
                    req.session.user = user._id;
                    res.json(user);
                });
            }
        });
    })
;

UserRouter.route('/login')
    .post(function(req, res, next){
        User.authorize(req.body.username, req.body.password, function(err, user) {
            if(err) return next(err);

            req.session.user = user._id;
            res.json(user);
        })
    })
;

UserRouter.route('/logout')
    .post(function(req, res, next) {
        req.session.destroy();
        res.json({});
    })
;

UserRouter.route('/loadSession')
    .get(function(req, res, next) {
        res.json(req.user);
    })
;

module.exports = UserRouter;