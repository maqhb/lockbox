let lockersData;
let http, indexToUpdate, lockerToUpdate
let token = ''

//UI List of all locker
function renderList(keys, data){
    let list =""
    let index = 1
    keys.forEach(key => {
        if(index%2 != 0){
            list = list + createLockerWithDataO(data[key], index, key)
        }else{
            list = list + createLockerWithDataC(data[key], index, key)
        }
        index++
    });
    if(index==1 || index -1 %2 == 0){
        list = list+"</div>"
    }
    document.getElementById("listPanel").innerHTML = list
}

//render UI of locker
function createLockerWithDataO(lockbox, index, key){
    var lockStatus = "Locked"
    var changeStatus = "Unlock"
    if(lockbox.ping.status.lockerStatus == 0){
        lockStatus = "Unlocked" 
        changeStatus = "Lock"
    }

    return '<div class="row"> <div class="col-md-6" id="'+key+'"><div class="card border-primary flex-md-row mb-4 shadow-sm h-md-250"><div class="card-body d-flex flex-column align-items-start"><strong class="d-inline-block mb-2 text-primary" >Box  '+key+'</strong>'
                        +'<h6 class="mb-0"><p class="text-dark">Device is currently <span id="lockStatus" class="text-primary">'+lockStatus+'</span>.</p></h6>'
                        
                        +'<div class="btn-justified-group btn-group-lg">'

                        +'<div class="container"><div class="row">'
                        +'<div class="col-sm-8 col-lg-3 ">'
                        +"<button type='button' class='btn btn-outline-primary' onClick='changeLockerStatus(\""+key+"\","+index+")'>"+changeStatus+"</button></div>"
                        +'<div class="col-sm-8 col-lg-5 ">'
                        +"<button type='button' class='btn btn-outline-primary ' id='statusChange' data-toggle='modal' data-target='#exampleModal' onclick='modalRendering(\""+key+"\")'>Activity History</button></div>"
                        +'<div class="col-sm-8 col-lg-4 " >'
                        +"<button type='button' class='btn btn-outline-primary ' id='statusChange' data-toggle='modal' data-target='#recentImage' onclick='renderRecentImageModal(\""+key+"\")' style=\"margin-right: 60px;\">Recent Image</button></div></div>"
                        +'<div class= row><div class="col-12" >'
                        +"<button type='button' class='btn btn-outline-primary  mt-3 imgs' id='statusChange' data-toggle='modal' data-target='#historyImages' onclick='renderHistoryImagesModal(\""+key+"\")'>All Images</button></div></div></div>"
                        +"</div></div></div></div>"
}

function createLockerWithDataC(lockbox, index, key){
    var lockStatus = "Locked"
    var changeStatus = "Unlock"
    if(lockbox.ping.status.lockerStatus == 0){
        lockStatus = "Unlocked" 
        changeStatus = "Lock"
    }

    return '<div class="col-md-6" id="'+key+'"><div class="card border-primary flex-md-row mb-4 shadow-sm h-md-250"><div class="card-body d-flex flex-column align-items-start"><strong class="d-inline-block mb-2 text-primary" >Box  '+key+'</strong>'
                        +'<h6 class="mb-0"><p class="text-dark">Device is currently <span id="lockStatus" class="text-primary">'+lockStatus+'</span>.</p></h6>'
                        
                        +'<div class="btn-justified-group btn-group-lg">'

                        +'<div class="container"><div class="row">'
                        +'<div class="col-sm-8 col-lg-3 ">'
                        +"<button type='button' class='btn btn-outline-primary' onClick='changeLockerStatus(\""+key+"\","+index+")'>"+changeStatus+"</button></div>"
                        +'<div class="col-sm-8 col-lg-5 ">'
                        +"<button type='button' class='btn btn-outline-primary ' id='statusChange' data-toggle='modal' data-target='#exampleModal' onclick='modalRendering(\""+key+"\")'>Activity History</button></div>"
                        +'<div class="col-sm-8 col-lg-4 ">'
                        +"<button type='button' class='btn btn-outline-primary ' id='statusChange' data-toggle='modal' data-target='#recentImage' onclick='renderRecentImageModal(\""+key+"\")' style=\"margin-right: 60px;\">Recent Image</button></div></div>"
                        +'<div class= row><div class="col-12" >'
                        +"<button type='button' class='btn btn-outline-primary  mt-3 imgs' id='statusChange' data-toggle='modal' data-target='#historyImages' onclick='renderHistoryImagesModal(\""+key+"\")'>All Images</button></div></div></div>"
                        +"</div></div></div></div></div>"
}


