    let accountUpdate = { "idToken": "",
                    "displayName": "",
                    "returnSecureToken":true }

function checkPass()
{

    var pass1 = document.getElementById('pass');
    var pass2 = document.getElementById('repass');

    var message = document.getElementById('confirmMessage');

    var goodColor = "#66cc66";
    var badColor = "#ff6666";

    if(pass1.value == pass2.value && pass1.value.length !=0){
        pass2.style.backgroundColor = goodColor;
        message.style.color = goodColor;
        message.innerHTML = "Passwords Match"
        return true;
    }else{
        if(pass1.value.length !=0){
        pass2.style.backgroundColor = badColor;
        message.style.color = badColor;
        message.innerHTML = "Passwords Do Not Match!"
        
        }else{
            pass2.style.backgroundColor = badColor;
                
        }
        
        return false;
    }
}

function Validate(txt) {
    txt.value = txt.value.replace(/[^a-zA-Z-'\n\r.]+/g, '');
}

function signup(text) {
    this.console.log("Fetching");
    this.fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBEP2zeZf0yyQrMpTMN3It9HJCLxDvo2Ig', {
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
        console.log(text);
        if(response.status == 200){
        return response.json(); // .text();    
        }
        else{
                alert("Invalid Email");
            }
        
    })
    .then(function(myJson) {
        if(myJson != undefined){
        accountUpdate.idToken = myJson.idToken;
        setCookie(myJson);
        updateUserAccount(accountUpdate);
            }
        
    });
    

    
}  

function updateUserAccount(text){

    this.console.log("Update user account");  
    this.fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBEP2zeZf0yyQrMpTMN3It9HJCLxDvo2Ig', {
        method: "POST",
        //credentials: "include", // send cookies
        headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" // otherwise $_POST is empty
        },
        body: new this.URLSearchParams(
            text
        )
    })
    .then(function res(response) {
        console.log(response);
        return response.json(); // .text();
    })
    .then(function(myJson) {
        
        let exTime = new Date(Date.now() + 3600*1000).toUTCString()
        document.cookie = "name="+myJson.displayName+";expires="+exTime+";"
        window.location.replace("home.html")

    });

    
}   


function setCookie(json){
let exTime = new Date(Date.now() + 3600*1000).toUTCString()
document.cookie = "userId="+json.localId+";expires="+exTime+";"
document.cookie = "idToken="+json.idToken+";expires="+exTime+";"
}

var emailV = false;

function email_validate(email)
{
var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
    
    
    var msg = document.getElementById("status");
    var emailF = document.getElementById("email");
    
//    var goodColor = "#66cc66";
    var badColor = "#ff6666";
    
    if(regMail.test(email) == false)
    {
    emailF.style.backgroundColor = badColor;
        emailV = false;
    }
    else
    {
    emailF.style.backgroundColor = "#ebebeb";
       emailV = true;
    }
}

function signUp(){
    var normColor = "#ebebeb";
    var badColor = "#ff6666";
    
    var email = this.document.getElementById("email");
    var pass = this.document.getElementById("pass");
    var firstName = this.document.getElementById("firstName");
    var lastName = this.document.getElementById("lastName").value;
    
    
    if(firstName.value != ""){
    firstName.style.backgroundColor = normColor;
        if(email.value != "" || emailV == true){
        email.style.backgroundColor = normColor;
            if(pass.value != "" && checkPass() == true ){
//                pass.style.backgroundColor = normColor;
                if(pass.value.length < 6){
                    var lessChar = document.getElementById("status");
                    lessChar.style.color = badColor;
                    lessChar.innerHTML = "Password must be greater than 6 characters!";
                }else{
                    var lessChar = document.getElementById("status");
                    lessChar.innerHTML = "";
                var text = '{"email":"","password":"","returnSecureToken":true}';
                var name = firstName.value + ' ' + lastName;
                accountUpdate.displayName = name;

                var obj = JSON.parse(text);
                obj.email = email.value;
                obj.password = pass.value;
                signup(obj);           
            }
            }
            else {
                pass.style.backgroundColor = badColor;
            }
            
        }else{
        email.style.backgroundColor = badColor;
            
        }
    }else{
        firstName.style.backgroundColor = badColor;
    }
    
}


function getCookie(name) {
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
     return match ? match[1] : null;
}

window.onload = function(){
    let userId =this.getCookie('userId')
    token = this.getCookie('idToken')
	if(userId !=null && token!=null){
    if( token !=0 && userId != 0 ){
        this.alert("Already Signed In")
        window.location.replace("home.html");
    }
	}
}
