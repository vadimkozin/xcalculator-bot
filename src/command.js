/**
 *  модуль: command
 *  Обработка команд
 */
const log = require('./log')(module);
const calc = require ('./formula');
const User = require('./user').User;

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
/hello
/start password   
/off
`;

class Command {
    
    constructor () {
        this.user = new User();
    }

    info(msg) {
        return `user: ${ msg.chat.id } do : ${ msg.text }`;
    }
    
    // команда /help
    onHelp(msg) { 
        log.info(this.info(msg));
        msg.reply.text(BOT_HELP); 
    }

    // команда /hello
    onHello(msg) { 
        log.info(this.info(msg));
        msg.reply.text(`Hello, ${ msg.from.first_name }!`);
    }
    
    // не существующая команда
    onNoExistCommand(msg) {
        log.info(this.info(msg) + ' -> no exist command!');
        msg.reply.text(`No exist command: ${msg.text}. Try /help`);
    }
    
    // вычисление
    onFormula(msg) {
       
        if (!this.user.getUser(msg.chat.id)) {
            const answer = 'enter: /start password.';
            msg.reply.text(`${msg.from.first_name}, ${answer}`);
            log.info(this.info(msg) + ` -> ${answer}`);
            return;
        }
        const result = calc(msg.text);
        log.info(this.info(msg) + ` = ${ result }`);
        msg.reply.text(msg.text + "=" + result);    // результат пользователю
    }

    // выход (команда /off)
    onOff(msg) {
        const user_id = msg.chat.id,
              user_name = msg.from.first_name;
        
        if (!this.user.getUser(user_id)) {
            const answer = 'you are already exit.';
            msg.reply.text(`Dear ${ user_name }, ${ answer }`);
            log.info(this.info(msg) + ` -> ${ answer }`);
            return;
        }
        
        this.user.delUser(user_id).then((user)=> {
            msg.reply.text(`Goodbye, ${ user_name }!`);
            log.info(this.info(msg));            
        });
    }

    // вход (команда /start)
    onStart(msg) {

        const user_id = msg.chat.id,
              user_name = msg.from.first_name,
              reply = msg.reply.text,
              reStart = /^\/start\s+(.+)$/; // после /start ожидаем пароль

        // легитимному пользователю второй раз команду /start вводить не надо
        if (this.user.getUser(user_id)) {
            reply(`Dear ${user_name}, you are already authenticated and can use the calculator. Try /help`);
            return;
        }
                
        const result = reStart.exec(msg.text);
 
        if (!result) {
            reply('expected command: /start password');
            log.info(this.info(msg) + ' -> enter: /start password');
            return;
        }

        if (result[1] !== process.env.USER_PASSWORD) {
            reply(`Dear ${user_name}, the password is incorrect.`);
            log.info(this.info(msg) + ' -> password wrong');
            return;        
        }

        this.user.addUser(user_id).then(user => {
            reply(`Dear ${user_name}, you can use the calculator. Try /help`);
            log.info(this.info(msg) + ' -> password ok.');
        }).catch((err) => {
            log.info('ERROR ADD USER:', err);
        });

    }

}

module.exports = Command;