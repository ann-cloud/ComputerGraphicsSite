let dragStart = null;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
var isBuildClicked = false;
var isStartClicked = false;
var isStopClicked = false;
var parallelogram;
var tempParallelogram;

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

    if (isNaN(aX) || aX.trim() == "")
    {
        alert("Enter a valid x coordinate of point A");
        return false;
    }
    if (isNaN(aY) || aY.trim() == "")
    {
        alert("Enter a valid y coordinate of point A");
        return false;
    }
    if (isNaN(bX) || bX.trim() == "")
    {
        alert("Enter a valid x coordinate of point B");
        return false;
    }
    if (isNaN(bY) || bY.trim() == "")
    {
        alert("Enter a valid y coordinate of point B");
        return false;
    }
    if (isNaN(cX) || cX.trim() == "")
    {
        alert("Enter a valid x coordinate of point C");
        return false;
    }
    if (isNaN(cY) || cY.trim() == "")
    {
        alert("Enter a valid y coordinate of point C");
        return false;
    }
    if (isNaN(a) || a.trim() == "")
    {
        alert("Enter a valid a value");
        return false;
    }
    if (isNaN(b) || b.trim() == "")
    {
        alert("Enter a valid b value");
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
        for (let k = 0; k < matrixA[i].length; k++) {
          result[i][j] += matrixA[j][k] * matrixB[i][k];
        }
      }
    }  
    return result;
}

function addMatrices(matrixA, matrixB) {
    // Initialize the result matrix with zeros
    const result = Array(matrixA.length).fill(Array(matrixA[0].length).fill(0));
  
    // Perform matrix addition
    for (let i = 0; i < matrixA.length; i++) {
      for (let j = 0; j < matrixA[i].length; j++) {
        result[i][j] = matrixA[i][j] + matrixB[i][j];
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
    const step1Movement = [];
    const step2Movement = [];
    const step3Movement = [];
    const step4Movement = [];
    const step5Movement = [];
    const theta = Math.atan(a);
    const translationMatrix = [[0, -b / 50]];
    const translationMatrixBack = [[0, b / 50]];
    const mirrorToXMatrix = [
        [1, 0],
        [0, -1]
    ];
    const rotationMatrix = [
        [Math.cos(theta / 50), -Math.sin(theta / 50)],
        [Math.sin(theta / 50), Math.cos(theta / 50)]
    ];
    const inverseRotationMatrix = [
        [Math.cos(theta / 50), Math.sin(theta / 50)],
        [-Math.sin(theta / 50), Math.cos(theta / 50)]
    ];
    
    let step1, step2, step3, step4, step5;

    for (let i = 0; i < p.length; ++i)
    {
        step1 = [[p[i].x, p[i].y]];
        for (let j = 0; j < 50; ++j)
        {
            step1 = addMatrices(step1, translationMatrix);
            step1Movement.push({x: step1[0][0], y: step1[0][1]});
        }
        
        step2 = step1;

        for (let j = 0; j < 50; ++j)
        {
            step2 = multiplyMatrices(inverseRotationMatrix, step2);
            step2Movement.push({x: step2[0][0], y: step2[0][1]});
        }

        step3 = step2;

        step3 = multiplyMatrices(mirrorToXMatrix, step3);
        step3Movement.push({x: step3[0][0], y: step3[0][1]});

        step4 = step3;

        for (let j = 0; j < 50; ++j)
        {
            step4 = multiplyMatrices(rotationMatrix, step4);
            step4Movement.push({x: step4[0][0], y: step4[0][1]});
        }

        step5 = step4;
        
        for (let j = 0; j < 50; ++j)
        {
            step5 = addMatrices(step5, translationMatrixBack);
            step5Movement.push({x: step5[0][0], y: step5[0][1]});
        }
    }
    movementData.push(step1Movement);
    movementData.push(step2Movement);
    movementData.push(step3Movement);
    movementData.push(step4Movement);
    movementData.push(step5Movement);
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
        if (isBuildClicked && validateData())
        {
            buildParallelogram(); 
        }
        if (isStartClicked && validateData() && !isStopClicked)
        {
            buildMirroredParallelogramFinal();
        }
    }
});

canvas.addEventListener('mouseup', function(event) {
    dragStart = null;
});