//Change Lock Status of locker update UI after update
function changeLockerStatus(lockerId, index){
    token = this.getCookie('idToken')
    let Url = 'https://armabox.firebaseio.com/LockerDb/'+lockerId+'/ping/status.json?auth='+token
    let stat = lockersData[lockerId].ping.status.lockerStatus
    if(stat == 0){
        stat = 1
    }else{
        stat = 0
    }
        this.fetch(Url, {
            method: "PUT",
            //credentials: "include", // send cookies
            headers: {
                'Accept': 'application/json',
                //'Content-Type': 'application/json'
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" // otherwise $_POST is empty
            },
            body: JSON.stringify({
                lockerStatus:stat})
        })
        .then(function(myJson) {
            if(myJson.status ==200){
                updateLockerUI(lockerId, index)
            }else{
                alert("Unauthorized Acess or Token is expired")
                window.location.replace("index.html");
            }
    });
}

function updateLockerUI(lockerId, index){
    let Url = 'https://armabox.firebaseio.com/LockerDb/'+lockerId+'.json?auth='+token
    getRequestForLockers(Url,1)
    indexToUpdate = lockerId
    lockerToUpdate = lockerId
}

//Modal Handling for Showing history of any specific locker
function modalRendering(key){
    $('#exampleModal .modal-body').html("<p>Loading</p>")
    let lockbox = lockersData[key]
    let history = lockbox.history
    let listHtml = "No History Yet"
    if(history != undefined){
        const keys = Object.keys(history);
        listHtml = '<ul class="list-group">'
        keys.forEach(key => {
            listHtml= listHtml + renderHistoryItem(history[key])
        });
        listHtml = listHtml + "</ul>"
    }
    $('#exampleModal .modal-body').html(listHtml)
}

function renderHistoryItem(historyItem){
    const key = Object.keys(historyItem);
    return '<li class="list-group-item d-flex justify-content-between align-items-center">'
                +'<p><span id="Day">'+timeConverter(historyItem[key])+'</p>'
                +'<span class="badge badge-primary badge-pill">'+key+'</span>'
            +"</li>"
}
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + tConvert(hour + ':' + min + ':' + sec) ;
    return time;
  }
  
  function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
}

function getCookie(name) {
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
     return match ? match[1] : null;
}

window.onload = function(){
    let userId =this.getCookie('userId')
    token = this.getCookie('idToken')
    if( token !=null &&userId != null ){
        const url='https://armabox.firebaseio.com/LockerDb.json?equalTo="'+userId+'"&auth='+token+'&orderBy="userId"';
        this.getRequestForLockers(url, 0)
        document.getElementById("username").innerHTML = "Welcome "+this.getCookie('name')
    }else{
        window.location.replace("index.html");
    }
}

//Do get Request to get Lockers/Locker data
function getRequestForLockers(Url, flag){
    http = new XMLHttpRequest()
    http.open("GET", Url)
    http.send()

    if(flag == 0){
        http.onload = listCallBack
    }else{
        http.onload = lockerCallBack
    }
}

//Callback for list of all lockers
function listCallBack() {
    let data = http.responseText
    if(http.status == 401){
        alert("Unauthorized Acess or Token is expired")
        window.location.replace("index.html");
    }else{
        lockersData = $.parseJSON(data);
        const keys = Object.keys(lockersData);
        document.getElementById("devices").innerText = keys.length
        renderList(keys, lockersData);
    }
}

//Callback for a single Locker
function lockerCallBack(){
    console.log()
    let data = http.responseText
    if(http.status == 401){
        alert("Unauthorized Acess or Token is expired")
    }else{
        data = $.parseJSON(data);
        document.getElementById(lockerToUpdate).innerHTML = updateLockerWithData(data)
        lockersData[lockerToUpdate] = data
    }
}

