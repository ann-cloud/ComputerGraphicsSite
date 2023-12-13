let dragStart = null;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
var isBuildClicked = false;
var isStartClicked = false;
var isStopClicked = false;
var parallelogram;


const canvas = document.getElementById('moving-img');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const unit = 25;
const maxUnit = 250;

// Calculate initial offsets to center the grid
offsetX = width / 2;
offsetY = height / 2;

function updateMaxOffset(scale) {
    const step = unit + (maxUnit - unit) * ((scale) / (100 - 1));
    const maxOffsetX = step * 100 * (scale); // max offset at scale 100
    const maxOffsetY = step * 100 * (scale); // max offset at scale 100
    return { maxOffsetX, maxOffsetY };
}

function calculateUnitScale(scale) {
    return unit + (maxUnit - unit) * (scale / 100);
}

function validateData()
{
    const aX = document.getElementById('xA-value').value;
    const aY = document.getElementById('yA-value').value;
    const bX = document.getElementById('xB-value').value;
    const bY = document.getElementById('yB-value').value;
    const cX = document.getElementById('xC-value').value;
    const cY = document.getElementById('yC-value').value;

    const a = document.getElementById('a-value').value;
    const b = document.getElementById('b-value').value;


    // Validating aX
    if (isNaN(aX))
    {
        alert("X coordinate of point A should be a number");
        return false;
    }
    if (aX.trim() == "")
    {
        alert("X coordinate of point A can't be an empty space");
        return false;
    }
    if (parseInt(aX) > 100 || parseInt(aX) < -100)
    {
        alert("X coordinate of point A should be in range [-100, 100]");
        return false;
    }

    // Validating aY
    if (isNaN(aY))
    {
        alert("Y coordinate of point A should be a number");
        return false;
    }
    if (aY.trim() == "")
    {
        alert("Y coordinate of point A can't be an empty space");
        return false;
    }
    if (parseInt(aY) > 100 || parseInt(aY) < -100)
    {
        alert("Y coordinate of point A should be in range [-100, 100]");
        return false;
    }
    
    // Validating bX
    if (isNaN(bX))
    {
        alert("X coordinate of point B should be a number");
        return false;
    }
    if (bX.trim() == "")
    {
        alert("X coordinate of point B can't be an empty space");
        return false;
    }
    if (parseInt(bX) > 100 || parseInt(bX) < -100)
    {
        alert("X coordinate of point B should be in range [-100, 100]");
        return false;
    }

    // Validating bY
    if (isNaN(bY))
    {
        alert("Y coordinate of point B should be a number");
        return false;
    }
    if (bY.trim() == "")
    {
        alert("Y coordinate of point B can't be an empty space");
        return false;
    }
    if (parseInt(bY) > 100 || parseInt(bY) < -100)
    {
        alert("Y coordinate of point B should be in range [-100, 100]");
        return false;
    }

    // Validating cX
    if (isNaN(cX))
    {
        alert("X coordinate of point C should be a number");
        return false;
    }
    if (cX.trim() == "")
    {
        alert("X coordinate of point C can't be an empty space");
        return false;
    }
    if (parseInt(cX) > 100 || parseInt(cX) < -100)
    {
        alert("X coordinate of point C should be in range [-100, 100]");
        return false;
    }
    
    // Validating cY
    if (isNaN(cY))
    {
        alert("Y coordinate of point C should be a number");
        return false;
    }
    if (cY.trim() == "")
    {
        alert("Y coordinate of point C can't be an empty space");
        return false;
    }
    if (parseInt(cY) > 100 || parseInt(cY) < -100)
    {
        alert("Y coordinate of point C should be in range [-100, 100]");
        return false;
    }

    // Validating a
    if (isNaN(a))
    {
        alert("a should be a number");
        return false;
    }
    if (a.trim() == "")
    {
        alert("a can't be an empty space");
        return false;
    }

    // Validating b
    if (isNaN(b))
    {
        alert("b should be a number");
        return false;
    }
    if (b.trim() == "")
    {
        alert("b can't be an empty space");
        return false;
    }

    const valuesArray = [aX.trim(), aY.trim(), bX.trim(), bY.trim(), cX.trim(), cY.trim()];

    const uniqueValues = new Set(valuesArray);
    
    const numberOfUniqueValues = uniqueValues.size;
    
    if (numberOfUniqueValues === 1) 
    {
        alert('The coordinates of parallelogram points must differ');
        return false;
    }

    return true;
}

