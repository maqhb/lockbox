let status = false;

function toggleBoolean() {
    return true;
  }

function signin(text) {  
    this.fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBEP2zeZf0yyQrMpTMN3It9HJCLxDvo2Ig', {
        method: "POST",
        //credentials: "include", // send cookies
        headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" // otherwise $_POST is empty
        },
        body: new this.URLSearchParams (
        text
        )
    })
    .then(function res(response) {
        if(response.status == 200){
            status = toggleBoolean(); 
            return response.json();
            }
            else{
                alert("Login Incorrect");
            }

    })
    .then(function(myJson) {
        if(status==true){
        setCookie(myJson);
            }

    });    
}  


function setCookie(json){
    let exTime = new Date(Date.now() + 3600*1000).toUTCString()
    document.cookie = "name="+json.displayName+";expires="+exTime+";"
    document.cookie = "userId="+json.localId+";expires="+exTime+";"
    document.cookie = "idToken="+json.idToken+";expires="+exTime+";"
    window.location.replace("home.html");
}


function signIn(){
    var email = this.document.getElementById("email").value;
    var pass = this.document.getElementById("pass").value;
    var text = '{"email":"","password":"","returnSecureToken":true}';
    var obj = JSON.parse(text)
    obj.email = email;
    obj.password = pass;
    signin(obj);
}

function getCookie(name) {
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
     return match ? match[1] : null;
}

window.onload = function(){
    let userId =this.getCookie('userId')
    token = this.getCookie('idToken')
	if(userId != null && token != null){
    if( token !=0 && userId != 0 ){
        this.alert("Already Signed In")
        window.location.replace("home.html");
    }
	}
}
