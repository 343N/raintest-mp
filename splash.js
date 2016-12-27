function Splash(size, x, y, wind, limit) {

    bottom = y;
    this.cutoff = limit;
    this.y = y;
    this.x = x;
    this.fallspeed = -(size + wind) * random(.25);
    this.xspeed = random(wind / 4, wind / 1.2);


    //
    // this.calculate = function(){
    //
    // }
    this.checkY = function() {
        if (this.y < limit) {
            return true
        } else return false;
    }


    this.show = function() {

        // var render = function(){
        //   setInterval(
        //     function() {
        // if (this.y < bottom){
        //   setTimeout(this.show(), 20);
        // }
        this.fallspeed += 1;
        this.y = this.y + this.fallspeed;
        this.xspeed -= 0.1
        this.x = this.x + this.xspeed;
        color(255, 255, 255);
        noStroke();
        fill(dropColor[0],dropColor[1],dropColor[2]);
        rect(this.x, this.y, size / 15, size / 15);
        //   }, 20);
        // }
    }

    // }, 20);


    // this.calculate()
    this.show()

}
