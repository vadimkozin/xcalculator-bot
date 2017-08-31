/**
 * модуль: сalculator
 * Простой калькулятор, решает формулы на операции : * / + - **
 * формула должна быть без скобок
 * примеры формул: '10+5*100 + 25', '12/2+300.56-20.12',  2**8
 * ограничения: отрицательные числа в формуле не обрабатыватся: '12/-2' не сработает!
 * но если заменить знак отрицания, например на ! и сказать об этом в конструкторе, то работает '12/!2 = -6'
 * used:
 * let formula = '100 / 20 + 3';
 * let calc = new Calculator (formula);
 * console.log(formula, '=>', calc.result());
 */
//const log = require('./log')(module);

function contains(arr, elem) {
    return arr.indexOf(elem) != -1;
}

class Calculator  {
    constructor(formula, sign_denial=null) {
        this.formula = formula;     // исходная формула типа '10+5*100-25'
        this.sign_denial = sign_denial // заменитель знака отрицания, например !
        this.solution = 0;          // решение формулы
        
        this.methods = {            // операции калькулятора
            "+": (a, b) => {return +a + +b},
            "-": (a, b) => {return a - b},
            "*": (a, b) => {return a * b},
            "/": (a, b) => {return a / b},
            "**": (a, b) => {return Math.pow(a, b)}
        };

        this._prepare();
        this._calculate();
        
    }

    // подготовка: вокруг операций (** * / + -) слева и справа делаем один пробел
    _prepare() {
        
        this.formula = this.formula
            .replace(/\s+/g, '')            // удалим все пробелы
            .replace(/([*]{2})/g, 'Q')      // возведение в степень (**) заменим на Q
            .replace(/([*/+-])/g, ' $1 ')   // вокруг всех операций cделаем один пробел
            .replace(/([Q])/g, ' ** ');     // Q меняем на возведение в спепень (**)
    }

    // вычисление: ожидается строка типа: '10 + 5 * 100 - 4 / 2'   
    _calculate() {

        // операции с учётом приоритета
        const operators = [['**'], ['*', '/'], ['-', '+']];
        
        const filler = '#';

        let abc = this.formula.split(' ');

        if (this.sign_denial) {
            abc = abc.map(x => x.replace(this.sign_denial, '-'));
        }

        operators.forEach(op => {
            abc.forEach((v,i,a) => {
                
                if (contains(op, v)) {
                    
                    a[i+1] = this.methods[v](a[i-1], a[i+1]);
                    a[i-1] = a[i] = filler;
                }
             
            });

            abc = abc.filter(v =>  v !== filler);

        });

        this.solution = abc[0]; // 'должен остаться только один'
        
    }
    result() {
        return this.solution;
    }
    
}
module.exports = Calculator

