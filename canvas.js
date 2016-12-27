var raindrops = [];
var collisionEnabled = true;
var limit = false;
var collisionCheckbox;
var count = 1;
var slider;
var lightning;
var opacity = 255;
var branches;
var blocksArray = [];
var blockScale = 16;
var dontDelete = false;
var colFirstBlock = true;
var menuDiv;
var ip = "http://116.240.152.165:9876";
var menuOpened = false;
var colMinX, colMaxX, colMinY, colMaxY;
var db, nameInput;
var allEntries;
// var gravity = 0.1;
var connected = false;
var socket;
var isPlaying = false;
var players = [];
var playerName;
var cursorUrl = "https://raw.githubusercontent.com/343N/raintest-mp/master/cursor.png";
var cursorImage, cursorLoaded;
var col = { r: 0, g: 0, b: 0 };
var playerName = "dicks";
var dialogueBox, dialogueText, submitButton;

function setup() {
    //noLoop();
    cursorLoaded = false;
    // isPlaying = true;
    loadImage(cursorUrl, function(img) {
        cursorImage = img;
        console.log("Loaded");
        cursorLoaded = true;
    });
    sizeX = $(window).width();
    sizeY = $(window).height();
    createCanvas(sizeX, sizeY - 40);
    initialCount = sizeX * 4;
    count = sizeX * 4;
    slider = createSlider(0, sizeX * 4, sizeX / 8);
    gravitySlider = createSlider(0, 10, .1, .01);
    sizeSlider = createSlider(1, 64, 16, 1);
    fillerDiv = createDiv();
    fillerDiv.id('fillerDiv');
    fillerDiv.html('Draw with your friends!');
    // saveButton.id('saveButton');
    // saveButton.mouseClicked(saveDrawing);
    // saveButton.html(`Save drawing as`);




    dialogueBox = createDiv('');
    dialogueBox.id('dialogueBox');
    dialogueText = createDiv('');
    dialogueText.html('Connecting...');
    dialogueText.id('dialogueText');
    dialogueText.parent('#dialogueBox');


    // submitButton = createDiv('Join!');
    // submitButton.style('display','none');
    // nameInput.parent('#dialogueBox');





    // menuDiv.mouseClicked();
    // saveButton.parent('#menuDiv');
    // nameInput.parent('#menuDiv');
    // copyDiv = createDiv(0, 0, sizeX, 64);
    // copyDiv.style('background-color', '#BDBDBD');
    // copyDiv.style('color', 'black');

    // copyDiv.style('text-align', 'center');
    // copyDiv.style('border', '0');
    // copyDiv.style('width', '100%');
    // copyDiv.style('height', '32px');
    // copyDiv.style('font-family', 'sans-serif')
    // copyDiv.mousePressed(saveDrawingToString);
    // copyDiv.changed(setNewDrawing);
    // copyDiv.html('Clear drawing.');
    clearButton = createDiv();
    clearButton.id('clearButton');
    clearButton.html('Clear Drawing');
    clearButton.mouseClicked(clearDrawing);
    collisionCheckbox = createCheckbox('Enable Collision', true);
    collisionCheckbox.changed(toggleCollision);
    // translate(0,);
    for (var i = 0; i < initialCount; i++) {
        raindrops.push(new Raindrop);
    }
    // frameRate(4)

    connectToServer();


    // slider.input(rainChanged);


    setInterval(sendCursorLoc, 100);



}


function connectToServer() {
    socket = io.connect(ip);

    // connected = ;
    socket.on('addBlock', function(data) {
        blocksArray.push(new Block(data.x, data.y, data.scale, data.r, data.g, data.b));
    });
    socket.on('removeBlock', function(data) {
        blocksArray.splice(i, 1);
    });
    socket.on('addInitialBlocks', function(data) {
        blocksArray = [];
        for (var i = 0; i < data.length; i++) {
            blocksArray.push(new Block(data[i].x, data[i].y, data[i].scale, data[i].r, data[i].g, data[i].b));
        }
    });
    socket.on("connect_error", function(){
      dialogueText.html(`Cant connect! Retrying... <br><br><span style="font-size: 1.25vw">Pester 343N if this keeps failing and you have internet access.</span>`);
      players = [];
      isPlaying = false;
      playerName = "Unnamed";
    })
    socket.on('clearDrawing', function() {
      blocksArray = [];
    });
    socket.on('connect', function() {

        count = 200;
        col['r'] = random(192,255);
        col['g'] = random(192,255);
        col['b'] = random(192,255);
        connected = true;
        dialogueText.html(`Set your name:`);

        nameInput = createInput('Unnamed');
        nameInput.style('display','inline');
        nameInput.id('nameInput');
        nameInput.parent('#dialogueBox');

        submitButton = createDiv('Join!');
        submitButton.id('submitButton');
        submitButton.parent('#dialogueBox');
        submitButton.mouseClicked(startPlaying);
        // submitButton.style('display','inline');
    });
    socket.on('disconnect', function() {
        isPlaying = false;
        playerName = "Unnamed";
        players = [];
        count = 0;
        connected = false;
        dialogueText.html(`Cant connect! Retrying... <br><br><span style="font-size: 1.25vw">Pester 343N if this keeps failing and you have internet access.</span>`);
        dialogueBox = createDiv('');
        dialogueBox.id('dialogueBox');
        dialogueText = createDiv('');
        dialogueText.html('Connecting...');
        dialogueText.id('dialogueText');
        dialogueText.parent('#dialogueBox');
    });

    socket.on('deletePlayer', function(data) {
        console.log('deleting player!');
        for (var i = 0; i < players.length; i++) {
            if (players[i].id === data) {
                players.splice(i, 1);
                break;
            }
        }
    });

    socket.on('recieveMouseLocation', updateCursor);
}

