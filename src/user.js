/**
 *  модуль: user
 *  + сохраняет свое состояние в базе и кеше
 *  + в кеше содержит только коды валидных пользователей (msg.chat.id)
 *  + к базе обращается при загрузке программы, при удалении и создании пользователя
 */
const log = require('./log')(module);
const q = require('./db/query');

class User {
    constructor() {
        this.users = {};    // только валидные пользователи (содержит: msg.chat.id)
        this.readUsers();
    }
    
    /**
     * Загружает в кеш коды валидных пользователей (msg.chat.id)
     */
    readUsers() {
    
        q.getUserList((err, users) => {
            if (err) {
                log.error('ERROR:(%d) %s', err.code, err.message);
                return;
            }
            if (users && users.length > 0) {
                for (let a of users) {
                    this.users[a.chatid] = true;    
                }                
            }
            console.log('USERS:', this.users);
        });
        
    }

    /**
     * Добавляет пользователя в базу и кеш
     * @param {Number} chatid пользователя
     */
    addUser(chatid) {
        return new Promise((resolve, reject) => {
            q.addUser(chatid, (err, user) => {
                if (err) {
                    log.error('ERROR:(%s) %s', err.code, err.message);
                    return reject(err);
                }
                if (user) {
                    this.users[chatid] = Date.now();
                    //log.info('add user:(%s)', chatid);
                    resolve(user);
                }
            });
        });
    }
    
    /**
     * Возвращает пользователя
     * @param {Number} chatid пользователя 
     */
    getUser(chatid) {
        return this.users[chatid];
    }

    /**
     * Удаление пользователя
     * @param {Number} chatid пользователя
     */
    delUser(chatid) {
        return new Promise((resolve, reject) => {
            q.deleteUserByChatid(chatid, (err, user) => {
                if (err) {
                    log.error('ERROR:(%s) %s', err.code, err.message);
                    return reject(err);
                }
                if (user) {
                    delete this.users[chatid];
                    //log.info('del user:(%s)', chatid);
                    resolve(user);
                }
            });
        });
    }

    print() {
        console.log('users::',this.users);
    }

}

module.exports =  {
    User,
} 



