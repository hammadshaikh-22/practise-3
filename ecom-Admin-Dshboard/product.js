document.getElementById("sidebar-container").innerHTML = getSidebar();
var modal = document.getElementById("modal")
var catSelect = document.getElementById('prod-cat');
var prodName = document.getElementById("prod-name")
var prodCat = document.getElementById("prod-cat")
var prodPrice = document.getElementById("prod-price")
var tableBody = document.getElementById("table-body")

async function addProd() {
    event.preventDefault()
    console.log(prodName.value)
    console.log(prodCat.value)
    console.log(prodPrice.value)

    var imgCheck = await uploadImage()
    if (imgCheck == true) {
        var prodKey = await firebase.database().ref("Products").push().getKey()
        var object = {
            prodName: prodName.value,
            prodCat: prodCat.value,
            prodPrice: prodPrice.value,
            prodImage: prodImageUrl,
            prodKey: prodKey,
        }
        await firebase.database().ref("Products").child(prodKey).set(object)
        alert("Added new product")
        closeModal()
        getAllProduct()
    }
}



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
var status = false
async function uploadImage() {
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
        formdata.append("upload_preset", "STORAGE_ADMIN");

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        var status = false
        await fetch(
            "https://api.cloudinary.com/v1_1/ds1ud4hr4/image/upload",
            requestOptions
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data.secure_url);
                prodImageUrl = data.secure_url;
                status = true
            })
            .catch((error) => console.error(error));
    }
    return status
}


async function getAllProduct() {
    await firebase.database().ref("Products").get().then((databaseCat) => {

        console.log(databaseCat) //FIREBASE READ FORMATE
        var db = databaseCat.val() //convert firebase data into USER read able formaTE=>ojhect
        if (db == null) {
            tableBody.innerHTML = "<p style = 'text-align: center;'>No Product found</p>"
        }
        //object to convert into array

        // Object.values
        // Object.keys
        else {
            var data = Object.values(databaseCat.val())
            // var key = Object.keys(databaseCat.val())
            console.log(data)
            // console.log(key)
            tableBody.innerHTML = ""
            for (var i = 0; i < data.length; i++) {
                console.log(data[i])
                tableBody.innerHTML += `
          <tr>
          <td>${i + 1}</td>
          <td>${data[i].prodName}</td>
          <td>${data[i]["prodCat"]}</td>
          <td>${data[i]["prodPrice"]}</td>
          <td><img src = "${data[i].prodImage}" style ="width : 100px; height : 100px;" ></td>
          <td>
          <button onclick="openModal('${data[i]["catKey"]}')" class = "btn" style = "width: 100px; background-color: yellow; color: black">Edit</button>
          <button onclick="deleteItem('${data[i]["catKey"]}')" class = "btn" style = "width: 100px; background-color: red; color: black; margin-left: 10px;">Delete</button>
          </td>
          </tr>
          `

            }
        }




    })
        .catch((e) => {
            console.log(e)
        })

}

getAllProduct()
getAllCat()