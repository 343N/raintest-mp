function Block(x, y, size, r,g,b, owner) {

  this.x = x;
  this.y = y;
  this.scale = size;
  this.r = r;
  this.g = g;
  this.b = b;
  this.color = color(r,g,b);
  this.owner = owner;

  this.show = function() {
    // noStroke();
    fill(this.color);
    stroke(255, 128);
    rect(this.x, this.y, this.scale, this.scale);
  }
}
