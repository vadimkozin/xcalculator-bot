/*
name: MyCalculatorBot
username: XCalculatorBot

@BotFather
Done! Congratulations on your new bot. You will find it at t.me/XCalculatorBot. 
You can now add a description, about section and profile picture for your bot, 
see /help for a list of commands. By the way, when you've finished creating your cool bot, 
ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational
before you do this.

Use this token to access the HTTP API:
313608241:AAFg0FIlwCLULFazSoR_SzCBtH-e1U-EtL4

For a description of the Bot API, see this page: https://core.telegram.org/bots/api
*/
require('dotenv').load();
const TeleBot = require('telebot');
const log = require('./src/log')(module);
const calc = require ('./src/formula');
const User = require ('./src/user').User;
const USER_PROCESS_LOGGING = require ('./src/user').USER_PROCESS_LOGGING;
const USER_VALID = require ('./src/user').USER_VALID;
const TELEGRAM_BOT_TOKEN = '313608241:AAFg0FIlwCLULFazSoR_SzCBtH-e1U-EtL4'

const user = new User('./data/users.json');
//const log = console.log;
const BOT_HELP = `
I understand and can calculate:

- arithmetic operations: +, -, *, /
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


// команда /on  (аутентификация)
function cmdOn(msg) {

    let state = user.getUserState(msg.chat.id);

    switch(state) {
        case undefined:
            user.addUser(msg.chat.id, USER_PROCESS_LOGGING);
            msg.reply.text(`${ msg.from.first_name }, input password:`);
            log.info(`try login user: ${ msg.chat.id }`);
            break;
        case USER_PROCESS_LOGGING:
            msg.reply.text(`${ msg.from.first_name }, you already entered '/on', i wait password`); 
            break;
        case USER_VALID:
            msg.reply.text(`${ msg.from.first_name }, you already valid user, try /help`); 
            break;

    }

    return true;
}

// команда /off  (выход из системы)
function cmdOff(msg) {

    if (user.getUserState(msg.chat.id) == USER_VALID) {
        user.delUser(msg.chat.id);
        msg.reply.text(`Goodbye, ${ msg.from.first_name }!`);
        log.info(`del user: ${ msg.chat.id }`);
    }
    else {
        msg.reply.text(`${ msg.from.first_name }, you already out. To log on enter /on`);
    }
}

// после ввода /on ждём от пользователя паспорт
function waitPassword(msg) {
    
    if (user.getUserState(msg.chat.id) == USER_PROCESS_LOGGING) {
        if (msg.text === process.env.PWD_SECRET) {
            user.setUserState(msg.chat.id, USER_VALID);
            user.saveUsers();
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

// проверка - можно ли пользователю пользоваться калькулятором
function isUserValid(msg) {

    if (user.getUserState(msg.chat.id) == USER_VALID) {
        return true;
    } 
    
    msg.reply.text(`${ msg.from.first_name }, you need to login, enter: /on`);
    return false;
     
}

// команды
function replyOnCmd(msg) {
    let done = true;
    switch (msg.text) {
        case '/help': msg.reply.text(BOT_HELP); break;
        case '/start': msg.reply.text('Welcome!'); break;
        case '/hello': msg.reply.text(`Hello, ${ msg.from.first_name }!`); break;
        case '/on' : cmdOn(msg); break;
        case '/off' : cmdOff(msg); break;
        
        default: // больше команд (знак /) я 'не знаю'
            if (msg.text[0] === '/') {
                msg.reply.text(BOT_HELP); 
            } else {
                done = false;
            }
    }

    return done;
}

const bot = new TeleBot(TELEGRAM_BOT_TOKEN);

bot.on('text', (msg) => { 

    //log.info(msg.text);

    if (replyOnCmd(msg)) {  // все команды доступны всем кроме вычислений
        return;
    }
    if (waitPassword(msg)) { // ожидаем паспорт после команды /on
        return;
    }
    if (!isUserValid(msg)) { // пользователь валидный?
        return;
    }

    let result = calc(msg.text);    // ожидаем формулу
    log.info(`user: ${ msg.chat.id } do : ${ msg.text } = ${ result }`);
    msg.reply.text(msg.text + "=" + result);    // результат пользователю
    
});

bot.on('error', e => {
   log.error(e.error.message);
    if (e.error.name === 'FormulaError') {
        e.data.reply.text(e.error.message + ", try /help"); 
    }
});

bot.start();

