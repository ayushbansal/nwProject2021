// Listener for findIngredients button
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('popup-click')
  button.addEventListener('click', function(){
    addIngredientsFunc()
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

// Listener for login button click
document.querySelector('.login-btn-auth').addEventListener('click', function(){
  loginFunc()
})
// Listener for logout button press
document.querySelector('.logout-btn-auth').addEventListener('click', function(){
  logoutFunc()
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

var findIngredientsFunc = function findIngredients(obj, k) {
  for (var key in obj) {
    var value = obj[key]

    if (k == key) {
      return [k, value]
    }

    if (typeof(value) === "object" && !Array.isArray(value)) {
      var y = findIngredients(value, k)
      if (y && y[0] == k) return y
    }
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; ++i) {
        var x = findIngredients(value[i], k)
        if (x && x[0] == k) return x
      }
    }
  }

  return null
}

var addIngredientsFunc = function() {
  var jsonld = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText)
  var title = document.title
  var ingredients = findIngredientsFunc(jsonld, 'recipeIngredient')
  var str = ingredients[1]
  ////////////////////////////////////////
  chrome.runtime.sendMessage({command: "AddAllIngredients", title: title, ingredients: str}, response => {
    alert(response.status)
  })
}