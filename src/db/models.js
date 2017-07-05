// схемы и модели БД

const mongoose = require('mongoose');

// схема: Клиент
let userShema = new mongoose.Schema({
    chatid: {type:Number, required:true, index:true},   // chat id
    date: {type: Date, "default": Date.now},            // дата добавления
}, {versionKey: false}
);

// модели
const User = mongoose.model('User', userShema);

module.exports = {
    User,
}