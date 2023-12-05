let isSelecting = false;  // Прапорець, що вказує на активність виділення
let isPainted = false;   // Прапорець, що вказує, чи було вже намальовано на канвасі
let startX = 0;          // Початкова координата X при виділенні
let startY = 0;          // Початкова координата Y при виділенні
let endX = 0;            // Кінцева координата X при виділенні
let endY = 0;            // Кінцева координата Y при виділенні

const canvas3 = document.getElementById('overlay3');  // Отримання посилання на елемент канвасу 3
const ctx3 = canvas3.getContext('2d', { willReadFrequently: true });  // Отримання контексту для канвасу 3
const canvas4 = document.getElementById('overlay4');  // Отримання посилання на елемент канвасу 4
const ctx4 = canvas4.getContext('2d', { willReadFrequently: true });  // Отримання контексту для канвасу 4

canvas3.addEventListener('mousedown', function(e) {
    const rect = canvas3.getBoundingClientRect();
    startX = e.clientX - rect.left;  // Визначення початкової координати X при кліку мишею
    startY = e.clientY - rect.top;   // Визначення початкової координати Y при кліку мишею
    isSelecting = true;  // Встановлення прапорця активного виділення
    isPainted = false;   // Встановлення прапорця "не намальовано"
});

canvas3.addEventListener('mouseup', function(e) {
    const rect = canvas3.getBoundingClientRect();
    endX = e.clientX - rect.left;   // Визначення кінцевої координати X при відпусканні кнопки мишею
    endY = e.clientY - rect.top;    // Визначення кінцевої координати Y при відпусканні кнопки мишею
    isSelecting = false;  // Зняття активного виділення

    drawSelection();  // Виклик функції для малювання виділеної області

    // Обчислення ширини та висоти виділеної області
    if (Math.abs(endX - startX)) {
        selectedWidth = Math.abs(endX - startX);
    } else {
        selectedWidth = canvasimgAfter.width;
        startX = 0;
    }
    if (Math.abs(endY - startY)) {
        selectedHeight = Math.abs(endY - startY);
    } else {
        selectedHeight = canvasimgAfter.height;
        startY = 0;
    }
});

canvas3.addEventListener('mousemove', function(e) {
    if (isSelecting) {
        const rect = canvas3.getBoundingClientRect();
        endX = e.clientX - rect.left;   // Визначення кінцевої координати X при перетягуванні мишею
        endY = e.clientY - rect.top;    // Визначення кінцевої координати Y при перетягуванні мишею

        drawSelection();  // Виклик функції для малювання виділеної області
        isPainted = true;  // Встановлення прапорця "намальовано"
    } else {
        // Визначення позиції курсору відносно канвасу
        if (!isPainted) {
            var rect = canvas3.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
        
            drawCircleOnOverlay(Math.round(x), Math.round(y), canvas3, ctxImgBefore);
            displayPixelColor(Math.round(x), Math.round(y), ctxImgBefore);
        }
    }
});

function drawSelection() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);  // Очищення канвасу 3
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);  // Очищення канвасу 4

    const width = endX - startX;  // Обчислення ширини виділеної області
    const height = endY - startY;  // Обчислення висоти виділеної області

    ctx3.strokeStyle = 'red';  // Встановлення колір обводки
    ctx3.lineWidth = 2;       // Встановлення ширини лінії обводки
    ctx3.strokeRect(startX, startY, width, height);  // Малювання обмежуючого прямокутника на канвасі 3

    ctx4.strokeStyle = 'red';  // Встановлення колір обводки
    ctx4.lineWidth = 2;       // Встановлення ширини лінії обводки
    ctx4.strokeRect(startX, startY, width, height);  // Малювання обмежуючого прямокутника на канвасі 4
}
