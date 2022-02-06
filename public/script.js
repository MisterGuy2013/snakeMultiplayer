var params = new URLSearchParams(location.search);
var username = params.get("username");
var session = params.get("session");
if(username == undefined || session == undefined){
  $("#CCAMLOGIN")[0] = '<div><a href="#" id="CCAMSIS"><button id="CCAMSISBUTTON" type="button">Login with ChickenCam SIS</button></a><script> var link = document.getElementById("CCAMSIS").href; var URL = "https://ccamsis.misterguy2013.repl.co/signIn.html"; var currectURL = window.location.href; var fullURL = `${URL}?redirect=${currectURL}`; link = fullURL;</script><style> #CCAMSISBUTTON{ border-radius:5%; font-size: 1.5rem; font-weight: bold; display: inline-block; margin:1%; background: rgb(12, 1, 107); color: rgba(255, 255, 255, 0.719); padding: 7px 50px; cursor: pointer; transition: .2s; box-shadow: 0px 0px rgb(50, 35, 184), 1px 1px rgb(50, 35, 184), 2px 2px rgb(50, 35, 184), 3px 3px rgb(50, 35, 184), 4px 4px rgb(50, 35, 184);}#CCAMSISBUTTON:hover{ transform: translate(2px, 2px); box-shadow: 0px 0px rgb(50, 35, 184), 0.5px 0.5px rgb(50, 35, 184), 1px 1px rgb(50, 35, 184), 1.5px 1.5px rgb(50, 35, 184), 2px 2px rgb(50, 35, 184); background: rgb(50, 35, 184); transition: .2s;}#CCAMSISBUTTON:active{ transform: translate(2px, 2px); box-shadow:none; transition: 0.1s;}</style></div>';
}
else{
  
}



