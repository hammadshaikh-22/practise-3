checkAuth();
updateBtn = document.getElementById("updateBtn")
saveBtn = document.getElementById("saveBtn")
var selectedId = ""
document.getElementById("sidebar-container").innerHTML = getSidebar();

console.log(firebase.database())

let categories = getData("categories");
const tableBody = document.getElementById("table-body");
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modal-form");




async function openModal(id = null) {
    document.getElementById("edit-id").value = id || "";
    document.getElementById("modal-title").textContent = id
        ? "Edit Category"
        : "Add Category";
    selectedId = id

    if (id != null) {
        await firebase.database().ref("CATGEORY").child(id).get()
            .then((snapdb) => {
                console.log(snapdb.val())
                document.getElementById("cat-name").value = snapdb.val()["catName"]
                document.getElementById("cat-count").value = snapdb.val()["count"]
                updateBtn.style.display = "inline"
                saveBtn.style.display = "none"

            })
            .catch((e) => {
                console.log(e)
            })
    }
    else {
        document.getElementById("cat-name").value = ""
        document.getElementById("cat-count").value = ""
        updateBtn.style.display = "none"
        saveBtn.style.display = "inline"
    }
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

function edit(id) {
    openModal(id);
}

function del(id) {
    if (confirm("Are you sure?")) {
        categories = categories.filter((c) => c.id !== id);
        setData("categories", categories);
        render();
    }
}


//add new category
async function addNewData() {

    const id = document.getElementById("edit-id").value;
    const name = document.getElementById("cat-name").value;
    const count = document.getElementById("cat-count").value;

    //   push=> make new key => key =>make new key 
    //   set => set data /replace

    // Math.random()*1000=>0,1,2,
    var catKey = firebase.database().ref("CATGEORY").push().getKey() // key generate   5
    // uid => uid

    var object = {
        catName: name,
        count: count,
        catKey: catKey
    }

    console.log(object)

    await firebase.database().ref("CATGEORY").child(catKey).set(object)
    alert("add new category")
    getAllCategory()


    closeModal();
};

async function updateData() {

    // const id = document.getElementById("edit-id").value;
    const name = document.getElementById("cat-name").value;
    const count = document.getElementById("cat-count").value;

    //   push=> make new key => key =>make new key 
    //   set => set data /replace

    // Math.random()*1000=>0,1,2,
    // var catKey = firebase.database().ref("CATGEORY").push().getKey() // key generate   5
    // uid => uid

    var object = {
        catName: name,
        count: count,
        catKey: selectedId
    }

    console.log(object)

    await firebase.database().ref("CATGEORY").child(selectedId).set(object)
    alert("Updated category")
    getAllCategory()


    closeModal();
};


async function getAllCategory() {
    await firebase.database().ref("CATGEORY").get().then((databaseCat) => {

        console.log(databaseCat) //FIREBASE READ FORMATE
        var db = databaseCat.val() //convert firebase data into USER read able formaTE=>ojhect
        if (db == null) {
            tableBody.innerHTML = "<p style = 'text-align: center;'>No categories found</p>"
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
          <td>${data[i].catName}</td>
          <td>${data[i]["count"]}</td>
          
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

getAllCategory()
async function deleteItem(key) {
    await firebase.database().ref("CATGEORY").child(key).remove()
    alert("deleted item")
    getAllCategory()
}

