
function load(){
    document.getElementById("searchbar").focus();
    document.onkeypress = check
    
}
function check(a){
  if (document.activeElement===document.getElementById("searchbar"))
    if (a.keyCode==13){
      a.preventDefault()
        window.location.replace("http://google.com/search?q="+document.getElementById("searchbar").innerHTML)
    }
}

















 //spotify
 const my_client_id="e95367a4d42a49029fb52434dab95dcf"
var scopes = ['user-modify-playback-state',"streaming", "user-read-email", "user-read-private"].join(" ");
const redirect_uri="https://jer123se12.github.io/homepage.github.io/"
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const clientidsecrect="ZTk1MzY3YTRkNDJhNDkwMjlmYjUyNDM0ZGFiOTVkY2Y6MDMxMzQ1Njk5Njc5NDc3Y2E5Y2YyNmMzNmVlYzQ4NDM="
var response;
document.cookie="device_id=;"


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function gettoken(){
  if (Object.keys(params).length === 0){
    window.location.href =('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + my_client_id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri));
    }else{
        console.log((params["code"]))
        if (params["code"]){
            let data={
                "grant_type": "authorization_code",
                "code" : params["code"],
                "redirect_uri":redirect_uri
            }
            
            var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://accounts.spotify.com/api/token", false);
        xhr.setRequestHeader('Authorization',"Basic "+clientidsecrect);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
        xhr.send(serialize(data));
            // postData("https://accounts.spotify.com/api/token",data).then(
            //     data => {
            //         console.log(data); // JSON data parsed by `data.json()` call
            //       }
            // )
        
        response=JSON.parse(xhr.responseText)
        console.log(response)
        if (xhr.status == 200){
          var timeout =( new Date().getTime() / 1000)+response.expires_in;
          var t = new Date(1970, 0, 1);
          
          document.cookie='time='+String(timeout)+";"
          document.cookie="accesstoken="+response.access_token+";"
          document.cookie="refresh_token="+response.refresh_token+";"
        }
        
    }
    }
}

function refresht(){
  let data={

    "grant_type": "refresh_token",
    "refresh_token" : getCookie("refresh_token"),
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://accounts.spotify.com/api/token", false);
  xhr.setRequestHeader('Authorization',"Basic "+clientidsecrect);
  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
  xhr.send(serialize(data));
  response=JSON.parse(xhr.responseText)
  console.log(response)
  if (xhr.status == 200){
    var timeout =( new Date().getTime() / 1000)+response.expires_in;
    var t = new Date(1970, 0, 1);
    
    document.cookie='time='+String(timeout)+";"
    document.cookie="accesstoken="+response.access_token+";"
  }
    
}

function play(playlistid="None"){
  if (getCookie("accesstoken")==""){
    gettoken()
  }else {
    if (getCookie("refresh_token")=="" || getCookie("time")<(new Date().getTime()/1000)){
      refresht()
    }
  }
  let data={}
  if (playlistid=="None"){
    data={}
  }else{
  data={
    "context_uri": "spotify:playlist:"+playlistid,
    "offset": {
      "position": 0
    },
    "position_ms": 0
  }
}

  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "https://api.spotify.com/v1/me/player/play"+"?device_id="+getCookie("device_id"), false);
  xhr.setRequestHeader('Authorization',"Bearer "+getCookie("accesstoken"));
  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
  xhr.send(JSON.stringify(data));
  if (xhr.status >= 400){
  let res=JSON.parse(xhr.responseText)
  console.log(res)
  }
  
}

function pause(){
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "https://api.spotify.com/v1/me/player/pause"+"?device_id="+getCookie("device_id"), false);
  xhr.setRequestHeader('Authorization',"Bearer "+getCookie("accesstoken"));
  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
  xhr.send()
  if (xhr.status >= 400){
    let res=JSON.parse(xhr.responseText)
    console.log(res)
    }
}


//camellia:       73g5LfXxqHdonv0KYUI1jR
//Japanese:     6n4Ca1l5lxZMXZMaix4A1g
//electionic:     10bvKApaLascDhkERLahH2
//kikuo:           6ncRNuajCHqQng4VIHIRYr
//TUYU:         7HgxLUQo5Z1aVVT1QEkfen


console.log(params)
if (getCookie("accesstoken")==""){
  gettoken()
}else {
  if (getCookie("refresh_token")=="" || getCookie("time")<(new Date().getTime()/1000)){
    refresht()
  }
}



