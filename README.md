## @XCalculatorBot 
Бот-калькулятор для telegram. Умеет складывать, вычитать, умножать, делить, понимает скобочные выражения и возведение в степень. Доступ к функционалу бота - по паролю. Пароль задаётся в файле .env
пример:
https://telegram.me/XCalculatorBot
доспуп по паролю: 123
/start 123


## подготовка
```bash
    run MongoDB on localhost
    move env.sample .env
    edit .env
```
## запуск
```bash
    npm install
    node app
```
## функционал
```
Примеры:
1+2*3     // 7
(1+3)*2   // 8
3**3      // 27

Понимает команды:
/help
/hello
/start пароль
/off
```