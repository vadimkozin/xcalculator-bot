const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('./db');
const User = require('./models').User;

/**
 * Добавляет пользователя в базу
 * @param {Number} chatid уникальный код пользователя
 * @param {Fn} callback (err, user) результат
 */
module.exports.addUser = function (chatid, callback) {

    User.create({chatid}, (err, user) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, user);
        }

    });
}

/**
 * Удаляет пользователя из базы
 * @param {Number} chatid уникальный код пользователя
 * @param {Fn} callback(err, user) результат
 */
module.exports.deleteUserByChatid = function(chatid, callback) {
    
    User.findOneAndRemove({chatid}, (err, user) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, user);
        }

    });
}

/**
 * Возвращает пользователя из базы
 * @param {Number} chatid уникальный код пользователя
 * @param {Fn} callback(err, user) результат
 */
module.exports.getUserByChatid = function(chatid, callback) {

    User.findOne({chatid}, (err, user) => {
        if (err) {
            return callback(err, null);
        }
        if (user) {
            return callback(null, user);
        } 
    });
}

/**
 * Возвращает chatid всех пользователей
 * @param {Fn} callback(err, users) результат.
 */
module.exports.getUserList = function (callback) {

    User.find({}, 'chatid -_id', (err, users) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, users);
    });
}
