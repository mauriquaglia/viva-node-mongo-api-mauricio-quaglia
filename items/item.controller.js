const express = require('express');
const router = express.Router();
const itemService = require('./item.service');

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
    itemService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    console.log(req.body);
    itemService.create(req.body)
        .then(items => res.json(items))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    itemService.getAll()
        .then(items => res.json(items))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    itemService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    itemService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    itemService.update(req.params.id, req.body)
        .then(items => res.json(items))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    itemService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}