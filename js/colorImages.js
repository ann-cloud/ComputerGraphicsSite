var imageLoader = document.getElementById('imageUpload');
var canvasimgBefore = document.getElementById('img-before');
var ctxImgBefore = canvasimgBefore.getContext('2d', { willReadFrequently: true });
// var overlayCanvas1 = document.getElementById('overlay1');
// var ctxOverlay1 = overlayCanvas1.getContext('2d', { willReadFrequently: true });
var overlayCanvas2 = document.getElementById('overlay2');
var ctxOverlay2 = overlayCanvas2.getContext('2d', { willReadFrequently: true });
var overlayCanvas5 = document.getElementById('overlay5');
var ctxOverlay5 = overlayCanvas5.getContext('2d', { willReadFrequently: true });
var overlayCanvas6 = document.getElementById('overlay6');
var ctxOverlay6 = overlayCanvas6.getContext('2d', { willReadFrequently: true });

var canvasimgAfter = document.getElementById('img-after');
var ctxImgAfter = canvasimgAfter.getContext('2d', { willReadFrequently: true });

var canvasimgHSL = document.getElementById('img-hsl');
var ctxImgHSL = canvasimgHSL.getContext('2d', { willReadFrequently: true });
var canvasimgCMYK = document.getElementById('img-cmyk');
var ctxImgCMYK = canvasimgCMYK.getContext('2d', { willReadFrequently: true });

var saturationSlider = document.getElementById('saturation');
var lightnessSlider = document.getElementById('lightness');

let selectedWidth = canvasimgAfter.width;
let selectedHeight = canvasimgAfter.height;

let width = canvasimgAfter.width;
let height = canvasimgAfter.height;

//document.getElementById("overlay3").style.pointerEvents = 'none';

function displayPixelColor(x, y, ctx) {
    // Округлення координат до найближчого цілого числа
    x = Math.round(x);
    y = Math.round(y);
  
    // Отримання даних про піксель
    var pixel = ctx.getImageData(x, y, 1, 1).data;
    // Встановлення кольору для елемента color-display
    var colorDisplay = document.getElementById('color-display');
    colorDisplay.style.backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    var red = pixel[0];     
    var green = pixel[1];
    var blue = pixel[2]; 
    var hslColor = rgbToHsl(red, green, blue);
    document.getElementById("h-value").innerHTML = Math.round(hslColor[0]);
    document.getElementById("s-value").innerHTML = Math.round(hslColor[1]);
    document.getElementById("l-value").innerHTML = Math.round(hslColor[2]);

    var cmykColor = rgbToCmyk(red, green, blue);
    document.getElementById("c-value").innerHTML = Math.round(cmykColor[0]);
    document.getElementById("m-value").innerHTML = Math.round(cmykColor[1]);
    document.getElementById("y-value").innerHTML = Math.round(cmykColor[2]);
    document.getElementById("k-value").innerHTML = Math.round(cmykColor[3]);
}
  
function rgbToHsl(r, g, b) {
     //r = (r + 180) < 360 ? (r + 180) : r - 180;
    // g = (g + 180) < 360 ? (g + 180) : g - 180;
    // b = (b + 180) < 360 ? (b + 180) : b - 180;
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d; break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h = h < 0 ? h + 6 : h;
    }

    return [h * 60, s * 100, l * 100]; // Конвертація hue в градуси та saturation/lightness в проценти
}



