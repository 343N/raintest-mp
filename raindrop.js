function Raindrop() {
    var splash;
    sizeX = $(window).width();
    sizeY = $(window).height();
    dropColor = [255, 255, 255];
    this.x = random((-sizeX * 0.25), sizeX * 1.25);
    this.y = random(-sizeY);
    this.fallspeed = random(5, 50);
    this.length = random(-15, -20);
    wind = 0;
    gravity = .1;
    this.collided = false;
    // stroke(random(255),random(255),random(255));


    this.fall = function() {
        this.collided = false;
        this.prevX = this.x;
        this.prevY = this.y;
        this.newY = this.y + this.fallspeed;
        this.newX = this.x + ((wind / this.length) * this.fallspeed);
        this.xDiff = this.newX - this.prevX;
        this.yDiff = this.newY - this.prevY;
        this.fallspeed += gravity;

        if (this.y > sizeY) {
            this.collide(this.x, sizeY);
            this.collided = true;
        }
        if (collisionEnabled) {
            if (this.newX > colMinX &&
                this.newX < colMaxX &&
                this.newY > colMinY &&
                this.newY < colMaxY
                ) {
                for (var i = 0; i < blocksArray.length; i++) {
                    for (var j = 0; j * blocksArray[i].scale + this.prevY < this.newY; j++) {
                        if (j * blocksArray[i].scale + this.prevY > blocksArray[i].y &&
                            j * blocksArray[i].scale + this.prevY < blocksArray[i].y + blocksArray[i].scale &&
                            this.newX > blocksArray[i].x &&
                            this.newX < blocksArray[i].x + blocksArray[i].scale) {
                            this.collide(this.newX, blocksArray[i].y);
                            this.collided = true;
                            break;
                        }
                    }
                    if (!this.collided) {
                        for (var j = 0; j * blocksArray[i].scale + this.prevX < this.newX; j++) {
                            if (this.newY > blocksArray[i].y &&
                                this.newY < blocksArray[i].y + blocksArray[i].scale &&
                                j * blocksArray[i].scale + this.prevX > blocksArray[i].x &&
                                j * blocksArray[i].scale + this.prevX < blocksArray[i].x + blocksArray[i].scale) {
                                this.collide(blocksArray[i].x, this.newY); //+ (j * blocksArray[i].scale) );
                                this.collided = true;
                                break;
                                // console.log("collided!")
                            }

                        }
                    }
                }
            }
        }
        if (!this.collided) {
            this.x = this.newX;
            this.y = this.newY;
        }

    }



    this.collide = function(x, y) {
        splash = new Splash(this.fallspeed, x, y, -wind, y);
        this.y = random(-sizeY);
        this.fallspeed = random(5, 50);
        this.x = random((-sizeX * 0.5), sizeX * 1.5);
    }


    this.show = function() {
        // stroke(random(0,255),random(0,255),random(0,255));
        stroke(dropColor[0], dropColor[1], dropColor[2]);
        strokeWeight(1 * (this.fallspeed * 0.025));
        line(this.x, this.y, this.x - wind, this.y - this.length);
        try {
            if (splash != 'undefined' && splash.checkY()) {
                splash.show()
            }
        } catch (err) {}

    }
    this.log = function() {
        console.log(`I'm a thing`)
    }
}
