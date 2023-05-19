// класс для хранения данных о товаре со свойствами
class Good {
    constructor(id, name, description, sizes, price, available) {
        // ID
        this.id = id;
        // название
        this.name = name;
        // описание
        this.description = description;
        // массив размеров
        this.sizes = sizes;
        // цена
        this.price = price;
        // доступность
        this.available = available;
    }
    // Изменение доступности
    setAvailable() {
            return this.available = true
    }  
}
// класс для хранения каталога товаров со свойствами
class GoodsList {
    #goods = [];
    constructor(goods, filter, sortPrice, sortDir) {
        this.#goods = goods;
        // регулярное выражение вида /<regexp>/<flags>
        this.filter = filter;
        // включение сортировки
        this.sortPrice = sortPrice;
        //направление сортировки (true - по возрастанию, false - по убыванию)
        this.sortDir = sortDir;
    }
    // Массив доступных товаров с сортировкой по цене
    get list() {
        let result = [];
        for (let index = 0; index < this.#goods.length; index++) {
            // ищем совпадение фильтра в #goods..... по названию
            // Подставляем регулярное выражение
            if (this.filter.test(this.#goods[index].name) === true) {
                // Если тру - добавляем в массив
                result.push(this.#goods[index]);
                }
        }
        // Сортируем по цене (не совсем понял в какую сторону возрастание в какую убывание должно быть - в верх или вниз)....
        if (this.sortPrice === true) {
            // console.log('Применяется сортировка');
            if (this.sortDir === true) {
                console.log('Вначале дешевое');
                result.sort(( a, b ) => {
                    return a.price - b.price;
                });
            } else {
                console.log('Вначале дорогое');
                result.sort(( a, b ) => {
                    return b.price - a.price;
                });
            }
        }
        return result
    }    
    // Добавляем товар в каталог    
    add(newGood) {
        this.#goods.push(newGood);
        let addGoods = this.#goods;
        return addGoods
    }
    // удаление товара из каталога по его id
    remove(idGoodDel) {
        let flag = false
        // если находим по id то удаляем 1 элемент от index не оставляя дырки - splice
        this.#goods.forEach((good, index) => {
            // 
            if (good.id === idGoodDel) {;
                this.#goods.splice(index, 1);
                // и ставим flag
                flag = true
                }
            })
        // записываем отдельно чтоб кинуть в ретурн
        let newGoods = this.#goods;
        // если flag тру - сообщаем об этом
        if (flag === true) {
            return newGoods
        } else {
            return "Товар не найден"
        }
    }
    // Фильтруем товар по доступности
    filterAvailable () {
        const result = this.#goods.filter(good => good.available === true)
        return result;
    }
}
// Класс наследник от Good для хранение amount
class BasketGood extends Good {
    // передаем экземпляр класса Good 
    constructor(currentGood, amount) {
// значения свойств которого должны использоваться при вызове конструктора родительского класса super().
            super(currentGood);
            this.amount = amount;
            this.id = currentGood.id;
            this.name = currentGood.name;
            this.description = currentGood.description;
            this.sizes = currentGood.sizes;
            this.price = currentGood.price;
            this.available = currentGood.available
    }
}
// класс для хранения данных о корзине товаров
class Basket {
    constructor() {
        // goods массив объектов класса BasketGood для хранения данных о товарах в корзине
        this.goods = [];
    }
    // Геттеры для Корзины
    // общая стоимость товаров в корзине
    get totalAmount () {
        // преобразуем массив в сумму всех стоимостей товаров с учетом их количества
        let result = this.goods.reduce(function(totalAmount, good) {
            return totalAmount + good.amount * good.price;
            }, 0);

        return result
    }
    // общее количество товаров в корзине
    get totalSum () {
        // Тут проще
        let result = this.goods.reduce(function(totalSum, good) {
            return totalSum + good.amount
            }, 0);
        return result
    }
    // Теперь методы для корзины
    // Добавляем товар в корзину, если товар уже есть увеличиваем количество 
    add (good, amount) {
        // Если не число то Ерорим
        if (!(typeof amount === "number")) {
            throw new Error("Введите количество числом");
        }
        // Если минус, запускаем удаление
        if (amount <= 0) {this.remove(good, amount)
        }else{
        // Если все норм - ищем по id и увеличиваем количество товара 
        let flag = false
        for (let index = 0; index < this.goods.length; index++) {
            if (this.goods[index].id === good.id) {
                this.goods[index].amount = this.goods[index].amount + amount
                flag = true
                // сбрасываем как найдем, чтоб дальше цикл не гонять
                break
            }
        }
        // если не нашли (флаг не поменяли) то добавляем товар
        if (flag === false) {
            this.goods.push(new BasketGood(good, amount))
            } 
        }
    }
    // Удаляем товар из корзины (вначале уменьшаем количество его)
    remove (good, amount) {
        // Опять проверяем чтоб ввели числом
        if (!(typeof amount === "number")) {
            throw new Error("Введите количество числом");
        }
        //собираю массив значений id
            const idList = this.goods.map((currentGood) => currentGood.id)
            // Ищу id в массиве
            if (idList.includes(good.id) === true) {
                //запускаем цикл по goods 
                for (let index = 0; index < this.goods.length; index++) {
                    // По данному id уменьшаем товар в корзине. Вроде плюс так как из add сюда идет с минусом
                    if (this.goods[index].id === good.id) {
                        this.goods[index].amount = this.goods[index].amount + amount; 
                        }
                    // Если количество товара = 0 или удалять пытаются еще больше чем есть - удаляем этот товар вообще
                    if (this.goods[index].amount <= 0) {
                        this.goods.splice(index, 1);
                        }
                }
            } 
        }
    // Чистим корзину 
    clear() {
        this.goods.splice(0, this.goods.length)
    }
    // Удаление чего уже нет на складе из корзины по фильтру
    removeFilter() {
        this.goods = this.goods.filter(good => good.available === true)
        return this.goods;
    }
}
// Создаем объекты класса Good
const good1 = new Good (
    1,
    "Майка мужская белая",
    "хлопок 95 %, лайкра 5 %",
    ["L", "XL", "XXL"],
    1.89,
    true,
    );

