console.log(firebase.database())
var categoriesCount = document.getElementById("stats-categories")
var loading = document.getElementById("loading")
var dashData = document.getElementById("dashData")
async function getAllCount() {
    await firebase.database().ref("CATGEORY").get().then((snap) => {
        var data = snap.val()
        if (data == null) {
            categoriesCount.innerHTML = "0"
            loading.setAttribute("class", "hide")
            dashData.setAttribute("class", "stats-grid")
        }
        else {
            var getLength = Object.values(data)
            // console.log(getLength.length)
            categoriesCount.innerText = getLength.length
            loading.setAttribute("class", "hide")
            dashData.setAttribute("class", "stats-grid")
        }

    })
        .catch((e) => {
            console.log(e)
        })
}
getAllCount()