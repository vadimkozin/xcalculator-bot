/**
 *  модуль: Message
 *  + обрабатывает все команды от пользователя
 */
const log = require('./log')(module);
const User = require ('./user').User;
const USER_PROCESS_LOGGING = require ('./user').USER_PROCESS_LOGGING;
const USER_VALID = require ('./user').USER_VALID;
const BOT_HELP = `
I understand and can calculate:

- arithmetic operations: +, -, *, /
- exponentiation (**)
- brackets ( and )
For example:

1+2*3     // 7
(1+3)*2   // 8
3**3      // 27

I respond to commands:
/help
/start
/hello
/on      // authentication
/off     // goodbye
`;

/**
 * @class Message
 */
class Message {

    constructor (msg) {
        this.msg = msg;
        this.user = new User(process.cwd() + process.env.USERS);
        this.state = this.user.getUserState(msg.chat.id);
    }

    /**
     * Процесс подготовки к вычислениям формул
     * @method process readyToCompute
     * @return true - означает что пользователь валидный и может вводить формулы
     */
    readyToCompute() {
 
        if (this.replyOnCmd(this.msg)) {  // команды доступны всем 
            return false;
        }
        if (this.waitPassword(this.msg)) { // ожидаем паспорт после команды /on
            return false;
        }
        if (!this.isUserValid(this.msg)) { // пользователь валидный?
            return false;
        }
        return true;       
    }

    /**
     * команда /on  (аутентификация)
     * 
     * @method cmdOn
     * @return this
     */
    cmdOn() {

        const msg = this.msg;
        const user_name = msg.from.first_name;

        switch(this.state) {
            case undefined:
                this.user.addUser(msg.chat.id, USER_PROCESS_LOGGING);
                msg.reply.text(`${ user_name }, input password:`);
                log.info(`try login user: ${ msg.chat.id }`);
                break;
            case USER_PROCESS_LOGGING:
                msg.reply.text(`${ user_name }, you already entered '/on', i wait password`); 
                break;
            case USER_VALID:
                msg.reply.text(`${ user_name }, you already valid user, try /help`); 
                break;
            default:
                msg.reply.text(`${ user_name }, your state is unknown, try /help`); 

        }

        return this;
    }

    /**
     * команда /off (выход из системы, противоположность команде /on)
     * @method cmdOff
     * @return this
     */
    cmdOff() {

        const msg = this.msg;

        if (this.state === USER_VALID) {
            this.user.delUser(msg.chat.id);
            msg.reply.text(`Goodbye, ${ msg.from.first_name }!`);
            log.info(`del user: ${ msg.chat.id }`);
        }
        else {
            msg.reply.text(`${ msg.from.first_name }, you already out. To log on enter /on`);
        }

        return this;
    }
    
    /**
     * после ввода /on ждём от пользователя паспорт
     * @return {Boolean}: true - пользователь в процессе ввода паcпорта
     *                    false - пользователь НЕ в процессе ..
     */
    waitPassword() {
        const msg = this.msg;

        if (this.state === USER_PROCESS_LOGGING) {
            if (msg.text === process.env.USER_PASSWORD) {
                this.user.setUserState(msg.chat.id, USER_VALID);
                this.user.saveUsers();
                msg.reply.text(`Welcome ${ msg.from.first_name }!, i am ready calculate, enter /help`);
                log.info(`ok user: ${ msg.chat.id }`);
            }
            else {
                msg.reply.text(`${ msg.from.first_name }, Wrong, try again:`);
            }
            return true;
        }
        return false;
    }

    /**
     * проверка - можно ли пользователю пользоваться калькулятором
     * @return {Boolean} true - пользователь валидный
     *                   false - пользователь не прошел аутентификацию
     */
    isUserValid() {

        if (this.state == USER_VALID) {
            return true;
        } 
        
        this.msg.reply.text(`${ this.msg.from.first_name }, you need to login, enter: /on`);
        return false;
     
    }

    /**
     * команды (признак команды - первый символ /)
     * @return {Boolean} true - введена валидная команда и обработана
     *                   false - команда неизвестна боту
     */
    replyOnCmd() {

        const msg = this.msg;
        let done = true;

        switch (msg.text) {
            case '/help': msg.reply.text(BOT_HELP); break;
            case '/start': msg.reply.text('Welcome!'); break;
            case '/hello': msg.reply.text(`Hello, ${ msg.from.first_name }!`); break;
            case '/on' : this.cmdOn(); break;
            case '/off' : this.cmdOff(); break;
            
            default: // больше команд я 'не знаю'
                if (msg.text[0] === '/') {
                    msg.reply.text(BOT_HELP); 
                } else {
                    done = false;
                }
        }

        return done;
    
    }
}

module.exports = Message;