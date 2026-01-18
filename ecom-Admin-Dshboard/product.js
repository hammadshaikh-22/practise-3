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
            for (var i = 0; i < allCat.length; i++) {
                console.log(allCat[i])
                catSelect.innerHTML += `
                <option value = ${allCat[i].catName}>${allCat[i].catName} </option>
                `
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
function uploadImage() {
    event.preventDefault()
    console.log(img.files);

    console.log(img.files[0].size);
    var checkSize = img.files[0].size / 1024 / 1024;
    console.log(checkSize);
    if (checkSize > 2) {
        alert("please select image less then 2 mb");
    } else {
        const formdata = new FormData();
        formdata.append("file", img.files[0]);
        formdata.append("upload_preset", "name");

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };

        fetch(
            "https://api.cloudinary.com/v1_1/cloudname/image/upload",
            requestOptions
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data.secure_url);
                userImageUrl = data.secure_url;
            })
            .catch((error) => console.error(error));
    }
}
getAllCat()