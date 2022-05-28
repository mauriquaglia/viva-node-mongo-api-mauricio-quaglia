const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
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
    const  items = await Items.aggregate([{
        $lookup: {
            from: "itemresponses", // collection name in db
            localField: "_id",
            foreignField: "itemId",
            as: "responses"
        }
    }]).exec();
    return items;


}

async function getById(id) {
    return await Questions.findById(id);
}

async function create(userParam) {
    // validate
    if (await Items.findOne({ questionItem: userParam.item.questionItem, _id: userParam.item.questionId })) {
        throw 'La pregunta  "' + userParam.item.questionItem + '" ya existe';
    }

    const item = new Items(userParam.item);
    await item.save();

    // save user

    var itemResponse;
    const itemResponses = userParam.itemResponses;
    await itemResponses.forEach(element => {
        itemResponse = new ItemResponses({itemId: item._id, response: element.response, isTrue: element.isTrue});
        itemResponse.save();
    });
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(100) 
    const  itemsResult = await Items.aggregate([{
        $lookup: {
            from: "itemresponses", // collection name in db
            localField: "_id",
            foreignField: "itemId",
            as: "responses"
        }
    }]).exec();
    return itemsResult;

}

async function update(id, userParam) {

    const item = await Items.findById(id);

    // validate
    if (!item) throw 'Pregunta no encontrada';
    await ItemResponses.deleteMany({itemId: id});
    await Items.findByIdAndRemove(id);

    const items = new Items(userParam.item);
    await items.save();

    // save user

    var itemResponse;
    const itemResponses = userParam.responses;
    await itemResponses.forEach(element => {
        itemResponse = new ItemResponses({itemId: items._id, response: element.response, isTrue: element.isTrue});
        itemResponse.save();
    });
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(100) 
    const  itemsResult = await Items.aggregate([{
        $lookup: {
            from: "itemresponses", // collection name in db
            localField: "_id",
            foreignField: "itemId",
            as: "responses"
        }
    }]).exec();
    return itemsResult;

}

async function _delete(id) {
    await ItemResponses.deleteMany({itemId: id});
    await Items.findByIdAndRemove(id);
}