const express = require('express');
const router = express.Router();
const questionService = require('./question.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    questionService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    questionService.create(req.body)
        .then((questions) => res.json(questions))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    questionService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    questionService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    questionService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    questionService.update(req.params.id, req.body)
        .then((questions) => res.json(questions))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    questionService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}