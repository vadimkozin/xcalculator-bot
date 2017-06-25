/*
name: XCalculator
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

const TeleBot = require('telebot');
const log = require('./log')(module);
const calc = require ('./formula');
const Message = require('./message');

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('text', (msg) => { 

    const message = new Message(msg);

    // процес прохождения пользователем валидации и обработкаы команд типа /help
    if (!message.readyToCompute()) {
        return;
    }

    // пользователь валидный и может вводить формулы
    const result = calc(msg.text);
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

