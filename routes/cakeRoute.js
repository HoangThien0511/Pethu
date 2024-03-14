const express = require('express');
const bodyParser = require('body-parser');

const Cake = require('../models/cake');
var authenticate = require('../authenticate');


const cakeRoute = express.Router();
cakeRoute.use(bodyParser.json());

cakeRoute.route('/')
    .get((req, res, next) => {
        Cake.find({})
            // .populate('question')
            .then((quiz) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(quiz);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        req.body.author = req.user._id;
        Cake.create(req.body)
            .then((quiz) => {
                console.log('Quiz Created: ', quiz);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(quiz);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /cake');
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Cake.deleteMany()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

cakeRoute.route('/:cakeId')
    .get((req, res, next) => {
        Cake.findById(req.params.cakeId )
            .then((quiz) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(quiz);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end("POST operation not supported on /quiz/" + req.params.cakeId );
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Cake.findByIdAndUpdate(req.params.cakeId , {$set: req.body}, {new: true})
            .then((quiz) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(quiz);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Cake.findByIdAndRemove(req.params.cakeId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

cakeRoute.route('/:cakeId/populate')
    .get((req, res, next) => {
        Cake.findById(req.params.cakeId )
            .populate({path: 'questions'})
            .then((quiz) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                const questionsWithCapital = quiz.questions.filter(q => q.text.toLowerCase().includes("capital"));
                console.log(questionsWithCapital);
                console.log(quiz)
                console.log(quiz.questions)
                res.json(questionsWithCapital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = cakeRoute;