function hslToRgb(h, s, l) {
    
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

function rgbToCmyk(r, g, b) {
    // Визначення компоненту K
    var k = 1 - (Math.max(r, g, b) / 255);

    // Визначення компонентів CMY
    var c = (1 - r / 255 - k) / (1 - k);
    var m = (1 - g / 255 - k) / (1 - k);
    var y = (1 - b / 255 - k) / (1 - k);

    if (k === 1)
    {
        c = 0;
        m = 0;
        y = 0;
    }

    // Конвертація CMYK від 0-1 до 0-100
    c = Math.round(c * 100);
    m = Math.round(m * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);

    return [c, m, y, k];
}

function cmykToRgb(c, m, y, k)
{
    var r = 255 * (1 - c / 100) * (1 - k / 100);
    var g = 255 * (1 - m / 100) * (1 - k / 100);
    var b = 255 * (1 - y / 100) * (1 - k / 100);

    return [r, g, b];
}

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var img = new Image();
      img.onload = function() {
        lightnessSlider.value = 0;
        saturationSlider.value = 0;
        // Очищення канвасу перед малюванням нового зображення
        ctxImgBefore.clearRect(0, 0, canvasimgBefore.width, canvasimgBefore.height);
        ctxImgAfter.clearRect(0, 0, canvasimgAfter.width, canvasimgAfter.height);

  
        // Визначення масштабу для збереження пропорцій зображення
        var scaleWidth = canvasimgBefore.width / img.width;
        var scaleHeight = canvasimgBefore.height / img.height;
        var scale = Math.min(scaleWidth, scaleHeight);
  
        // Обчислення нових розмірів зображення
        var imgWidthScaled = img.width * scale;
        var imgHeightScaled = img.height * scale;
  
        // Обчислення позиції для центрування зображення на канвасі
        var dx = (canvasimgBefore.width - imgWidthScaled) / 2;
        var dy = (canvasimgBefore.height - imgHeightScaled) / 2;
  
        // Малювання зображення на канвасі з центруванням
        ctxImgBefore.drawImage(img, dx, dy, imgWidthScaled, imgHeightScaled);
        console.log(dx, dy, imgWidthScaled, imgHeightScaled)
        var convertedCanvasHSL = convertImageToModel(img, "hsl");
        ctxImgHSL.drawImage(convertedCanvasHSL, dx, dy, imgWidthScaled, imgHeightScaled);
        var convertedCanvasCMYK = convertImageToModel(img, "cmyk");
        ctxImgCMYK.drawImage(convertedCanvasCMYK, dx, dy, imgWidthScaled, imgHeightScaled);
        ctxImgAfter.drawImage(img, dx, dy, imgWidthScaled, imgHeightScaled);

        selectedPixelsBefore = ctxImgBefore.getImageData(0, 0, selectedWidth, selectedHeight).data;
        selectedPixelsAfter = ctxImgAfter.getImageData(0, 0, selectedWidth, selectedHeight).data;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
}
function convertImageToModel(image, model) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    // Задаємо розміри канвасу такі ж, як у зображення
    canvas.width = image.width;
    canvas.height = image.height;

    // Малюємо зображення на канвасі
    ctx.drawImage(image, 0, 0);

    // Отримуємо дані пікселів зображення
    var imageData = ctx.getImageData(0, 0, image.width, image.height);
    var data = imageData.data;

    // Проходимося по кожному пікселю
    for (var i = 0; i < data.length; i += 4) {
        var red = data[i];     
        var green = data[i+1];
        var blue = data[i+2]; 
        if(model == "hsl") {
            var hslColor = rgbToHsl(red, green, blue);
            var rgbColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2]);
        } else if (model == "cmyk") {
            var cmykColor = rgbToCmyk(red, green, blue);
            rgbColor = cmykToRgb(cmykColor[0], cmykColor[1], cmykColor[2], cmykColor[3]);
        }

        data[i] = rgbColor[0];
        data[i+1] = rgbColor[1];
        data[i+2] = rgbColor[2];
    }

    // Повертаємо змінені дані пікселів назад на канвас
    ctx.putImageData(imageData, 0, 0);

    // Повертаємо канвас, а не DataURL
    return canvas;
}

function drawCircleOnOverlay(x, y, overlayCanvas, ctx) {
    // Отримання даних про піксель з оригінального канвасу
    var pixelData = ctx.getImageData(x, y, 1, 1).data;
  
    // Визначення контрастного кольору для обведення
    var contrastColor = (pixelData[0] * 0.299 + pixelData[1] * 0.587 + pixelData[2] * 0.114) > 186 ? 'black' : 'white';
    var ctxOverlay = overlayCanvas.getContext('2d', { willReadFrequently: true });
    // Очищення другого канвасу
    ctxOverlay.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  
    // Встановлення кольору і стилю лінії
    ctxOverlay.strokeStyle = contrastColor;
    ctxOverlay.lineWidth = 1;
  
    // Малювання кружечка на другому канвасі
    ctxOverlay.beginPath();
    ctxOverlay.arc(x, y, 5, 0, Math.PI * 2, false);
    ctxOverlay.stroke();
}