function updateLockerWithData(lockbox){
    var lockStatus = "Locked"
    var changeStatus = "Unlock"
    if(lockbox.ping.status.lockerStatus == 0){
        lockStatus = "UnLocked"
        changeStatus = "Lock"
    }

     return '<div class="card border-primary flex-md-row mb-4 shadow-sm h-md-250"><div class="card-body d-flex flex-column align-items-start"><strong class="d-inline-block mb-2 text-primary" >Box '+indexToUpdate+'</strong>'
                        +'<h6 class="mb-0"><p class="text-dark">Device is currently <span id="lockStatus" class="text-primary">'+lockStatus+'</span>.</p></h6>'
                        
                        +'<div class="btn-justified-group btn-group-lg">'

                        +'<div class="container"><div class="row">'
                        +'<div class="col-sm-8 col-lg-3 ">'
                        +"<button type='button' class='btn btn-outline-primary' onClick='changeLockerStatus(\""+lockerToUpdate+"\","+indexToUpdate+")'>"+changeStatus+"</button></div>"
                        +'<div class="col-sm-8 col-lg-5 ">'
                        +"<button type='button' class='btn btn-outline-primary ' id='statusChange' data-toggle='modal' data-target='#exampleModal' onclick='modalRendering(\""+lockerToUpdate+"\")'>Activity History</button></div>"
                        +'<div class="col-sm-8 col-lg-4 ">'
                        +"<button type='button' class='btn btn-outline-primary ' id='statusChange' data-toggle='modal' data-target='#recentImage' onclick='renderRecentImageModal(\""+lockerToUpdate+"\")'>Recent Image</button></div></div>"
                        +'<div class= row><div class="col-12" >'
                        +"<button type='button' class='btn btn-outline-primary  mt-3 imgs' id='statusChange' data-toggle='modal' data-target='#historyImages' onclick='renderHistoryImagesModal(\""+lockerToUpdate+"\")'>All Images</button></div></div></div>"
                        +"</div></div></div>"
}


function renderRecentImageModal(lockerId){
    $('#recentImage .modal-body').html("<p>Loading</p>")
    let ImageObj = lockersData[lockerId].latestImage
    let html = "<p>No Recent Image</p>"
    if(ImageObj !=undefined){
        const timestamp = Object.keys(ImageObj);
        html = '<p class="mb-2"><span id="Day">'+timeConverter(timestamp)+'</span></p>'
                +'<img class="img-responsive" src="data:image/jpeg;base64,'+ImageObj[timestamp]
                +'" alt=""></img>'
    }
    $('#recentImage .modal-body').html(html)
}


function renderHistoryImagesModal(lockerId){
    $('#historyImages .modal-body').html("<p>Loading</p>")
    http = new XMLHttpRequest()
    token = this.getCookie('idToken')
    http.open("GET", 'https://armabox.firebaseio.com/LockersImages/'+lockerId+'.json?auth='+token)
    http.send()
    http.onload = imagesModalCallBack

}

function imagesModalCallBack(){
    console.log()
    let data = http.responseText
    if(http.status == 401){
        alert("Unauthorized Acess or Token is expired")
        //Replace it with the actual domain + do same changes in above callback
        window.location.replace("index.html");
    }else{
        data = $.parseJSON(data);
        imagesModal(data)
    }
}

function imagesModal(images){
    let html = ""
    if(images !=null){
        const timestamps = Object.keys(images);
        html = '<ul class="list-group">'
        timestamps.forEach(timestamp => {
        html = html + renderImage(timestamp, images[timestamp])
            });
        html = html + '</ul>'
    }else{
        html = "<p>No Images In History</p>"
    }
    $('#historyImages .modal-body').html(html)
}

function signout(){
    let exTime = new Date(Date.now() - 3600 * 1000);
    document.cookie = "name= ; expires = "+exTime+";";
    document.cookie = "userId= ;expires="+exTime+";";
    document.cookie = "idToken=0 ;expires="+exTime+";";
    window.location.replace("index.html");
}

function renderImage(timestamp, image){
    return  '<li class="list-group-item d-flex justify-content-between align-items-center">'
            +'<p class="mb-2"><span id="Day">'+timeConverter(timestamp)+'</span></p>'
            +'<img class="img-responsive" src="data:image/jpeg;base64,'+image+'" alt="">'
            +'</li>'
}