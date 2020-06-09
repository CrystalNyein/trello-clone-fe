const endpoint="http://localhost:8082/";
const searchBtn=document.getElementById("search-trello");
const cross=document.getElementById("cross-btn");
const content= document.getElementById("content");

var lists=[];
window.onload=()=>fetchData();
function fetchData(){
    fetch(endpoint+"list")
    .then(resp=> resp.json())
    .then(data=>{
        lists=data;
        var list=lists.map((list)=>getLists(list)).join("");
        content.innerHTML=list;
    })
    .catch(err=>console.log(err));
}
function addCard(){
    return `<div class="add-card"><p>+&nbsp; Add another card</p><a href="#"><i class="fas fa-folder-plus"></i></a></div></div>`;
}

function getLabel(label){
    return `<hr style="background-color:${label.color}">`;
}

function getCards(card){
    const labelStr= card.labels.map((label)=>getLabel(label)).join("");
    return `<div class="card">${labelStr}
    <span class="edit-card"></span>
    <h4>${card.title}</h4>
    <div class="info"></div>
    <div class="avatar"></div>
</div>`;
}
function getLists(list){
    const cardStr= list.cards.map((card)=>getCards(card,list)).join("");
    return `<div class="list"><div class="title">
    <h3>${list.title}</h3>
    <a href="#"><i class="fas fa-ellipsis-h"></i></a>
    </div><div class="cards">
    ${cardStr}
    </div>`+addCard();
}

searchBtn.addEventListener("focus",(event)=>{
    cross.className="cross";
    console.log("focused");
})


searchBtn.addEventListener("blur",(event)=>{
    cross.classList.remove("cross");
    console.log("blur");
})
