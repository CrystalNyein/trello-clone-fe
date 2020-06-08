const endpoint="http://localhost:8082/";
const searchBtn=document.getElementById("search-trello");
const pin=document.getElementById("pin-btn");
const cross=document.getElementById("cross-btn");
var lists=[];
window.onload=()=>fetchData();
function fetchData(){
    fetch(endpoint+"list")
    .then(resp=> resp.json())
    .then(data=>{
        lists=data;
        console.log(data);
        console.log(lists[0].cards[0].title);
    })
    .catch(err=>console.log(err));
}
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
