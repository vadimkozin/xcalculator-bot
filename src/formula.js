/**
 *  модуль: formula
 *  Вычисление выражения типа: (10 + 3/4 - 6 + (18/9 -1))
 *  + (раскрываем скобки)
 *  + вычисляем операции в скобках
 *  + подставляем результат вместо скобок
 *  + продолжаем пока есть скобки
 */
const log = require('./log')(module);

const Calculator = require ('./calculator');

function FormulaError(message) {
  this.message = message;
  this.name = 'FormulaError';
}

function parseRoundBracket(formula) {
    let pattern = /^[0-9\.+\-\*\/\s()]+$/;
    if (!pattern.test(formula)) {
        throw new FormulaError("oops, invalid characters . (valid: 0-9().+/-*)");
    }

    let line = "(" + formula + ")";

    while (true) {
        let openBracket = line.lastIndexOf("(");
        if (openBracket == -1) { 
             break;
        } else {
            let closeBracket = line.indexOf(")", openBracket);
            if (closeBracket == -1) {
                throw new FormulaError("a different number of opening and closing braces");
            }
            let abc = line.slice(openBracket + 1, closeBracket);
            calc = new Calculator(abc);            
            line = line.substr(0, openBracket) + calc.result() + line.substr(closeBracket + 1);
        }
    }
    return line;

}

function calculateFormula(formula) {
    return parseRoundBracket(formula);
}

module.exports = calculateFormula;

