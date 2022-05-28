const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Questions = db.Questions;
const Items = db.Items;
const ItemResponses = db.ItemResponses;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await Questions.find();
}

async function getById(id) {
    return await Questions.findById(id);
}

async function create(userParam) {
    // validate
    if (await Questions.findOne({ name: userParam.name })) {
        throw 'El cuestionario  "' + userParam.name + '" ya existe';
    }

    const question = new Questions(userParam);

    // save user
    await question.save();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(100) 
    return await Questions.find()
}

async function update(id, userParam) {
    const question = await Questions.findById(id);

    // validate
    if (!question) throw 'Cuestionario no encontrado';
    if (question.name !== userParam.name && await Questions.findOne({ name: userParam.name })) {
        throw 'El cuestionario "' + userParam.name + '" ya existe';
    }


    // copy userParam properties to user
    Object.assign(question, {name: userParam.name, description: userParam.description});

    await question.save();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(100) 
    return await Questions.find()
}

async function _delete(id) {
    const q =  await Questions.findById(id);
    let i;
    if (q) {
        i =  await Items.findOne({questionId: q.id});
        await Items.deleteMany({questionId: q.id});
    }

    if (i) {
        await ItemResponses.deleteMany({itemId: i.id});
    }

    await Questions.findByIdAndRemove(id);
}