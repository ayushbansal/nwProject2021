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

var jsonld = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText)
var title = document.title
var ingredients = findIngredientsFunc(jsonld, 'recipeIngredient')
var str = ingredients[1]
////////////////////////////////////////
chrome.runtime.sendMessage({command: "AddAllIngredients", title: title, ingredients: str}, response => {
  console.log(response.status)
})