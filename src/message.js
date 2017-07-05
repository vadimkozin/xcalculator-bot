/**
 *  модуль: message
 *  + преобразует сообщение от Telegram в emit-сообщение 
 */

const EventEmitter = require('events');

/**
 * Обработка сообщений от Telegram
 *  
 * Использование:
 *  const m = new Message(list_used_command);
 *  m.on('start', (msg) => onStart(msg));
 *  m.on('help', (msg) => onHelp(msg));
 *  m.on('formula',(msg) => onFormula(msg));
 *  m.on('noexist_command', (msg) => console.log(`No exist command:${msg.text}. Try /help`));
 * ..
 *  m.go(msg);
 */

class Message extends EventEmitter {
    /**
     * Конструктор
     * @param {Array} list_cmd список обрабатываемых команд: help, hello, start, ..
    */    
    constructor (list_cmd) {
        super();
        this._list_cmd = list_cmd;
    }
    
    close() {
        this.emit('close');
        this.removeAllListeners();
    }

    /**
     * Обработка сообщений
     * @param {Telegram message} msg - объект сообщения от Telegram
     * @return испускает сообщение(emit) для команды в msg.text 
    */
    go(msg) {

        const msg_text = msg.text.toLowerCase();

        const reCMD = /^\/([0-9а-я\w\d\_\-]+)/;     // команды типа: /help, /hello..
               
        let result = reCMD.exec(msg_text);
        if (result) {
            const cmd = result[1];                  // для команды типа /help, /hello ..
            if (this._list_cmd.indexOf(cmd) > -1) {
                this.emit(cmd, msg);                // испустим сообщение 'help', 'hello' ..
            }
            else {
                this.emit('noexist_command', msg );
            }
        }
        else {                                      // всё остальное должно быть формулой типа: 1+(2+3)*4
            this.emit('formula', msg);
        }       

    }

}

module.exports = Message;