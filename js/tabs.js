function openPage(pageName, elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "#028090";
    tablinks[i].style.color = "white";
  }
  var selectedPage = document.getElementById(pageName);
  selectedPage.style.display = "flex"; 
  elmnt.style.backgroundColor = "white";
  elmnt.style.color = "#028090";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