function changeSaturation(pixelArray, imgWidth, fragWidth, fragHeight, value) {
    startX = Math.round(startX);
    startY = Math.round(startY);

    for (let y = startY; y < startY + fragHeight; y++) {
        for (let x = startX; x < startX + fragWidth; x++) {
            let i = (y * imgWidth + x) * 4;
            let red = pixelArray[i];
            let green = pixelArray[i + 1];
            let blue = pixelArray[i + 2];
        
            if (red > 150 && green > 150 && blue < 100) {
                var hslColor = rgbToHsl(red, green, blue);
                var rgbColor = hslToRgb(hslColor[0], hslColor[1] + value, hslColor[2]);

                pixelArray[i] = rgbColor[0];
                pixelArray[i + 1] = rgbColor[1];
                pixelArray[i + 2] = rgbColor[2];
            }
        }
    }
}


function changeLightness(pixelArray, imgWidth, fragWidth, fragHeight, value) {
    startX = Math.round(startX);
    startY = Math.round(startY);

    for (let y = startY; y < startY + fragHeight; y++) {
        for (let x = startX; x < startX + fragWidth; x++) {
            let i = (y * imgWidth + x) * 4;
            let red = pixelArray[i];
            let green = pixelArray[i + 1];
            let blue = pixelArray[i + 2];
        
            if (red > 150 && green > 150 && blue < 100) {
                var hslColor = rgbToHsl(red, green, blue);
                var rgbColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2] + value);

                pixelArray[i] = rgbColor[0];
                pixelArray[i + 1] = rgbColor[1];
                pixelArray[i + 2] = rgbColor[2];
            }
        }
    }
}

  
// overlayCanvas1.addEventListener('mousemove', function(event) {
//     // Визначення позиції курсору відносно канвасу
//     var rect = overlayCanvas1.getBoundingClientRect();
//     var x = event.clientX - rect.left;
//     var y = event.clientY - rect.top;
  
//     drawCircleOnOverlay(Math.round(x), Math.round(y), overlayCanvas1, ctxImgBefore);
//     displayPixelColor(Math.round(x), Math.round(y), ctxImgBefore);
// });

overlayCanvas2.addEventListener('mousemove', function(event) {
    // Визначення позиції курсору відносно канвасу
    var rect = overlayCanvas2.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  
    drawCircleOnOverlay(Math.round(x), Math.round(y), overlayCanvas2, ctxImgAfter);
    displayPixelColor(Math.round(x), Math.round(y),ctxImgAfter);
});

overlayCanvas5.addEventListener('mousemove', function(event) {
    // Визначення позиції курсору відносно канвасу
    var rect = overlayCanvas5.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  
    drawCircleOnOverlay(Math.round(x), Math.round(y), overlayCanvas5, ctxImgHSL);
    displayPixelColor(Math.round(x), Math.round(y),ctxImgHSL);
});

overlayCanvas6.addEventListener('mousemove', function(event) {
    // Визначення позиції курсору відносно канвасу
    var rect = overlayCanvas6.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  
    drawCircleOnOverlay(Math.round(x), Math.round(y), overlayCanvas6, ctxImgCMYK);
    displayPixelColor(Math.round(x), Math.round(y),ctxImgCMYK);
});

// overlayCanvas1.addEventListener('mousedown', function(event) {
//     document.getElementById("overlay3").style.pointerEvents = 'auto';
// });

imageLoader.addEventListener('change', handleImage, false);

saturationSlider.addEventListener('input', function() {
    var saturationValue = parseFloat(saturationSlider.value);
    var lightnessValue = parseFloat(lightnessSlider.value);

    var imageData = ctxImgBefore.getImageData(0, 0, width, height);
    changeSaturation(imageData.data, width, selectedWidth, selectedHeight, saturationValue);
    ctxImgAfter.putImageData(imageData, 0, 0);
    
    imageData = ctxImgAfter.getImageData(0, 0, width, height);
    changeLightness(imageData.data, width, selectedWidth, selectedHeight, lightnessValue);
    ctxImgAfter.putImageData(imageData, 0, 0);
});

lightnessSlider.addEventListener('input', function() {
    var saturationValue = parseFloat(saturationSlider.value);
    var lightnessValue = parseFloat(lightnessSlider.value);

    var imageData = ctxImgBefore.getImageData(0, 0, width, height);
    changeLightness(imageData.data, width, selectedWidth, selectedHeight, lightnessValue);
    ctxImgAfter.putImageData(imageData, 0, 0);
    
    imageData = ctxImgAfter.getImageData(0, 0, width, height);
    changeSaturation(imageData.data, width, selectedWidth, selectedHeight, saturationValue);
    ctxImgAfter.putImageData(imageData, 0, 0);
});