canvas.addEventListener('mouseleave', function(event) {
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

function drawMovementStep(mirroredParallelogram, stepIndex)
{
    let currentParallelogramIndex = 0;

    function drawNextParallelogram() {
        if (currentParallelogramIndex < 50) {
            if (isStopClicked)
                return;
            const i = currentParallelogramIndex;
            const unitScale = calculateUnitScale(scale);
            drawCoordinates(scale);
            drawLine(unitScale);
            buildParallelogram();
            let scaledA, scaledB, scaledC, scaledD;

            if (stepIndex != 2)
            {
                scaledA = { x: mirroredParallelogram[stepIndex][i].x * unitScale, y: mirroredParallelogram[stepIndex][i].y * unitScale };
                scaledB = { x: mirroredParallelogram[stepIndex][i + 50].x * unitScale, y: mirroredParallelogram[stepIndex][i + 50].y * unitScale };
                scaledC = { x: mirroredParallelogram[stepIndex][i + 100].x * unitScale, y: mirroredParallelogram[stepIndex][i + 100].y * unitScale };
                scaledD = { x: mirroredParallelogram[stepIndex][i + 150].x * unitScale, y: mirroredParallelogram[stepIndex][i + 150].y * unitScale };
            }
            else
            {
                scaledA = { x: mirroredParallelogram[stepIndex][0].x * unitScale, y: mirroredParallelogram[stepIndex][0].y * unitScale };
                scaledB = { x: mirroredParallelogram[stepIndex][1].x * unitScale, y: mirroredParallelogram[stepIndex][1].y * unitScale };
                scaledC = { x: mirroredParallelogram[stepIndex][2].x * unitScale, y: mirroredParallelogram[stepIndex][2].y * unitScale };
                scaledD = { x: mirroredParallelogram[stepIndex][3].x * unitScale, y: mirroredParallelogram[stepIndex][3].y * unitScale };
            }

            // tempParallelogram = [scaledA, scaledB, scaledC, scaledD];
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

            // Increment the index for the next parallelogram
            currentParallelogramIndex++;
            requestAnimationFrame(drawNextParallelogram);
        }
    }
    drawNextParallelogram();
}

function buildMirroredParallelogramBySteps()
{
    isStartClicked = true;
    isStopClicked = false;
    if(!isBuildClicked) {
        alert("First you need to build paralelogram and line");
    } else {
        if (validateData() && isBuildClicked)
        {
            const a = parseFloat(document.getElementById('a-value').value);
            const b = parseFloat(document.getElementById('b-value').value);
            const mirroredParallelogram = mirrorParallelogram(parallelogram, a, b);
            
            function drawWithDelay(index) {
                setTimeout(function () {
                    drawMovementStep(mirroredParallelogram, index);
                }, index * 2000); 
            }

            for (let i = 0; i < 5; ++i)
            {
                drawWithDelay(i);
            }
        }
        document.getElementById('startMovement').onclick = null;
    }
}

function buildMirroredParallelogramFinal()
{
    isStartClicked = true;
    isStopClicked = false;
    if (validateData() && isBuildClicked)
    {
        const a = parseFloat(document.getElementById('a-value').value);
        const b = parseFloat(document.getElementById('b-value').value);
        const mirroredParallelogram = mirrorParallelogram(parallelogram, a, b);
        
        const unitScale = calculateUnitScale(scale);
        let scaledA, scaledB, scaledC, scaledD;

        scaledA = { x: mirroredParallelogram[4][49].x * unitScale, y: mirroredParallelogram[4][49].y * unitScale };
        scaledB = { x: mirroredParallelogram[4][99].x * unitScale, y: mirroredParallelogram[4][99].y * unitScale };
        scaledC = { x: mirroredParallelogram[4][149].x * unitScale, y: mirroredParallelogram[4][149].y * unitScale };
        scaledD = { x: mirroredParallelogram[4][199].x * unitScale, y: mirroredParallelogram[4][199].y * unitScale };

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
    document.getElementById('startMovement').onclick = null;
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
    if (isBuildClicked && validateData())
    {
        buildParallelogram(); 
    }
    if (isStartClicked && validateData() && !isStopClicked)
    {
        buildMirroredParallelogramFinal();
    }
});

function stopSimulation()
{
    if(!isBuildClicked) {
        alert("First you need to build paralelogram and line");
    } else {
        isStopClicked = true;
    }
}