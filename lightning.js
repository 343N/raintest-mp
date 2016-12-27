function Lightning(screenX, screenY) {

  var xStart = random(screenX);
  var y = 0;
  var branches = [];
  var oldEndsX = [];
  var oldEndsY = [];
  var newEndsX = [];
  var newEndsY = [];
  // var showlightning = true;
  // this.opacity = 255;
  // var t = 0;
  // console.log(this.branches.length);

  function createBranches(){
    newEndX = xStart;
    newEndY = y;
    while (newEndY < screenY) {
      oldEndX = newEndX;
      oldEndY = newEndY;
      newEndX = random(-20, 20) + oldEndX;
      newEndY = random(0,40) + oldEndY;
      // noStroke();
      oldEndsX.push(oldEndX);
      oldEndsY.push(oldEndY);
      newEndsX.push(newEndX);
      newEndsY.push(newEndY);
      // console.log("creating branches")
    }
  }

  this.oldEndsX = function(){
    return oldEndsX;
  }

  this.oldEndsY = function(){
    return oldEndsY;
  }
  this.newEndsX = function(){
    return newEndsX;
  }
  this.newEndsY = function(){
    return newEndsY;
  }


  createBranches();

  // this.show = function() {
  //   if (branches.length === 0) {
  //     createBranches();
  //   }
  //   for (var i = 0; i < branches.length; i++){
  //       // alpha(opacity);
  //       // strokeWeight(2);
  //       // alpha(color(125, 249, 255, this.opacity));
  //       strokeWeight(20);
  //       stroke(125,249,255);
  //       branches[i];
  //       console.log(branches[i]);
  //   }
  //     console.log("while running..")
  //
  //   // setTimeout(function(){
  //   //   showlightning = false;
  //   // }, 500);
  //   // } while (opacity > 0);
  // }

}
