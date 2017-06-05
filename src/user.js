/**
 *  модуль: User
 *  + сохраняет свое состояние в файле
 *  + определяет статус пользователя (USER_VALID, USER_PROCESS_LOGGING)
 */
const fs = require('fs');
const log = require('./log')(module);
const USER_PROCESS_LOGGING = 0; 
const USER_VALID = 1;

class User {
    constructor(filename) {
        this.filename = filename;
        this.users = {};
        this.readUsers();
    }
    
    readUsers() {
        try {
            let contents = fs.readFileSync(this.filename, 'utf8');
            this.users = JSON.parse(contents);
        }
        catch(e) {
            if (e.code === 'ENOENT') {
                this.saveUsers();
            }
        }
    }

    saveUsers() {
        fs.writeFileSync(this.filename, JSON.stringify(this.users));
    }

    addUser(id, stat) {
        this.users[id] = stat;
        this.saveUsers();
    }
    
    setUserState(id, stat) {
        this.addUser(id, stat);
    }
    
    getUserState(id) {
        return this.users[id];
    }

    delUser(id) {
        delete this.users[id];
        this.saveUsers();
    }

    print() {
        console.log(this.users);
    }

}

module.exports =  {
    User,
    USER_PROCESS_LOGGING,
    USER_VALID
} 

/*
let user = new User('./data/users.json');
//user.readUsers();
user.print();
user.addUser(123, USER_PROCESS_LOGGING);
user.addUser(456, USER_VALID);
user.saveUsers();
user.print();
log (user.getUserState(123));
log (user.getUserState(456));
log (user.getUserState(888) === undefined);
user.delUser(456);
user.print();
*/




