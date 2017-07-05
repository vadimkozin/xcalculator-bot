## @XCalculatorBot 
Бот-калькулятор для telegram. Умеет складывать, вычитать, умножать, делить, понимает скобочные выражения и возведение в степень. Доступ к функционалу бота - по паролю. Пароль задаётся в файле .env

## рабочий пример:
```bash
https://telegram.me/XCalculatorBot
и войти в с ним в контакт:
/start 123
```

## подготовка к запуску на localhost
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