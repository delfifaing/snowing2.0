// ------------- Canvas -------------
var canvas = document.querySelector("canvas");
// Set canvas dimensions (in this case equal to the window dimension)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a context superobject ctx, which will have all the methods to draw
var ctx = canvas.getContext('2d');

// ------------- Variables ------------

// Mouse interactivity
var mouse = {
 x: undefined,
 y: undefined,
}
var snowballRadius = 50;
var maxRadius      = 20;
var snowball = false;
// Windintensity
var windInt    = "Null";
var windDir    = 1;
var strongWind = false;
var nbrFlakes  = 0;

// Variables for animation
var animation_id;
var stopped = true;

// ------------- Aux Functions -------------
function randomRange(min, max) {
  return min + Math.random() * (max - min + 1);
};

function randomWhiteColor() {
  var R = Math.floor(randomRange(230, 255));
  var G = Math.floor(randomRange(230, 255));
  var B = Math.floor(randomRange(230, 255));
  var a = randomRange(0.1, 1);
  var colorString = 'rgba(' + R +',' + G +',' + B +','+ a +')';
  return colorString
};

function stopAnimation() {
  if (animation_id) {
    window.cancelAnimationFrame(animation_id);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
    stopped = true;
  }

// ------------- Events -------------
// Set the nbrFlakes according to the user's input option
snowIntensity.onchange = function(){
  var selection1 = document.getElementById("snowIntensity");
  nbrFlakes = selection1.options[selection1.selectedIndex].value;

  // Re-initialize animation with new parameter
  if (stopped === false) {
    // Stop animation before re-initializing animation with the new nbrFlakes
    stopAnimation();
    createFlakes();
    animate();
  }
}

//Set windInt according to the user's inpput
windIntensity.onchange = function(){
  var selection2 = document.getElementById("windIntensity");
  windInt = selection2.options[selection2.selectedIndex].text;
  // console.log(windInt);

  // Re-initialize animation with new parameter
  if (stopped === false) {
    // Stop animation before re-initializing animation with the new nbrFlakes
    stopAnimation();
    createFlakes();
    animate();
  }
}

//Set windDir according to the user's inpput
windDirection.onchange = function(){
  var selection3 = document.getElementById("windDirection");
  windDir = selection3.options[selection3.selectedIndex].value;
  console.log(windDir);

  // Re-initialize animation with new parameter
  if (stopped === false) {
    // Stop animation before re-initializing animation with the new nbrFlakes
    stopAnimation();
    createFlakes();
    animate();
  }
}

function snowballEffect(event) {
  // window.addEventListener("mousemove",
// function hola(event) {
  mouse.x = event.x;
  mouse.y = event.y;
  // })
}

// Activate snowball effect with on button
on.addEventListener("click", function() {
  window.addEventListener("mousemove", snowballEffect)
  snowball = true;
  })

off.addEventListener("click", function() {
  window.removeEventListener("mousemove", snowballEffect)
  snowball = false;
  })


// Deactivate snowball effect with off button
// off.addEventListener("mousedown", function() {
  // window.removeEventListener("mousemove", snowballEffect)
  // stopAnimation();
  // createFlakes();
  // animate();
  // })
  
// Resize Canvas size in when window size is changed
window.addEventListener("resize", function()
  {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  });


// Start or stop storm with onclick event
stopStorm.onclick = function(){
    if (stopped === false) {
    stopAnimation();
  }
};  

startStorm.onclick = function(){
  if (stopped === true) {
    createFlakes();
    animate();
  }
};

// ------------- Document ready functions -------------
// (using jQuery lib)
$(document).ready(function(){
  $("select[name=windIntensity]").change(function(){
      var windIntensity = $(this).val();
      if(windIntensity != 0)
      {
          $("select[name=windDirection]").removeAttr("disabled");
      }
      else
      {
          $("select[name=windDirection]").attr("disabled", true);
      }
  })
})

// ------------- Flakes class -------------
function Flake(x,y,dx,dy,radius,strongWind) {
  // Attributes
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.originaldx = dx;
  this.originaldy = dy;
  this.radius = radius;
  this.minRadius = this.radius;
  // this.color = 'rgb(255,255,255)';
  this.color = randomWhiteColor();

  // Methods
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  this.fall = function() {
    this.draw();

    this.y += this.dy;
    this.x += this.dx;  
    
    // "New" flake when the previous one reaches the ground
    if (this.y + this.radius > innerHeight) {
      this.x = randomRange(radius, innerWidth);
      if (strongWind == true) {
        this.y = randomRange(radius, radius+1000); // So that snow falls from above and the sides
      }
      else {
        this.y = randomRange(radius, radius+5); // So that snow falls from above
      }
    }
    // Interactivity to create snowballs
    if (mouse.x - this.x < snowballRadius && mouse.x - this.x > -snowballRadius &&
      mouse.y - this.y < snowballRadius && mouse.y - this.y > -snowballRadius){
    if (this.radius < maxRadius) {
      this.radius +=1;
      this.x = mouse.x;
      this.y = mouse.y;
      this.dx = 0.5 * windDir;
      this.dy = 0.5;
      }
    }
    else if (this.radius > this.minRadius) {
      this.radius -= 1;
      this.dx = this.originaldx;
      this.dy = this.originaldy;
    }
    if (snowball === false) {
    this.radius = this.minRadius;
    }
  }
}

// ------------- Create and store flakes in an array -------------

var flakesArray = [];
function createFlakes() {
  flakesArray = [];
  for (var i = 0; i < nbrFlakes; i++) {
    var radius = randomRange(1, 3)
    var x = randomRange(radius, innerWidth);
    var y = randomRange(radius, innerHeight);
    if (windInt === "Null") {
      var dx = randomRange(0, 0.3);
      var dy = randomRange(1, 3);
      strongWind = false;
    } 
    else if (windInt === "Low") {
      var dx = randomRange(1, 3);
      var dy = randomRange(1, 4);
      strongWind = false;
    }
    else if (windInt === "Medium") {
      var dx = randomRange(5, 8);
      var dy = randomRange(4, 5);
      strongWind = true;
    }
    else if (windInt === "High") {
      var dx = randomRange(8, 12);
      var dy = randomRange(5, 6);
      strongWind = true;
    }
    //Set Wind Direction
    dx = dx * windDir;

    // Instantiate many Flake objects and add them to the array
    flakesArray.push(new Flake(x ,y , dx, dy, radius, strongWind));
  }
}

function animate() {
  animation_id = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (var i = 0; i < flakesArray.length; i++) {
    flakesArray[i].fall();
  }
  stopped = false;
}


// hola