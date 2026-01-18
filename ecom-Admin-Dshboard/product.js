document.getElementById("sidebar-container").innerHTML = getSidebar();

async function getAllCat() {
    
    await firebase.database().ref("CATGEORY").get()
    .then((snap)=>{
        console.log(snap.val())
        allCat = Object.values(snap.val())
        console.log(allCat)
    })
    .catch((e) =>{
        console.log(e)
    })
}


getAllCat()