const good2 = new Good (
    2,
    "Рубашка",
    "хлопок 100 %",
    ["XL", "XXL"],
    5.60,
    true
    );

const good3 = new Good (
    3,
    "Рубашка двойная",
    "хлопок 100 %",
    ["M", "L", "XL", "XXL"],
    4.40,
    true
    );

const good4 = new Good (
    4,
    "Пиджак красный",
    "хлопок 100 %",
    ["M", "L", "XL", "XXL"],
    21.55,
    false
    );

const good5 = new Good (
    5,
    "Джинсы серые",
    "хлопок 100 %",
    ["M", "L", "XL"],
    16.65,
    false
    );

const good6 = new Good (
    6,
    "Брюки зелёные",
    "хлопок 99 %",
    ["M", "L"],
    15.5,
    false
    );

const good7 = new Good (
    7,
    "Джинсы рваные",
    "хлопок 0 %",
    ["M", "L", "XL", "XXL"],
    25.5,
    false
    );

// Создаем массив товаров - пушим в массив
const goodsAll = []
    goodsAll.push(good1)
    goodsAll.push(good2)
    goodsAll.push(good3)
    goodsAll.push(good4)
    goodsAll.push(good5)
    goodsAll.push(good6)
    goodsAll.push(good7)

// Создаем фильтр
regexp  = /()/i
// Создаем новый каталог с товарами из массива. Назвачаем ему фильтр и параметры фильтрации
const newCatalog = new GoodsList(goodsAll, regexp, true, true)

// Назначаем товары в корзину (типо склад)
const BasketGood5 = new BasketGood(good5, 6)
const BasketGood2 = new BasketGood(good2, 80)
const BasketGood7 = new BasketGood(good7, 5)
const BasketGood4 = new BasketGood(good4, 3)
const BasketGood6 = new BasketGood(good6, 24)
const BasketGood1 = new BasketGood(good1, 2)

// console.log(BasketGood7);

// Создаем саму корзину
const Basketnew = new Basket();

// console.log(Basketnew);

///// Проверяем методы товаров

/// setAvailable - изменение доступности товара
// console.log(good7);
// good7.setAvailable();
// console.log(good7);

// get list()
// console.log(newCatalog.list);

// add()
// console.log(newCatalog.add(good7));

// remove()
// console.log(newCatalog.remove(1))
// console.log('///////////////////////////////////')
// console.log(newCatalog.remove(3))
// console.log('///////////////////////////////////')
// console.log(newCatalog.remove(10))


// filterAvailable()
// console.log('///////////////////////////////////');
// console.log(newCatalog.filterAvailable());

///// Проверяем методы корзины
// Добавляем товар в корзину
Basketnew.add(BasketGood2, 2)
Basketnew.add(BasketGood1, 3)
Basketnew.add(BasketGood4, 3)

Basketnew.add(BasketGood2, BasketGood2.amount)
Basketnew.add(BasketGood2, -2) // удаляет нормально даже если 0 остается
console.log(Basketnew)

// clear() Чистка корзины
// console.log('///////////////////////////////////');
// Basketnew.clear()
// console.log(Basketnew);

// removeUnavailable()  Удаляет из корзины товары которых нет
console.log('///////////////////////////////////');
Basketnew.removeFilter()
console.log(Basketnew);

// Вся стоимость товара
console.log("Стоимость общая = " +Basketnew.totalAmount);
// Все иколичество товара
console.log("Всего товара = " +Basketnew.totalSum);