const endpoint="http://localhost:8082/";
const searchBtn=document.getElementById("search-trello");
const pin=document.getElementById("pin-btn");
const cross=document.getElementById("cross-btn");
searchBtn.addEventListener("focus",(event)=>{
    pin.className="pin";
    cross.className="cross";
    console.log("focused");
})

function close(){
    console.log("pinned");
    searchBtn.blur();
    pin.classList.remove("pin");
    cross.classList.remove("cross");
}
searchBtn.addEventListener("blur",(event)=>{
    pin.classList.remove("pin");
    cross.classList.remove("cross");
    console.log("blur");
})
pin.addEventListener("click",(event)=>{
    console.log("Pin is clicked.")
})

(()=>{
    fetch(endpoint+"account")
    .then(resp=> resp.json())
    .then(data=>{
        console.log(data);
    })
    .catch(err=>console.log(err));
})();