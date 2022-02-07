function validate() {
  var username = document.getElementById("username").value;
  sessionStorage.setItem("usernameS", username);

  console.log("sono dentro validate");
  /*aprimi pagina personale */
  window.open("personal2.html", "_self");
}