function startPlaying(){
  if (nameInput.value().length > 0 && nameInput.value().length < 30){
    playerName = nameInput.value();
    dialogueBox.remove();
    dialogueText.remove();
    nameInput.remove();
    submitButton.remove();
    isPlaying = true;
  } else{
    dialogueText.html('Name must be between 1 and 20 characters');
  }
}

function sendCursorLoc() {
    if (isPlaying) {
        var sendInfo = {
            mouseX: mouseX,
            mouseY: mouseY,
            name: playerName,
            col: col

        }
        socket.emit('recieveMouseLocation', sendInfo);
    }
}

function clearDrawing(){
  socket.emit('clearDrawing');
  blocksArray = [];
}

function updateCursor(data) {
    // console.log('cursor?')
    var playerExists = false;
    for (var i = 0; i < players.length; i++) {
        if (players[i].id === data.id) {
            playerExists = true;
            break;
        }
    }
    if (playerExists) {
        players[i].y = data.y;
        players[i].x = data.x;

        // print(players[i].oldX, players[i].oldY, data.x, data.y)
        // console.log('cursor updated');
        // console.log(players[i].x);
        // console.log(players[i].y);
    } else {
      var newData = data;
      data['oldX'] = data.x;
      data['oldY'] = data.y;
      players.push(data);
        // console.log('cursor added');
        // console.log(newData);
    }
}

function drawCursors() {
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        p.oldX = lerp(p.oldX, p.x, .25);
        p.oldY = lerp(p.oldY, p.y, .25);

        // console.log(p.x + " " + lerpY + "\n" + p.x  + " " + p.y + "\n" + p.oldX + " "+ p.oldY )

        // noStroke();
        if (!cursorLoaded) {
            fill(p.col.r, p.col.g, p.col.b);
            ellipse(p.oldX, p.oldY, 16);
            textAlign(CENTER);
            text(p.name, p.oldX + 7, p.oldY + 46);
        } else {
            // print(p);
            tint(p.col.r,p.col.g,p.col.b,192);
            image(cursorImage, p.oldX, p.oldY);
            textAlign(CENTER);
            fill(255, 128);
            text(p.name, p.oldX + 7, p.oldY + 32);
        }

    }
}

function toggleCollision() {
    if (this.checked()) {
        collisionEnabled = true;
    } else {
        collisionEnabled = false;
    }
}