function f(x) 
{
    let a = parseFloat(document.getElementById('a-value').value);
    let b = parseFloat(document.getElementById('b-value').value);
    return a * x + b;
}

function multiplyMatrices(matrixA, matrixB) {
    let result = [];

    // Initialize result matrix with zeros
    for (let i = 0; i < matrixB.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrixA.length; j++) {
        result[i][j] = 0;
      }
    }

    // Perform matrix multiplication
    for (let i = 0; i < matrixB.length; i++) {
      for (let j = 0; j < matrixA.length; j++) {
        for (let k = 0; k < matrixA[j].length; k++) {
          result[i][j] += matrixA[j][k] * matrixB[i][k];
        }
      }
    }  
    return result;
}

function drawCoordinates(scale) {
    const step = unit + (maxUnit - unit) * ((scale) / (100 - 1));
    const { maxOffsetX, maxOffsetY } = updateMaxOffset(scale);

    // Adjust offset to ensure canvas dragging is within limits
    offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX)); // Змініть межі обмеження
    offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY)); // Змініть межі обмеження

    ctx.clearRect(0, 0, width, height); // Clear the canvas
    ctx.fillStyle = "white";

    // Fill the entire canvas with white
    ctx.fillRect(0, 0, width, height);

    ctx.save(); // Save the current state
    ctx.translate(offsetX, offsetY); // Translate the canvas based on the offset

    // Draw the grid
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 1;

    for (let x = -maxOffsetX; x < width + maxOffsetX; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, -maxOffsetY);
        ctx.lineTo(x, height + maxOffsetY);
        ctx.stroke();
    }

    for (let y = -maxOffsetY; y < height + maxOffsetY; y += step) {
        ctx.beginPath();
        ctx.moveTo(-maxOffsetX, y);
        ctx.lineTo(width + maxOffsetX, y);
        ctx.stroke();
    }

    for (let x = -maxOffsetX; x < width + maxOffsetX; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, -maxOffsetY);
        ctx.lineTo(x, height + maxOffsetY);
        ctx.stroke();
    }
    
    // Draw the axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-maxOffsetX, 0);
    ctx.lineTo(width + maxOffsetX, 0);
    ctx.moveTo(0, -maxOffsetY);
    ctx.lineTo(0, height + maxOffsetY);
    ctx.stroke();

    // Draw the labels
    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let x = -maxOffsetX; x < width + maxOffsetX; x += step) {
        let valueX = Math.round(x / step);
        ctx.fillText(valueX.toString(), x, 10);
    }

    for (let y = -maxOffsetY; y < height + maxOffsetY; y += step) {
        let valueY = Math.round(y / step);
        ctx.fillText((-valueY).toString(), -10, y);
    }

    ctx.restore(); // Restore the state

    // Draw the axis labels
    ctx.font = 'bold 15px Arial';
    // Draw the axis labels
    ctx.font = 'bold 15px Arial';
    ctx.fillStyle = "black";
    const xAxisLabelX = width - 10;
    const yAxisLabelY = 10;

    // Ensure the labels are always visible on the screen
    ctx.fillText('X', xAxisLabelX, offsetY < 20 ? 20 : offsetY + 5);
    ctx.fillText('Y', offsetX < 20 ? 20 : offsetX, yAxisLabelY);
}

