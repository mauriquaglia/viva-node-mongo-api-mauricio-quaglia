const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    itemId: { type: mongoose.Schema.ObjectId,  ref: 'Items', required: true },
    response: { type: String, required: true },
    isTrue: { type: Boolean, required: true }

});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('itemResponses', schema);