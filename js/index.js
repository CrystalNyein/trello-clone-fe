const endpoint="http://localhost:8082/";
const searchBtn=document.getElementById("search-trello");
const cross=document.getElementById("cross-btn");
const content= document.getElementById("content");
const logo=document.getElementById("logo");
const card=document.querySelector("card");
const memberModal=document.getElementById("memberModal");

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
var accounts=[];
var labels=[];
window.onload=()=>{
    fetchData();
    fetchAccount();
    fetachLabel();
};
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
function fetchAccount(){
    
    setLoading(true);
    fetch(endpoint+"account")
    .then(resp=> resp.json())
    .then(data=>{
        setLoading(false);
        accounts=data;
    })
    .catch(err=>{        
        setLoading(true);
        console.log(err);
    });
}
function fetachLabel(){
    setLoading(true);
    fetch(endpoint+"label")
    .then(resp=> resp.json())
    .then(data=>{
        setLoading(false);
        labels=data;
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


//Open Search Button
searchBtn.addEventListener("focus",(event)=>{
    cross.className="cross";
    document.getElementById("searchModal").style.display="block";
    var searchContent=document.querySelector(".search-content");
    searchContent.innerHTML=`<p>Saved searches</p><p class="link">My Cards <span>@me</span></p><hr><div class="footer"><img src="assets/comb.svg" class="avatar"><p>Refine your search with operators like @member, #label, is:archived, and has:attachments.</p><div class="btn">Learn more</div></div>`;
    console.log("focused");
})


searchBtn.addEventListener("blur",(event)=>{
    cross.classList.remove("cross");    
    document.getElementById("searchModal").style.display="none";
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
  <br>`+getMemAndLabel(card)+`<div class=" desc">
  <h3 class="icon"><i class="fas fa-server"></i>Description<a href="#">Edit</a></h3>`+
  (card.description?`<p class="data">${card.description}</p>`:`<textarea id="desc" class="data" onfocus="openDescFunc(this)" placeHolder="Add a more detailed description"></textarea>
  <div class="desc-func data"><div class="desc-save" onclick="saveDescFunc()">Save</div><div class="desc-cross" onclick="closeDescFunc()"><i class="fas fa-times"></i></div></div>`)+
  `</div>`+getCheckLists(card)+
  `<div class="activity"><div class="title"><h3 class="icon"><i class="fas fa-comment-dots"></i>Activity</h3><div class="detail">Show Details</div></div><div class="comment-line"><img src="assets/Nyein.jpg" alt="Avatar" class="avatar "><div class="comment"><input type="text" placeHolder="Write a comment..." onfocus="writeComment(this)"><div class="func"><div class="func-save"><p onclick="saveComment(this)">Save</p><div class="comment-cross" onclick="closeComment(this)"><i class="fas fa-times"></i></div></div><div class="add-on"><i class="fas fa-paperclip"></i><i class="fas fa-at"></i><i class="far fa-smile-beam"></i><i class="far fa-credit-card"></i></div></div></div></div></div>`+aside(card.title,list.title,card.position);
//   +((card.members.length==0)?``:`<p class="data">Members</p><img src="assets/Nyein.jpg" alt="Avatar" class="avatar data">`);
    cardModal.style.display = "block";
}

//Get Member and Label for modal-content
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
    if(name.length>1)
    name=name.reduce((a,b)=>a.charAt(0)+b.charAt(0));
    else 
    name=name[0].substring(0,2);
    console.log(name);
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

//Get CheckList for Modal
function getCheckLists(card){
    if(card.checkList.length!=0){
        const checkStr=card.checkList.map((checklist)=>getChecklist(checklist)).join('');
        return `<div class="checklist"><h3 class="icon"><i class="fas fa-tasks"></i>${card.checkList[0].title}</h3>${checkStr}</div>`;
    }
    else{
        return ``;
    }

}
function getChecklist(checklist){
    return `
    <div class="check">
      <input type="checkbox" class="checkbox"`+(checklist.checked?`checked`:``)+` >
      <textarea class="item" onfocus="editCheckItem(this)" spellcheck="false"  >${checklist.item}</textarea>
      <div class="check-func data"><div class="check-save" onclick="saveCheckFunc(this)">Save</div><div class="check-cross" onclick="closeCheckFunc(this,'${checklist.item}')"><i class="fas fa-times"></i></div></div>
      <span class="checkmark"></span>
    </div>`;
}

//Add additional functions aside
function aside(cardName,listName,position){
    return `<div class="aside">
    <div class="add-to-card"><h5>Add to card</h5>
    <a href="#" onclick="openMemberModal()"><i class="fas fa-user"></i>&nbsp;&nbsp;&nbsp;Members</a>
    <a href="#" onclick="openLabelModal()"><i class="fas fa-tag"></i>&nbsp;&nbsp;&nbsp;Labels</a>
    <a href="#" onclick="openChecklistModal()"><i class="fas fa-tasks"></i>&nbsp;&nbsp;&nbsp;Checklist</a>
    <a href="#" onclick="openDueDateModal()"><i class="far fa-clock"></i>&nbsp;&nbsp;&nbsp;Due Date</a>
    <a href="#" onclick="openAttachmentModal()"><i class="fas fa-paperclip"></i>&nbsp;&nbsp;&nbsp;Attachment</a>
    <a href="#" onclick="openCoverModal()"><i class="fas fa-image"></i>&nbsp;&nbsp;&nbsp;Cover</a></div>
    <div class="power-ups"><h5>Power-ups</h5><a href="#"><i class="fas fa-concierge-bell"></i>&nbsp;&nbsp;&nbsp;Butler Tips (2)</a><a href="#" style="text-align:center;">Get more power-ups</a></div>
    <div class="actions"><h5>Actions</h5><a href="#" onclick="openMoveCardModal('${listName}','${position}')"><i class="fas fa-arrow-right"></i>&nbsp;&nbsp;&nbsp;Move</a>
    <a href="#" onclick="openCopyCardModal('${cardName}','${listName}','${position}')"><i class="far fa-copy"></i>&nbsp;&nbsp;&nbsp;Copy</a><a href="#"><i class="fas fa-file-invoice"></i>&nbsp;&nbsp;&nbsp; Make Template</a><a href="#"><i class="far fa-eye"></i>&nbsp;&nbsp;&nbsp;Watch</a><hr><a href="#"><i class="far fa-file-archive"></i>&nbsp;&nbsp;&nbsp; File Archive</a><a href="#" onclick="openShareModal()"><i class="fas fa-share"></i>&nbsp;&nbsp;&nbsp;Share</a></div>
    </div>`
}

// When the user clicks on <span> (x), close the modal
function closeModal(){
  cardModal.style.display = "none";
}

//edit item in checkList
function editCheckItem(event){
    var checkFunc=event.nextElementSibling;
    checkFunc.style.display="block";
}

function closeCheckFunc(event,checklist){
    console.log(checklist);
    event.parentNode.parentNode.querySelector("textarea").value=checklist;
    event.parentNode.style.display="none";
}
function saveCheckFunc(event){
    event.parentNode.style.display="none";
}

// Open Description Function
function openDescFunc(event){
    var descFunc=event.nextElementSibling;
    descFunc.style.display="block";
}
function closeDescFunc(){
    var descFunc=document.querySelector(".desc-func")
    descFunc.style.display="none";
};


//Write Comment section
function writeComment(event){
    event.parentNode.style.height="80px";
    setTimeout(function(){event.nextElementSibling.style.display="flex"},190);
}
function closeComment(event){
    event.parentNode.parentNode.parentNode.style.height="38.667px";
    event.parentNode.parentNode.style.display="none";

}
function saveComment(event){
    event.parentNode.parentNode.parentNode.style.height="38.667px";
    event.parentNode.parentNode.style.display="none";
}

//Open member modal
function openMemberModal(){
    const accStr=accounts.map((acc)=>getAccount(acc)).join('');
    document.getElementById("memberModal").style.display="block";
    var memContent=document.querySelector(".mem-content");
    memContent.innerHTML=`<span class="close" onclick="closeMemberModal()">&times;</span>
    <h3>Members</h3><hr><input type="text" placeHolder="Search members"><p>Board members</p><div class="members">${accStr}</div>`;
}

function closeMemberModal(){
    document.getElementById("memberModal").style.display="none";

}

function getAccount(acc){
    var name=acc.name.split(' ');
    name=name.reduce((a,b)=>a.charAt(0)+b.charAt(0));
    return `<div class="avatar">${name}</div>`;
}

//open label modal
function openLabelModal(){
    const labelStr=labels.map((label)=>getLabelForModal(label)).join('');
    document.getElementById("labelModal").style.display="block";
    var labelContent=document.querySelector(".label-content");
    labelContent.innerHTML=`<span class="close" onclick="closeLabelModal()">&times;</span>
    <h3>Labels</h3><hr><input type="text" placeHolder="Search labels..."><p>Labels</p><div class="labelsInModal">${labelStr}</div><div class="long-btn">Create a new label</div><hr><div class="long-btn">Enable color blind friendly mood</div>`;
}

function closeLabelModal(){
    document.getElementById("labelModal").style.display="none";
}

function getLabelForModal(label){
    return `<div class="labelInModal" ><p style="background-color:${label.color}"><span class="darken"></span>${label.name}</p><i class="fas fa-pen"></i></div>`;
}

//open Checklist modal
function openChecklistModal(){
    document.getElementById("checklistModal").style.display="block";
    var checklistContent=document.querySelector(".checklist-content");
    checklistContent.innerHTML=`<span class="close" onclick="closeChecklistModal()">&times;</span>
    <h3>Add Checklist</h3><hr><p class="input-label">Title</p><input type="text" placeHolder="Search labels..."><p class="input-label">Copy Items From...</p><select><option>(None)</option></select><input type="button" class="btn" value="Add">`;
}

function closeChecklistModal(){
    document.getElementById("checklistModal").style.display="none";
}

//open DueDate Modal
function openDueDateModal(){
    var date=new Date();
    date.setDate(date.getDate()+1);
    var day=date.toISOString().split('T')[0];
    document.getElementById("dueDateModal").style.display="block";
    var dueDateContent=document.querySelector(".dueDate-content");
    dueDateContent.innerHTML=`<span class="close" onclick="closeDueDateModal()">&times;</span>
    <h3>Change Due Date</h3><hr><p class="input-title">Date</p><input type="date" value="${day}"><p class="input-title">Time</p><input type="time" value="00:00"><p class="input-title">Set Reminder</p><select><option>1 Day Before</option></select><p class="warning">Reminders will be sent to all members and watchers of this card.</p><div class="func"><input type="button" class="btn" value="Save"><input type="button" class="btn remove" value="Remove"></div>`;
}

function closeDueDateModal(){
    document.getElementById("dueDateModal").style.display="none";
}

//open Attachment Modal
function openAttachmentModal(){
    document.getElementById("attachmentModal").style.display="block";
    var attachmentContent=document.querySelector(".attachment-content");
    attachmentContent.innerHTML=`<span class="close" onclick="closeAttachmentModal()">&times;</span>
    <h3>Attach From...</h3><hr><p class="link">Computer</p><p class="link">Trello</p><p class="link">Google Drive</p><p class="link">Dropbox</p><p class="link">Box</p><p class="link">One Drive</p><hr><p class="input-title">Attach a link</p><input type="text" placeHolder="Paste any link here..."></input><input type="button" class="btn" value="Attach"><hr><p class="tips">Tip: With <a href="#">Power-Ups</a>, you can attach conversations from Slack, pull requests from GitHub, and leads from Salesforce.</p>`;
}

function closeAttachmentModal(){
    document.getElementById("attachmentModal").style.display="none";
}

//open Cover Modal
function openCoverModal(){
    document.getElementById("coverModal").style.display="block";
    var coverContent=document.querySelector(".cover-content");
    coverContent.innerHTML=`<span class="close" onclick="closeCoverModal()">&times;</span>
    <h3>Cover</h3><hr><p>Size</p><div class="size"><i class="fas fa-image"></i><i class="far fa-image"></i></div><p>Colors</p><div class="color"><div style="background-color:green; "></div><div style="background-color:yellow; "></div><div style="background-color:orange; "></div><div style="background-color:cyan; "></div><div style="background-color:brown; "></div><div style="background-color:blue; "></div><div style="background-color:violet; "></div><div style="background-color:red; "></div></div><p>Attachments</p><div class="long-btn">Upload a Cover Image</div><p class="tips">Tip: Drag an image on to the card to upload it.</p><p>Unsplash</p><div class="unsplash"><div class="flex"> <img src="assets/unsplash-01.jpg"><span></span></div><div class="flex"> <img src="assets/unsplash-02.jpg"><span></span></div><div class="flex"> <img src="assets/unsplash-03.jpg"><span></span></div><div class="flex"> <img src="assets/unsplash-04.jpg"><span></span></div></div><div class="long-btn">Search for photos</div>`;
}

function closeCoverModal(){
    document.getElementById("coverModal").style.display="none";
}

//open move card modal

function openMoveCardModal(listName,position){
    document.getElementById("moveCardModal").style.display="block";
    var moveCardContent=document.querySelector(".moveCard-content");
    moveCardContent.innerHTML=`<span class="close" onclick="closeMoveCardModal()">&times;</span>
    <h3>Move Card</h3><hr><p>Select destination</p><div class="board block"><p>Board</p><p>FE - Common</p></div><div class="list block"><p>List</p><p>${listName}</p></div><div class="pos block"><p>Position</p><p>${position}</p></div><input type="button" class="btn" value="Save">`;
}

function closeMoveCardModal(){
    document.getElementById("moveCardModal").style.display="none";
}

//open copy card modal

function openCopyCardModal(cardName,listName,position){
    document.getElementById("copyCardModal").style.display="block";
    var copyCardContent=document.querySelector(".copyCard-content");
    copyCardContent.innerHTML=`<span class="close" onclick="closeCopyCardModal()">&times;</span>
    <h3>Copy Card</h3><hr><p class="input-title">Title</p><textarea>${cardName}</textarea>
    <p class="input-title">Keep...</p>
    <label class="container">Checklists
    <input type="checkbox" checked>
    <span class="checkmark"></span>
  </label>
  <label class="container">Labels
    <input type="checkbox" checked>
    <span class="checkmark"></span>
  </label>
  <label class="container">Members
    <input type="checkbox" checked>
    <span class="checkmark"></span>
  </label>
  <label class="container" style="margin-bottom:15px">Attachments
    <input type="checkbox" checked>
    <span class="checkmark"></span>
  </label>
    <p class="input-title">Copy to...</p><div class="board block"> <p>Board</p><p>FE - Common</p></div><div class="list block"><p>List</p><p>${listName}</p></div><div class="pos block"><p>Position</p><p>2</p></div><input type="button" class="btn" value="Create Card">`;
}

function closeCopyCardModal(){
    document.getElementById("copyCardModal").style.display="none";
}

//open share modal

function openShareModal(listName,position){
    document.getElementById("shareModal").style.display="block";
    var shareContent=document.querySelector(".share-content");
    shareContent.innerHTML=`<span class="close" onclick="closeShareModal()">&times;</span>
    <h3>Share and More...</h3><hr><p class="link">Print...</p><p class="link">Export JSON</p><hr><p class="input-title">Link to this card <i class="far fa-user"></i></p><input type="text" value="https://trello.com/c/9Ms4YVYL"><p class="input-title">Embed this card</p><input type="text" value='<blockquote class="trello-card"><a href="https://trello.com/c/9Ms4YVYL/18-html-css">HTML/CSS</a></blockquote><script src="https://p.trellocdn.com/embed.min.js"></script>'><p class="input-title">Email for this card</p><input type="text" value="nyeinchanlay+2u61zc894hzvpu98ujs+2u6ho8ajs2itj5sh8eh+028u2s2584@boards.trello.com"><p class="footer">Emails sent to this address will appear as a comment by you on the card</p><hr><p  class="footer">Card #18&nbsp;Added 16 Apr at 21:04 - <a href="#">Delete</a></p>`;
}

function closeShareModal(){
    document.getElementById("shareModal").style.display="none";
}
