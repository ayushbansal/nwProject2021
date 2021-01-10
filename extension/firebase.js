var firebaseConfig = {
    apiKey: "AIzaSyD1LyljcAUlFnOtocQcXqxHEpKqd6K01oQ",
    authDomain: "nwproject2021-8b6c0.firebaseapp.com",
    databaseURL: "https://nwproject2021-8b6c0-default-rtdb.firebaseio.com",
    projectId: "nwproject2021-8b6c0",
    storageBucket: "nwproject2021-8b6c0.appspot.com",
    messagingSenderId: "185226765673",
    appId: "1:185226765673:web:aae68f8248639315eac9f8",
    measurementId: "G-REMB5Q7FHL"
  }

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// sends message when button pressed
chrome.runtime.onMessage.addListener((msg, sender, response) => {
if(msg.command == 'logoutAuth'){
    firebase.auth().signOut().then(function() {
    response({type: "un-auth", status: "success", message: true})
    }, function(error) {
    alert("logout error")
    response({type: "un-auth", status: "false", message: error})
    })
}
if(msg.command == 'checkAuth'){
    var user = firebase.auth().currentUser
    if (user) {
    // User is signed in.
    response({type: "auth", status: "success", message: user})
    } else {
    // No user is signed in.
    response({type: "auth", status: "no-auth", message: false})
    }
}
if (msg.command === 'AddAllIngredients') {
    var uid = firebase.auth().currentUser.uid

    var ingredients = msg.ingredients
    var title = msg.title
    
    ingredients.forEach(item => {
        firebase.database().ref(uid).push({
            [item]: title
        })
    })
    alert("Successfully saved recipe ingredients!")
    response({type: "AddAllIngredients", status: "success"})
}
if (msg.command === 'addItem') {
    var uid = firebase.auth().currentUser.uid

    firebase.database().ref(uid).push({
        [msg.item]: ""
    })
    alert("Successfully added item!")
    response({status: "success"})
}
if(msg.command == 'loginUser'){
    console.log(msg.data)
    var email = msg.data.e
    var pass = msg.data.p
    //Add seperate values for auth info here instead of fixed variables...
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code
    var errorMessage = error.message
    console.log(error)
    response({type: "auth", status: "error", message: errorMessage})
    // ...
    })
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log(user)
        response({type: "auth", status: "success", message: user})
    } else {
        // No user is signed in.
    }
    })
}

return true
})