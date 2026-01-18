document.getElementById("sidebar-container").innerHTML = getSidebar();
var modal = document.getElementById("modal")
var catSelect = document.getElementById('prod-cat');




async function getAllCat() {
    var img = document.getElementById("img")
    var imgShow = document.getElementById("imgShow")
    img.addEventListener("change", function () {
        console.log(img.files[0])
        var imgFile = img.files[0]
        var imgUrl = URL.createObjectURL(imgFile)
        imgShow.src = imgUrl
        imgShow.style.display = "block"
    })
    await firebase.database().ref("CATGEORY").get()
        .then((snap) => {
            console.log(snap.val())
            if (snap.val() == null) {
                return
            }
            allCat = Object.values(snap.val())
            console.log(allCat)
            for(var i = 0;i<allCat.length ; i++){
                console.log(allCat[i])
            }
        })
        .catch((e) => {
            console.log(e)
        })
}

function openModal(id = null) {
    modal.classList.add("active")
    

}
function closeModal() {
    modal.classList.remove("active")
}

getAllCat()