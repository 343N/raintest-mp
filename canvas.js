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
var cursorUrl = "https://my.mixtape.moe/lxdjxj.png";
var cursorImage, cursorLoaded;

function setup() {
    //noLoop();
    cursorLoaded = false;
    isPlaying = true;
    loadImage(cursorUrl, function(img) {
        cursorImage = img;
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
    loginDiv = createDiv();
    saveButton = createDiv();
    // saveButton.id('saveButton');
    // saveButton.mouseClicked(saveDrawing);
    // saveButton.html(`Save drawing as`);
    nameInput = createInput('Unnamed');
    //nameInput.id('nameInput');

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
        for (var i = 0; i < data.length; i++) {
            blocksArray.push(new Block(data[i].x, data[i].y, data[i].scale, data[i].r, data[i].g, data[i].b));
        }
    });
    socket.on('connect', function() {
        count = 200;
        connected = true;
    });
    socket.on('disconnect', function() {
        count = 0;
        connected = false;
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

function sendCursorLoc() {
    if (isPlaying) {
        var sendInfo = {
            mouseX: mouseX,
            mouseY: mouseY,
            name: playerName
        }
        socket.emit('recieveMouseLocation', sendInfo);
    }
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
        // console.log('cursor updated');
        // console.log(players[i].x);
        // console.log(players[i].y);
    } else {
        var newData = data;
        newData['r'] = random(100, 255);
        newData['g'] = random(100, 255);
        newData['b'] = random(100, 255);
        // console.log('cursor added');
        // console.log(newData);
        players.push(newData);
    }
}

function drawCursors() {
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        // noStroke();
        if (!cursorLoaded) {
            fill(p.r, p.g, p.b);
            ellipse(p.x, p.y, 16);
        } else {
          img(cursorImage, p.x, p.y);
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
    if (connected) {
        for (var i = 0; i < blocksArray.length; i++) {
            if (mouseX > blocksArray[i].x &&
                mouseX < blocksArray[i].x + blocksArray[i].scale &&
                mouseY > blocksArray[i].y &&
                mouseY < blocksArray[i].y + blocksArray[i].scale && !dontDelete) {
                blocksArray.splice(i, 1);
                socket.emit('removeBlock', i);
                spaceIsAlreadyOccupied = true;
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
    count = slider.value()
    sizeY = $(window).height();
    gravity = gravitySlider.value();
    background(0);
    wind = (mouseX - (sizeX / 2)) / (sizeX / 2) * 10;
    wind = -wind
    blockScale = sizeSlider.value();
    // fill(0);
    textSize(16);
    stroke(255);
    text("Raindrop Count: " + Math.round(slider.value()), (sizeX / 8) * 3, sizeY - (sizeY / 7));
    text("Brush size: " + Math.round(sizeSlider.value()) + " px", (sizeX / 3) * 2, sizeY - (sizeY / 7));
    text("Gravity: " + Math.round(gravitySlider.value() * 100) / 100, (sizeX / 8), sizeY - (sizeY / 7));
    text("FPS: " + Math.floor(frameRate()), 0, height - 16);



    // text("Collision: " + collisionEnabled, (sizeX/8)*7, sizeY - (sizeY / 6));

    // console.log(gravitySlider.mouseOver());
    if (mouseIsPressed && connected) {
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
