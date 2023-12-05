//експорт фракталу Ньютона
function exportNewton()
{
    const dataURL = document.getElementById("displayNewton").toDataURL("image/png");
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = 'fractalNewton.jpeg';
    a.click();
}
//експорт фракталу Вічека
function exportVicsek()
{
    const dataURL = document.getElementById("displayVicsec").toDataURL("image/png");
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = 'fractalVicsek.jpeg';
    a.click();
}
//експорт кооржинатної площини
function exportMovingImage()
{
    const dataURL = document.getElementById("moving-img").toDataURL("image/png");
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = 'movingImage.jpeg';
    a.click();
}

//експорт перетвореного зображення
function exportImg() {
    const dataURL = document.getElementById("img-after").toDataURL("image/png");
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = 'ColoredImage.jpeg';
    a.click();
}