function mouseClicked() {
    if (isPlaying) {
        for (var i = 0; i < blocksArray.length; i++) {
            if (mouseX > blocksArray[i].x &&
                mouseX < blocksArray[i].x + blocksArray[i].scale &&
                mouseY > blocksArray[i].y &&
                mouseY < blocksArray[i].y + blocksArray[i].scale && !dontDelete) {
                blocksArray.splice(i, 1);
                socket.emit('removeBlock', i);
                spaceIsAlreadyOccupied = true;
                sendCursorLoc();
                break;
            }
        }
    }
    // if (blocksArray.length === 1 && !dontDelete) {
    //   if (mouseX > blocksArray[0].x &&
    //       mouseX < blocksArray[0].x + blocksArray[0].scale &&
    //       mouseY > blocksArray[0].y &&
    //       mouseY < blocksArray[0].y + blocksArray[0].scale){
    //         blocksArray.splice(i, 1);
    //       }
    // }
    dontDelete = false;

}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {

    slider.position((sizeX / 8) * 3, sizeY - (sizeY / 6));
    slider.size((sizeX / 8) * 2);
    sizeSlider.position((sizeX / 3) * 2, sizeY - (sizeY / 6));
    sizeSlider.size((sizeX / 8) * 1);

    collisionCheckbox.position((sizeX / 8) * 7, sizeY - (sizeY / 6));
    collisionCheckbox.size(20, 20);

    gravitySlider.position((sizeX / 8), sizeY - (sizeY / 6));
    gravitySlider.size((sizeX / 8));
    // textposition((sizeX / 8) * 3, sizeY - (sizeY/7));
    // textAlign(CENTER);
    sizeX = $(window).width();
    sizeY = $(window).height();
    count = slider.value()
    gravity = gravitySlider.value();
    background(0);
    wind = (mouseX - (sizeX / 2)) / (sizeX / 2) * 10;
    wind = -wind
    blockScale = sizeSlider.value();
    // fill(0);
    textSize(16);
    stroke(255);
    strokeWeight(1);
    textAlign(LEFT);
    text("Raindrop Count: " + Math.round(slider.value()), (sizeX / 8) * 3, sizeY - (sizeY / 7));
    text("Brush size: " + Math.round(sizeSlider.value()) + " px", (sizeX / 3) * 2, sizeY - (sizeY / 7));
    text("Gravity: " + Math.round(gravitySlider.value() * 100) / 100, (sizeX / 8), sizeY - (sizeY / 7));
    text("FPS: " + Math.floor(frameRate()), 0, height - 16);



    // text("Collision: " + collisionEnabled, (sizeX/8)*7, sizeY - (sizeY / 6));

    // console.log(gravitySlider.mouseOver());
    if (mouseIsPressed && isPlaying) {
        var x = mouseX % blockScale;
        x = mouseX - x;
        var y = mouseY % blockScale;
        y = mouseY - y;
        var spaceIsAlreadyOccupied = false;
        // console.log(gravitySlider.size());


        // if (blocksArray[i].x == x && blocksArray[i].y == y) {
        //
        // }
        for (var i = 0; i < blocksArray.length; i++) {
            if (y === blocksArray[i].y && x === blocksArray[i].x) {
                spaceIsAlreadyOccupied = true;
                break;
            }
        }
        if (mouseX > gravitySlider.position().x &&
            mouseX < gravitySlider.position().x + gravitySlider.size().width &&
            mouseY > gravitySlider.position().y - (slider.size().height * .5) &&
            mouseY < gravitySlider.position().y + (gravitySlider.size().height * 1.5)) {
            // console.log('a');
            spaceIsAlreadyOccupied = true;
        } else if (mouseX > sizeSlider.position().x &&
            mouseX < sizeSlider.position().x + sizeSlider.size().width &&
            mouseY > sizeSlider.position().y - (slider.size().height * .5) &&
            mouseY < sizeSlider.position().y + (sizeSlider.size().height * 1.5)) {
            spaceIsAlreadyOccupied = true;
        } else if (mouseX > slider.position().x &&
            mouseX < slider.position().x + slider.size().width &&
            mouseY > slider.position().y - (slider.size().height * .5) &&
            mouseY < slider.position().y + (slider.size().height * 1.5)) {
            spaceIsAlreadyOccupied = true;
        }
        if (mouseY < 8) {
            spaceIsAlreadyOccupied = true;
        }

        if (!spaceIsAlreadyOccupied) {
            dontDelete = true;
            var newBlock = new Block(x, y, blockScale, random(255), random(255), random(255));
            blocksArray.push(newBlock);
            socket.emit('addBlock', newBlock);
            sendCursorLoc();
            if (colFirstBlock) {
                colMinX = x;
                colMinY = y;
                colMaxX = x + blockScale;
                colMaxY = y + blockScale;
                colFirstBlock = false;
            }
            if (x < colMinX) {
                colMinX = x;
            }
            if (y < colMinY) {
                colMinY = y;
            }
            if (x + blockScale > colMaxX) {
                colMaxX = x + blockScale;
            }
            if (y + blockScale > colMaxY) {
                colMaxY = y + blockScale;
            }
            // console.log(y);
            // console.log(x);
        }
    }

    try {
        if (random(1) < ((count / initialCount) / 20)) {
            lightning = new Lightning(sizeX, sizeY);
            opacity = 255;
            // console.log("tried showing branches");

        }
        if (opacity > 0) {
            for (var i = 0; i < lightning.oldEndsX().length; i++) {
                stroke(125, 249, 255, opacity);
                // strokeWidth(1);
                line(lightning.oldEndsX()[i],
                    lightning.oldEndsY()[i],
                    lightning.newEndsX()[i],
                    lightning.newEndsY()[i]);
                opacity -= .05;
            }
        }

        // lightning.show()

    } catch (err) {
        // console.log(err);
    }

    for (var i = 0; i < blocksArray.length; i++) {
        blocksArray[i].show();
    }

    if (connected) {
        for (var i = 0; i < count; i++) {

            raindrops[i].fall();
            raindrops[i].show();
            // raindrops[i].log();
        }
    }
    drawCursors();
}
