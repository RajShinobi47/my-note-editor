let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

// For the undo redo purpose
let undoRedoTracker = []; // Represents Data
let track = 0; // Represents which actions is to be performed on the tracker array.

let mouseDown = false;

// API 
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// Below methods are static methods, i.e. they are used for static values
// tool.beginPath(); // new graphic (path) (Line)
// tool.moveTo(10, 10); // Line Start Point (start-point)
// tool.lineTo(100, 150); // Line Upto (end-point)
// tool.stroke(); // fill color (fill graphic)

// mousedown -> It will be our start new path
// mousemove -> It will be our path fill (graphics fill)

// This listener is used when the mousedown action is being performed then we need to make a new path with the help of the beginPath function.
canvas.addEventListener("mousedown", (e)=>{
    mouseDown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath", data);
})

// This listener is used when the mousemove action is begin performed then we need to draw the path until the mouseup will occur.
canvas.addEventListener("mousemove", (e) =>{
    if(mouseDown){
        // The data object will contain the x, y position and also the color and width value.
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor: penColor,
            width: eraserFlag ? eraserWidth: penWidth
        };

        // send data to server
        socket.emit("drawStroke", data);
    }
})

// This listener is used when the mouseup will be done it means, the path or the graphics is been drawn and the make 
// the mouseDown flag to false and also store it;s current details in the undoRedoTracker for the undo, redo operation future purpose.
canvas.addEventListener("mouseup", (e) =>{
    mouseDown = false;
    // Undo Redo Code for saving the last time graphic drawn.
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

// undo activity will be -- in the tracker. Limit -> Should not do undo after 0.
undo.addEventListener("click", (e) => {
    if(track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    
    socket.emit("redoUndo", data);

    // undoRedoCanvas(trackObj);
})

// redo activity will be ++ in the tracker. limit -> length of tracker array
redo.addEventListener("click", (e) => {
    if(track < undoRedoTracker.length - 1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("redoUndo", data);
    // undoRedoCanvas(trackObj);
})

// This function is used for the functioning of the UNDO, REDO operation/
function undoRedoCanvas(trackObj){
    // We will again initialize it 
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // From this, new image reference will be created
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height); // parameters (imageElement, x, y, canvasWidth, canvasHeight)
    }

}

// This function is used to start a new path, whose details are passed in strokObj.
function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y); // clientX and clientY are the current mouse click point coordinates
}

// This function is used to draw the path, whose details are passed as strokeObj.
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

// To Select Color of the pencil, we applied for earch loop on the colorElem which will hold color BLACK, RED, BLUE
// and on every color we will add a listener, and whichever is click will be set as the tool strokeStyle color.
pencilColor.forEach((colorElem) =>{
    colorElem.addEventListener("click", (e)=>{
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

// This listener will be used to update the penWidth value according the user choice from value 2 to 10.
pencilWidthElem.addEventListener("change", (e) =>{
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})

// This listener will be used to update the eraserWidth value according to user choice from value 2 to 10.
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

// This listener will be used to erase the content.
eraser.addEventListener("click", (e) =>{
    if(eraserFlag){ // If the eraserFlag is true, then only update tool object strokeStyle and lineWidth with the eraserColor and eraserWidth.
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{ // If eraserFlag is false, then our tool object will automatically update to the pencil color and the pencil width.
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

// This listener will be used to download our current canvas activity.
download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    // Download Image Code
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})