function drawLine(unitScale)
{
    // Draw y = ax + b
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(-100 * unitScale + offsetX, -f(-100) * unitScale + offsetY); // Move to the starting point (x=0)
    ctx.lineTo(100 * unitScale + offsetX, -f(100) * unitScale + offsetY); // Draw to the end of the canvas
    ctx.stroke();

    // Додавання підписів до точок
    const labelOffset = 30;
    const a = parseFloat(document.getElementById('a-value').value);
    const b = parseFloat(document.getElementById('b-value').value);

    ctx.fillStyle = 'magenta';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`y = ${a}x + ${b}`, -b / (a == 0 ? -b : a) * unitScale + offsetX + labelOffset, -f(-b / (a == 0 ? -b : a)) * unitScale + offsetY + labelOffset);
}

function drawParallelogram(pointA, pointB, pointC, unitScale) {
    // Знайдемо четверту точку (D)
    // Розраховуємо вектор AB
    const vectorAB = { x: pointB.x - pointA.x, y: pointB.y - pointA.y };

    // Віднімаємо вектор AB від точки C, щоб отримати точку D
    const pointD = {
        x: pointC.x - vectorAB.x,
        y: pointC.y - vectorAB.y
    };

    parallelogram = [pointA, pointB, pointC, pointD];
    
    // Перерахуємо координати з урахуванням масштабу
    const scaledA = { x: pointA.x * unitScale, y: pointA.y * unitScale };
    const scaledB = { x: pointB.x * unitScale, y: pointB.y * unitScale };
    const scaledC = { x: pointC.x * unitScale, y: pointC.y * unitScale };
    const scaledD = { x: pointD.x * unitScale, y: pointD.y * unitScale };

    // Почнемо малювання
    ctx.beginPath();
    ctx.moveTo(scaledA.x + offsetX, -scaledA.y + offsetY);
    ctx.lineTo(scaledB.x + offsetX, -scaledB.y + offsetY);
    ctx.lineTo(scaledC.x + offsetX, -scaledC.y + offsetY);
    ctx.lineTo(scaledD.x + offsetX, -scaledD.y + offsetY);
    ctx.closePath();

    // Стилізація ліній паралелограма
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Заповнення паралелограма кольором
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.fill();

    // Додавання підписів до точок
    const labelOffset = 5;
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', scaledA.x + offsetX, -scaledA.y + offsetY - labelOffset);
    ctx.fillText('B', scaledB.x + offsetX, -scaledB.y + offsetY - labelOffset);
    ctx.fillText('C', scaledC.x + offsetX, -scaledC.y + offsetY - labelOffset);
    ctx.fillText('D', scaledD.x + offsetX, -scaledD.y + offsetY - labelOffset);
}


function mirrorParallelogram(p, a, b) {
    const movementData = [];
    const theta = Math.atan(a);
    const translationMatrix = [
        [1, 0, 0],
        [0, 1, -b],
        [0, 0, 1]
    ];
    const translationMatrixBack = [
        [1, 0, 0],
        [0, 1, b],
        [0, 0, 1]
    ];
    const mirrorToXMatrix = [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, 1]
    ];
    const rotationMatrix = [
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1]
    ];
    const inverseRotationMatrix = [
        [Math.cos(theta), Math.sin(theta), 0],
        [-Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1]
    ];
    
    let step1, step2, step3, step4, step5;

    for (let i = 0; i < p.length; ++i)
    {
        step1 = multiplyMatrices(translationMatrix, [[p[i].x, p[i].y, 1]]);
        step2 = multiplyMatrices(inverseRotationMatrix, step1);
        step3 = multiplyMatrices(mirrorToXMatrix, step2);
        step4 = multiplyMatrices(rotationMatrix, step3);
        step5 = multiplyMatrices(translationMatrixBack, step4);

        movementData.push(step5);
    }
    
    return movementData;
}
  

canvas.addEventListener('mousedown', function(event) {
    dragStart = {
        x: event.offsetX - offsetX,
        y: event.offsetY - offsetY
    };
});

