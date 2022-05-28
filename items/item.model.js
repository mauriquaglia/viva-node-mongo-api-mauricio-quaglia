const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    questionId: { type: String, required: true },
    questionItem: { type: String, required: true },
    type: { type: String, required: true },
    createdUserId: { type: String, required: false },
    createdDate: { type: Date, default: Date.now }

});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Items', schema);