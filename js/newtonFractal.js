const TOL = 1e-6;
const canvasNewton = document.getElementById('displayNewton');
const ctx = canvasNewton.getContext('2d');
var scale = 0; // Initial scale
var domain =  { xmin: -1, xmax: 1, ymin: -1, ymax: 1 };
var offsetX = 0;
var offsetY = 0;
var isBuilding = true;

class Complex 
{
  constructor(real, imaginary) 
  {
    this.real = real;
    this.imaginary = imaginary;
  }

  // Add two complex numbers
  add(other) 
  {
    return new Complex(this.real + other.real, this.imaginary + other.imaginary);
  }

  // Subtract two complex numbers
  subtract(other) 
  {
    return new Complex(this.real - other.real, this.imaginary - other.imaginary);
  }

  // Multiply two complex numbers
  multiply(other) 
  {
    const realPart = this.real * other.real - this.imaginary * other.imaginary;
    const imaginaryPart = this.real * other.imaginary + this.imaginary * other.real;
    return new Complex(realPart, imaginaryPart);
  }

  // Divide two complex numbers
  divide(other) 
  {
    const denominator = other.real * other.real + other.imaginary * other.imaginary;
    const realPart = (this.real * other.real + this.imaginary * other.imaginary) / denominator;
    const imaginaryPart = (this.imaginary * other.real - this.real * other.imaginary) / denominator;
    return new Complex(realPart, imaginaryPart);
  }

  // Calculate the complex number to the power of n
  pow(n) 
  {
    if (n === 0) 
    {
      return new Complex(1, 0);
    }

    let result = new Complex(this.real, this.imaginary);
    for (let i = 1; i < n; i++) 
    {
      result = result.multiply(this);
    }

    return result;
  }

  abs() 
  {
    return Math.sqrt(this.real ** 2 + this.imaginary ** 2);
  }
}

function newtonMethod(z0, complex, iterationCount) 
{
  const f = (z) => z.pow(4).add(complex);
  const fprime = (z) => z.pow(3).multiply(new Complex(4, 0));

  let z = z0;
  for (let i = 0; i < iterationCount; i++) 
  {
      const dz = f(z).divide(fprime(z));
      z = z.subtract(dz);
      if (dz.abs() < TOL) 
      {
          return z;
      }
  }
  return z;
}

function findRoots(complex)
{
  const roots = [];

  const initialGuesses = [
    new Complex(1, 0),
    new Complex(-1, 0),
    new Complex(0, 1),
    new Complex(0, -1)
  ];

  for (let j = 0; j < initialGuesses.length; j++) {
    roots[j] = newtonMethod(initialGuesses[j], complex, 100);
  }
  return roots;
}

function closestRootIndex(roots, r)
{
  let closestIndex = 0;
  let closestDifference = r.subtract(roots[0]).abs();

  for (let i = 1; i < roots.length; i++) 
  {
    const difference = r.subtract(roots[i]).abs();

    if (difference < closestDifference) 
    {
      closestIndex = i;
      closestDifference = difference;
    }
  }

  return closestIndex;
}

function rgbToHex(r, g, b) 
{
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  const hexColor = `#${hexR}${hexG}${hexB}`;

  return hexColor;
}

function pickColorTheme(colorTheme)
{
  let colors;
  switch(colorTheme)
  {
    case "Winter":
      colors = ["#ffffff", "#55a7e1", "#0f50c9", "#baddff"];
      break;
    case "Spring":
      colors = ["#68EB6B", "#3FA500", "#FFDD00", "#FF81A5"];
      break;
    case "Summer":
      colors = ["#FFE100", "#DA1818", "#0099FF", "#E77B00"];
      break;
    case "Autumn":
      colors = ["#FF8000", "#FFEA00", "#A21600", "#7B2D00"];
      break;
    case "Picture":
      const color1 = rgbToHex(palette[0][0], palette[0][1], palette[0][2]);
      const color2 = rgbToHex(palette[1][0], palette[1][1], palette[1][2]);
      const color3 = rgbToHex(palette[2][0], palette[2][1], palette[2][2]);
      const color4 = rgbToHex(palette[3][0], palette[3][1], palette[3][2]);
      colors = [color1, color2, color3, color4];
  }
  return colors;
}

