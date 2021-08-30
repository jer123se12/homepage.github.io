
function load(){
    document.getElementById("searchbar").focus();
    document.onkeypress = check
    let colors=generatecolors()
    document.body.style.backgroundColor=colors[0]
    document.body.style.color=colors[colors.length - 1]
    let boxes=document.getElementsByClassName("box")
    for (var i=0;i<boxes.length;i++){
      boxes[i].style.backgroundColor=colors[1]
    }
    let spoti=document.getElementsByClassName("spoti")
    for (var i=0;i<spoti.length;i++){
      spoti[i].style.backgroundColor=colors[2]
    }
}
function check(a){
  if (document.activeElement===document.getElementById("searchbar"))
    if (a.keyCode==13){
      a.preventDefault()
        window.location.replace("http://google.com/search?q="+document.getElementById("searchbar").innerHTML)
    }
}
function generatecolors(){
  let amt=3+Math.floor(Math.random()*7)
  let s=50+Math.floor(Math.random()*50)
  let v=50+Math.floor(Math.random()*50)
  let h=Math.floor(Math.random()*360)
  let value=360/amt
  var arr=[];
  for (let i=0;i<amt;i++){
    console.log(i)
    console.log('hsl('+((h+(i*value))%360)+","+s+"%,"+v+"%)")
    arr.push('hsl('+((h+(i*value))%360)+","+s+"%,"+v+"%)")
  }
  
  console.log(arr)
  for (var i=0;i<amt;i++){
    let j=i+Math.floor(Math.random()*(arr.length-i))
    let temp=arr[i]
    arr[i]=arr[j]
    arr[j]=temp
  }
  if (v>50){
    arr.push("#000")
  }else{
    arr.push("#fff")
  }
  console.log(arr)
  return arr

}
















 //spotify
 const my_client_id="e95367a4d42a49029fb52434dab95dcf"
var scopes = ['user-modify-playback-state',"streaming", "user-read-email", "user-read-private"].join(" ");
const redirect_uri="https://jer123se12.github.io/homepage.github.io/"//"http://localhost:5500/" "https://jer123se12.github.io/homepage.github.io/"
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const clientidsecrect="ZTk1MzY3YTRkNDJhNDkwMjlmYjUyNDM0ZGFiOTVkY2Y6MDMxMzQ1Njk5Njc5NDc3Y2E5Y2YyNmMzNmVlYzQ4NDM="
var response;
var shuffle=false
var repeat=false
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
        }else{
            window.location.replace(redirect_uri)
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
function spotify(method,url){
  if (getCookie("accesstoken")==""){
    gettoken()
  }else {
    if (getCookie("refresh_token")=="" || getCookie("time")<(new Date().getTime()/1000)){
      refresht()
    }
  }
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, false);
  xhr.setRequestHeader('Authorization',"Bearer "+getCookie("accesstoken"));
  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
  xhr.send()
  if (xhr.status >= 400){
    let res=JSON.parse(xhr.responseText)
    console.log(res)
    }
}
function pause(){
  spotify("PUT", "https://api.spotify.com/v1/me/player/pause")
}
function skip(){
  spotify("POST", "https://api.spotify.com/v1/me/player/next")
}
function prev(){
  spotify("POST", "https://api.spotify.com/v1/me/player/previous")
}
function rp(){
  if (repeat){
    repeat=false;
    document.getElementById("repeat").innerHTML="Repeat"
  }else{
    repeat=true;
    document.getElementById("repeat").innerHTML="No Repeat"
  }
  spotify("PUT", "https://api.spotify.com/v1/me/player/repeat?state="+((repeat)?"true":"false"))
}

function shu(){
  if (repeat){
    repeat=false;
    document.getElementById("shuffle").innerHTML="Shuffle"
  }else{
    repeat=true;
    document.getElementById("shuffle").innerHTML="No Shuffle"
  }
  spotify("PUT", "https://api.spotify.com/v1/me/player/shuffle?state="+((repeat)?"true":"false"))
}
//camellia:       73g5LfXxqHdonv0KYUI1jR
//Japanese:     6n4Ca1l5lxZMXZMaix4A1g
//electionic:     10bvKApaLascDhkERLahH2
//kikuo:           6ncRNuajCHqQng4VIHIRYr
//TUYU:         7HgxLUQo5Z1aVVT1QEkfen





