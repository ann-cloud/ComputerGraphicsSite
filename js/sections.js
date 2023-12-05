function toggleSection(element, sectionId) {
    var section = document.getElementById(sectionId);
    var attribute = window.getComputedStyle(section, null).getPropertyValue('display');
    console.log(element.firstChild.src);
    if (attribute === "none") {
        section.style.display = "block";
        element.firstChild.src = "/img/left.png";
        console.log(element.firstChild.src);
    } else {
        section.style.display = "none";
        element.firstChild.src = "/img/left2.png";
    }
}