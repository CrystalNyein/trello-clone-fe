const endpoint="http://localhost:8082/";
const searchBtn=document.getElementById("search-trello");
const cross=document.getElementById("cross-btn");
const content= document.getElementById("content");
const logo=document.getElementById("logo");
const cardModel=document.getElementById("cardModel");
const card=document.querySelector("card");
function setLoading(load){
    if(!load){
        logo.classList.remove("loader");
        logo.innerHTML='<a href="#"><i class="far fa-clipboard"></i> Trello</a>';
        logo.classList.add("logo");
    }
    else{
        logo.innerHTML='<div class="preloader-1"><span class="line line-1"></span><span class="line line-2"></span><span class="line line-3"></span><span class="line line-4"></span><span class="line line-6"></span><span class="line line-7"></span><span class="line line-8"></span><span class="line line-9"></span></div>';
        logo.classList.remove("logo");
        logo.classList.add("loader");
    }
}
var lists=[];
window.onload=()=>fetchData();
function fetchData(){
    setLoading(true);
    fetch(endpoint+"list")
    .then(resp=> resp.json())
    .then(data=>{
        setLoading(false);
        lists=data;
        var list=lists.map((list)=>getLists(list)).join("")+addList();
        content.innerHTML=list;
    })
    .catch(err=>{
        setLoading(true);
        console.log(err);
    });
}
function addCard(){
    return `<div class="add-card"><p>+&nbsp; Add another card</p><a href="#"><i class="fas fa-folder-plus"></i></a></div></div>`;
}
function addList(){
    return `<div class="list add-list"><p>+&nbsp;&nbsp; Add another list</p><div>`;
}

function getLabels(label){
    return `<hr style="background-color:${label.color}">`;
}

function getCards(card){
    const labelStr= card.labels.map((label)=>getLabels(label)).join("");
    return `<div class="card" card-id="${card.id}" onclick="openCardModal(event)">${labelStr}
    <span class="edit-card"></span>
    <h4>${card.title}</h4>
    <div class="info"></div>
    <div class="avatar"></div>
</div>`;
}

function getLists(list){
    const cardStr= list.cards.map((card)=>getCards(card,list)).join("");
    return `<div class="list" list-id="${list.id}"><div class="title">
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

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
function openCardModal(event){
    event.preventDefault();    
    var cardId=event.target.getAttribute("card-id");
    var listId=event.target.parentNode.parentNode.getAttribute("list-id");
    var list=lists.find((l)=>l.id==listId);
    var card=list.cards.find((c)=>c.id==cardId);
    var modalContent=document.querySelector(".modal-content");
    console.log(card);
  modalContent.innerHTML=`
  <span class="close" onclick="closeModal()">&times;</span>
  <h3 class="icon"><i class="far fa-credit-card"></i>${card.title}</h3>
  <p class="data">in list <a href="#">${list.title}</a></p>
  <br>`+getMemAndLabel(card);
//   +((card.members.length==0)?``:`<p class="data">Members</p><img src="assets/Nyein.jpg" alt="Avatar" class="avatar data">`);
    cardModal.style.display = "block";
}

function getMemAndLabel(card){
    const memStr=card.members.map((mem)=>getMem(mem)).join('')+addMem();
    const labelStr=card.labels.map((label)=>getLabel(label)).join('')+addLabel();
    const mem=`<div class="mem"><p>Members</p><div class="members">${memStr}</div></div>`;
    const label=`<div class="label"><p>Labels</p><div class="labels">${labelStr}</div></div>`;
    if(card.members.length!=0 && card.labels.length!=0){
        return `<div class="mem-label data">${mem}${label}</div>`;
    }
    else if(card.members.length!=0){
        return `<div class="mem-label data">${mem}</div>`;
    }
    else if(card.labels.length!=0){
        return `<div class="mem-label data">${label}</div>`;
    }
    else{
        return '';
    }
}

function getMem(mem){
    var name=mem.name.split(' ');
    name=name.reduce((a,b)=>a.charAt(0)+b.charAt(0));
    return `<div class="memInline"><div class="avatar">${name}</div></div>`;
}

function getLabel(label){
    return `<div class="labelInline"><div class="lab" style="background-color:${label.color}">${label.name}</div></div>`;
}

function addMem(){
    return `<div class="memInline"><div class="avatar addMem"><i class="fas fa-plus"></i></div></div>`;
}
function addLabel(){
    return `<div class="labelInline"><div class="lab addLab"><i class="fas fa-plus"></i></div></div>`;
}


// When the user clicks on <span> (x), close the modal
function closeModal(){
  cardModal.style.display = "none";
}