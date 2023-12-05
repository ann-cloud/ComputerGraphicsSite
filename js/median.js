// Отримання посилань на HTML-елементи
const colorThemesSelect = document.getElementById("colorThemes");
const fileUploadWrapper = document.getElementById("fileUploadWrapper");
let quantizedColors;
var palette;

// Додавання події для вибору теми кольорів
colorThemesSelect.addEventListener("change", function () {
    if (colorThemesSelect.value === "Picture") {
        fileUploadWrapper.style.display = "block"; // Показати обгортку для завантаження зображення
    } else {
        fileUploadWrapper.style.display = "none";  // Сховати обгортку для завантаження зображення
    }
});

// Додавання події для вибору зображення для аналізу
document.getElementById('imageUpload').addEventListener('change', function() {
    const image = new Image();
    image.src = '/img/' + document.getElementById('imageUpload').files[0].name;

    image.onload = function() {
        quantizedColors = [];

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const imgDataArray = [];

        // Отримання даних кольору для кожного пікселя
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const pixelIndex = (y * imageData.width + x) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                imgDataArray.push([r, g, b, x, y]);
            }
        }
        // Розподіл пікселів у кілька бакетів
        splitIntoBuckets(imageData, imgDataArray, 2);
        palette = quantizedColors;
    };
});

// Функція для квантування середнім значенням (median-cut)
function medianCutQuantize(imageData, imgDataArray) {  
    const rSum = imgDataArray.reduce((sum, data) => sum + data[0], 0);
    const gSum = imgDataArray.reduce((sum, data) => sum + data[1], 0);
    const bSum = imgDataArray.reduce((sum, data) => sum + data[2], 0);

    // Обчислення середнього кольору
    const rAverage = Math.round(rSum / imgDataArray.length);
    const gAverage = Math.round(gSum / imgDataArray.length);
    const bAverage = Math.round(bSum / imgDataArray.length);

    quantizedColors.push([rAverage, gAverage, bAverage]);
}

// Функція для рекурсивного розподілу пікселів у бакети
function splitIntoBuckets(imageData, imgDataArray, depth) {
    if (imgDataArray.length === 0) {
        return;
    }

    if (depth === 0) {
        medianCutQuantize(imageData, imgDataArray);
        return;
    }

    // Знаходження діапазону для розподілу
    const rRange = Math.max(...imgDataArray.map(data => data[0])) - Math.min(...imgDataArray.map(data => data[0]));
    const gRange = Math.max(...imgDataArray.map(data => data[1])) - Math.min(...imgDataArray.map(data => data[1]));
    const bRange = Math.max(...imgDataArray.map(data => data[2])) - Math.min(...imgDataArray.map(data => data[2]));

    let spaceWithHighestRange = 0;

    if (gRange >= rRange && gRange >= bRange) {
        spaceWithHighestRange = 1;
    } else if (bRange >= rRange && bRange >= gRange) {
        spaceWithHighestRange = 2;
    }

    imgDataArray.sort((a, b) => a[spaceWithHighestRange] - b[spaceWithHighestRange]);
    const medianIndex = Math.floor((imgDataArray.length + 1) / 2);

    // Рекурсивний розподіл пікселів
    splitIntoBuckets(imageData, imgDataArray.slice(0, medianIndex), depth - 1);
    splitIntoBuckets(imageData, imgDataArray.slice(medianIndex), depth - 1);
}
