// Listener for findIngredients button
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('popup-click')
  button.addEventListener('click', function(){
    chrome.tabs.executeScript(null, {
      file: "getIngredients.js"
    })
  })
})

// CHeck if user is signed in and conditionally render html
chrome.runtime.sendMessage({command: "checkAuth"}, (response) => {
  console.log(response)
  if(response.status == 'success'){
    // Show this html if signed in
    document.querySelector('.loggedInArea').style.display='block'
    document.querySelector('.loggedInArea span').innerHTML = response.message.uid
  }else{
    // Show this html if not signed in
    document.querySelector('.loginArea').style.display='block'
  }
})

// Run this when login button pressed
var loginFunc = function(){
  // Get email and password
  var e = document.querySelector('.loginArea input[type="email"]').value
  var p = document.querySelector('.loginArea input[type="password"]').value
  // Change html if login is success
  chrome.runtime.sendMessage({command: "loginUser", data:{e: e, p: p}}, (response) => {
    console.log(response)
    document.querySelector('.loginArea').style.display='none'
    document.querySelector('.loggedInArea').style.display='none'
    if(response.status == 'success'){
      document.querySelector('.loggedInArea').style.display='block'
      document.querySelector('.loggedInArea span').innerHTML = response.message.uid
    }else{
      alert('Error: login info incorrect')
      document.querySelector('.loginArea').style.display='block'
    }
  })
}

// Run this when logout button pressed
var logoutFunc = function(){
  document.querySelector('.loggedInArea').style.display='none'
  document.querySelector('.loginArea').style.display='block'
  // Change html back to login page
  chrome.runtime.sendMessage({command: "logoutAuth"}, (response) => {
    console.log(response)
  })
}

var addItemFunc = function() {
  var item = document.querySelector('.loggedInArea input[type="text"]').value

  chrome.runtime.sendMessage({command: "addItem", item: item}, (response) => {
    console.log(response.status)
  })
}

// Listener for login button click
document.querySelector('.login-btn-auth').addEventListener('click', function(){
  loginFunc()
})
// Listener for logout button press
document.querySelector('.logout-btn-auth').addEventListener('click', function(){
  logoutFunc()
})
// Listener for adding individual ingredients
document.querySelector('.item-add').addEventListener('click', function() {
  addItemFunc()
})

