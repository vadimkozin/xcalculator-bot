/*
name: XCalculator
username: XCalculatorBot
*/

const TeleBot = require('telebot');
const log = require('./log')(module);
const calc = require ('./formula');
const Message = require('./message');
const Command  = require('./command');

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

const MESSAGE_TYPES = ['start', 'help', 'hello', 'off'];
const m = new Message(MESSAGE_TYPES);
const cmd = new Command();

m.on('start', (msg) => cmd.onStart(msg));
m.on('help', (msg) => cmd.onHelp(msg));
m.on('hello', (msg) => cmd.onHello(msg));
m.on('off', (msg) => cmd.onOff(msg));
m.on('formula', (msg) => cmd.onFormula(msg));
m.on('noexist_command', (msg) => cmd.onNoExistCommand(msg));

bot.on('text', (msg) => { 
    m.go(msg);    
});

bot.on('error', e => {
    if (e.error.name === 'FormulaError') {
        e.data.reply.text(e.error.message); 
    }
    else {
        log.error(e.error.message);
    }
});

bot.start();