function generateNewton() 
{
  const inputNum = document.getElementById('inputNumberIterationsNewton').value;
  const inputReal = document.getElementById('inputConstantCReal').value;
  const inputImg = document.getElementById('inputConstantCImg').value;
  const colorTheme = document.getElementById('colorThemes').value;
  const colors = pickColorTheme(colorTheme);
  let real, imaginary, numberOfIterations;

  if (!isNaN(inputNum) && inputNum >= 0 && inputNum.trim() != "")
  {
    numberOfIterations = parseInt(inputNum);
  }
  else
  {
    alert("Enter a valid number of iterations");
    return;
  }
  if (!isNaN(inputReal) && inputReal.trim() != "")
  {
    real = parseInt(inputReal);
  }
  else
  {
    alert("Enter a valid real constant");
    return;
  }
  if (!isNaN(inputImg) && inputImg.trim() != "")
  {
    imaginary = parseInt(inputImg);
  }
  else
  {
    alert("Enter a valid imaginary constant");
    return;
  }
  const c = new Complex(real, imaginary);

  const n = 450;
  //console.log(domain);
  const m = new Array(n);

  for (let i = 0; i < n; i++) {
    m[i] = new Array(n).fill(0);
  }

  const { xmin, xmax, ymin, ymax } = domain;
  const dx = (xmax - xmin) / (n - 1);
  const dy = (ymax - ymin) / (n - 1);

  for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
          const x = xmin + ix * dx;
          const y = ymin + iy * dy;

          const z0 = new Complex(x, y);
          const r = newtonMethod(z0, c, numberOfIterations);

          let roots = findRoots(c);
          m[ix][iy] = closestRootIndex(roots, r);
      }
  }

  if (isBuilding)
  {
    let currentFrame = 0;

    function animateCanvas() 
    {
      if (currentFrame < n) 
      {
        for (let ix = 0; ix < n; ix++) 
        {
          ctx.fillStyle = colors[m[ix][currentFrame]];
          ctx.fillRect(ix, currentFrame, 1, 1);
        }
        currentFrame++;
        requestAnimationFrame(animateCanvas);
      }
    }    
    requestAnimationFrame(animateCanvas);
  }
  else
  {
    for (let ix = 0; ix < n; ix++) 
    {
      for (let iy = 0; iy < n; iy++) 
      {
        ctx.fillStyle = colors[m[ix][iy]];
        ctx.fillRect(ix, iy, 1, 1);
      }
    }
  }
}

function updateZoom() 
{
  isBuilding = false;
  scale = parseFloat(document.getElementById('scale').value); 
  if (scale == 0)
  {
    offsetX = 0;
    offsetY = 0;
  }
  scale /= 200;
  domain = { xmin: -1 + scale + offsetX * scale / 200, xmax: 1 - scale + offsetX * scale / 200, ymin: -1 + scale + offsetY * scale / 200, ymax: 1 - scale + offsetY * scale / 200};
  generateNewton();
  isBuilding = true;
}

document.getElementById('scale').addEventListener('input', updateZoom);

document.addEventListener('keydown', function(event) 
{
  if (event.key === 'ArrowLeft') 
  {
    offsetX--;
    updateZoom();
  } else if (event.key === 'ArrowRight') 
  {
    offsetX++;
    updateZoom();
  } else if (event.key === 'ArrowDown') 
  {
    offsetY++;
    updateZoom();
  } else if (event.key === 'ArrowUp') 
  {
    offsetY--;
    updateZoom();
  }
});

