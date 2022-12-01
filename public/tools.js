// This will be used for our tools-cont showing purpose
let toolsCont = document.querySelector(".tools-cont");

// This will be used for the option bar purpose
let optionsCont = document.querySelector(".options-cont");

// This is for the pencil and eraser tool option showing.
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");

// This is for sticky notes purpose
let sticky = document.querySelector(".sticky");

// This if for the note upload purpose
let upload = document.querySelector(".upload");

// For animation purpose of the pencil and eraser tool
let pencilFlag = false;
let eraserFlag = false;


let optionsFlag = true; // True, means options icon is been active

// true -> tools show, flase -> hide tools

// By clicking on the option icon, we have to toggle it to cross icon, and if cross is here, then toggle it to options
optionsCont.addEventListener("click", (e) =>{
    optionsFlag = !optionsFlag;

    if(optionsFlag) 
        openTools();
    else
        closeTools();
})

function openTools(){
    let iconElem = optionsCont.children[0]; //As in the options-cont there is single element and that is icon so we can access it with the optionsCont.children[0]
    iconElem.classList.remove("fa-times"); // if fa-time
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex"; // flex is there because our tools-cont class display is flex.
}
function closeTools(){
    let iconElem = optionsCont.children[0]; //As in the options-cont there is single element and that is icon so we can access it with the optionsCont.children[0]
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsCont.style.display = "none"; // When we want to hide the toolsCont then simple type none.
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) =>{
    //true -> show pencil tool, false -> hide pencil tool
    pencilFlag = !pencilFlag;

    if(pencilFlag){
        pencilToolCont.style.display = "block"; // In css, if we had not displayed the block or flex, by default it is considered as block.
    }else{
        pencilToolCont.style.display = "none";
    }
});

eraser.addEventListener("click", (e) => {
    //true -> show eraser tool, false -> hide eraser tool
    eraserFlag = !eraserFlag;

    if (eraserFlag) {
        eraserToolCont.style.display = "flex"; // In css, if we had not displayed the block or flex, by default it is considered as block.
    } else {
        eraserToolCont.style.display = "none";
    }
});

upload.addEventListener("click", (e) =>{

    // For file uploading file from the file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src = "${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })

})

sticky.addEventListener("click", (e) =>{
    let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck="false"></textarea>
        </div>
    `;
    createSticky(stickyTemplateHTML);
});


function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");

    noteActions(minimize, remove, stickyCont);

    // Drag and Drop Logic
    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}


function noteActions(minimize, remove, stickyCont){
    remove.addEventListener("click", (e) =>{
        stickyCont.remove();
    })

    // For minimize logic, we simply have to toggle the note container present in the parent sticky-cont
    minimize.addEventListener("click", (e) =>{
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display"); // this will give us the current display value property value of the note-cont.
        if(display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}

function dragAndDrop(element, event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    moveAt(event.pageX, event.pageY);
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
};