canvas.addEventListener('mousemove', function(event) {
    if (dragStart) {
        offsetX = event.offsetX - dragStart.x;
        offsetY = event.offsetY - dragStart.y;
        drawCoordinates(scale);
        const unitScale = calculateUnitScale(scale);
        drawLine(unitScale);
        
        if (validateData())
        {
            drawParallelogram(parallelogram[0], parallelogram[1], parallelogram[2], unitScale);
        }
    }
});

canvas.addEventListener('mouseup', function() {
    dragStart = null;
});

canvas.addEventListener('mouseleave', function() {
    dragStart = null;
});

// Initialize the grid
drawCoordinates(scale);

function buildParallelogram() {
    isBuildClicked = true;
    if (validateData())
    {
        const unitScale = calculateUnitScale(scale);
        drawCoordinates(scale);
        drawLine(unitScale);
        drawParallelogram({x: parseFloat(document.getElementById('xA-value').value),
                        y: parseFloat(document.getElementById('yA-value').value)}, 
                        {x: parseFloat(document.getElementById('xB-value').value), 
                        y: parseFloat(document.getElementById('yB-value').value)}, 
                        {x: parseFloat(document.getElementById('xC-value').value), 
                        y: parseFloat(document.getElementById('yC-value').value)},
                        unitScale);                  
    }
    document.getElementById('startMovement').onclick = buildMirroredParallelogramBySteps;
}

function buildMirroredParallelogramBySteps()
{
    isStartClicked = true;
    isStopClicked = false;
    const unitScale = calculateUnitScale(scale);
    
    function drawWithDelay() {    
        function drawNext() {
            if (!isStopClicked) {
                drawCoordinates(scale);
                drawLine(unitScale);
                buildMirroredParallelogramFinal();
    
                setTimeout(drawNext, 1000);
            }
        }
    
        drawNext();
    }
    drawWithDelay();
}


function buildMirroredParallelogramFinal()
{
    if (validateData() && isBuildClicked)
    {
        const a = parseFloat(document.getElementById('a-value').value);
        const b = parseFloat(document.getElementById('b-value').value);
        const mirroredParallelogram = mirrorParallelogram(parallelogram, a, b);
        
        const unitScale = calculateUnitScale(scale);

        drawParallelogram({ x: mirroredParallelogram[0][0][0], y: mirroredParallelogram[0][0][1] }, 
            { x: mirroredParallelogram[1][0][0], y: mirroredParallelogram[1][0][1] }, 
            { x: mirroredParallelogram[2][0][0], y: mirroredParallelogram[2][0][1] }, 
            unitScale);

        parallelogram = [
            { x: mirroredParallelogram[0][0][0], y: mirroredParallelogram[0][0][1] },
            { x: mirroredParallelogram[1][0][0], y: mirroredParallelogram[1][0][1] },
            { x: mirroredParallelogram[2][0][0], y: mirroredParallelogram[2][0][1] },
            { x: mirroredParallelogram[3][0][0], y: mirroredParallelogram[3][0][1] }
        ];
    }
}

document.getElementById('xA-value').addEventListener("input", function() {
    isStartClicked = false;
});
document.getElementById('yA-value').addEventListener("input", function() {
    isStartClicked = false;
});
document.getElementById('xB-value').addEventListener("input", function() {
    isStartClicked = false;
});
document.getElementById('yB-value').addEventListener("input", function() {
    isStartClicked = false;
});
document.getElementById('xC-value').addEventListener("input", function() {
    isStartClicked = false;
});
document.getElementById('yC-value').addEventListener("input", function() {
    isStartClicked = false;
});
document.getElementById('a-value').addEventListener("input", function() {
    isStartClicked = false;
});
document.getElementById('b-value').addEventListener("input", function() {
    isStartClicked = false;
});

document.getElementById("scaleImage").addEventListener('input', function() {
    scale = parseFloat(this.value);
    drawCoordinates(scale);
    const unitScale = calculateUnitScale(scale);
    drawLine(unitScale);
    
    if (validateData())
    {
        drawParallelogram(parallelogram[0], parallelogram[1], parallelogram[2], unitScale);
    }
});

function stopSimulation()
{
    isStopClicked = true;
}