// Отримання посилань на HTML-елементи та ініціалізація змінних
const canvas = document.getElementById('displayVicsec');
const context = canvas.getContext('2d');
const fillSpeed = 5; // Швидкість заповнення квадрата
var rect; // Змінна для області заповнення

// Асинхронна функція для малювання фрактала
async function drawFractalAsync(context, levels, x, y, size) {
    if (levels == 0) {
      const rect = { x: x, y: y, width: size, height: 0 };
      await fillSquare(context, rect); // Асинхронне заповнення квадрата
    } else {
      var size3 = size / 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if ((i + j) % 2 === 0) {
            await drawFractalAsync(context, levels - 1, x + i * size3, y + j * size3, size3);
          }
        }
      }
    }
}

// Функція для малювання фрактала без асинхронності
function drawFractal(context, levels, x, y, size) {
    if (levels == 0) {
      context.fillStyle = document.getElementById('favcolorVicsec').value;
      context.fillRect(x, y, size, size);
    } else {
      var size3 = size / 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if ((i + j) % 2 === 0) {
            drawFractal(context, levels - 1, x + i * size3, y + j * size3, size3);
          }
        }
      }
    }
}

// Функція для генерації фрактала Vicsec
function generateVicsec() {
  context.setTransform(1, 0, 0, 1, 0, 0); 
  context.clearRect(0, 0, canvas.width, canvas.height);

  let inputLevels = document.getElementById('inputNumberIterationsVicsec').value;
  let levels;

  if (!isNaN(inputLevels) && inputLevels >= 0 && inputLevels != "") {
    levels = parseInt(inputLevels);
  } else {
    alert("Enter a valid number of iterations");
    return;
  }

  let x = 0;
  let y = 0;
  const size = 450;

  if (levels < 5) {
    drawFractalAsync(context, levels, x, y, size); // Виклик асинхронного малювання для меншої кількості ітерацій
  } else if (levels >= 10) {
    alert("The number of iterations is too big for this fractal to show");
    return;
  } else {
    drawFractal(context, levels, x, y, size); // Виклик малювання для більшої кількості ітерацій
  }
}

// Асинхронна функція для заповнення квадрата з анімацією
async function fillSquare(context, rect) {
    return new Promise((resolve) => {
      const animateFill = () => {
        if ((rect.height - rect.width) <= 10e-7) {
          context.clearRect(rect.x, rect.y, rect.width, rect.height);
          context.fillStyle = document.getElementById('favcolorVicsec').value;
          context.fillRect(rect.x, rect.y, rect.width, rect.height);
          rect.height += fillSpeed;
          requestAnimationFrame(animateFill);
        } else {
          resolve();
        }
      };
      animateFill();
    });
  }
