let canvas = document.getElementById("scribble");
let canvas_field = document.getElementById("field");

let ctx = canvas.getContext("2d");
let ctxf = canvas_field.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas_field.width = window.innerWidth;
canvas_field.height = window.innerHeight;


let vectors = [];
let planets = [];
let particles = [];
const vectorSpacing = 30;

ctx.translate(innerWidth / 2, innerHeight / 2);
ctxf.translate(innerWidth / 2, innerHeight / 2);

for (let i = -innerWidth / 2; i < innerWidth / 2; i += vectorSpacing) {
	for (let j = -innerHeight / 2; j < innerHeight / 2; j += vectorSpacing) {
		vectors.push(new Vector(i, j));
	}
}

// 2 star system
planets.push(new Planet(-innerWidth / 5, 0));
planets.push(new Planet(innerWidth / 5, 0));
particles.push(new Particle(0, 0, 4.1, -4.5));

// 3 star system
// planets.push(new Planet(0, 100 * Math.sqrt(3)));
// planets.push(new Planet(-200, -100 * Math.sqrt(3)));
// planets.push(new Planet(200, -100 * Math.sqrt(3)));


// 4 star system
// planets.push(new Planet(-innerWidth / 5, 0));
// planets.push(new Planet(innerWidth / 5, 0));
// planets.push(new Planet(0, innerWidth / 5));
// planets.push(new Planet(0, -innerWidth / 5));
// particles.push(new Particle(300, 300, 0, 0));
// particles.push(new Particle(-300, 300, 0, 0));


let movingPlanet = false;
let creatingNewParticle = false;
let currentPlanet;
let newParticle, newParticleInitialX, newParticleInitialY, newParticleFinalX, newParticleFinalY;

let shiftDown = false;
document.addEventListener("keydown", (event) => {
	if (event.code == "ShiftLeft") {
		shiftDown = true;
	}
})
document.addEventListener("keyup", (event) => {
	if (event.code == "ShiftLeft") {
		shiftDown = false;
	}
})

document.addEventListener("mousedown", (event) => {
	for (planet of planets) {
		let x1 = event.clientX - innerWidth / 2;
		let y1 = event.clientY - innerHeight / 2;
		let x2 = planet.x;
		let y2 = planet.y;
		if (Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) < planet.radius) {
			movingPlanet = true;
			currentPlanet = planet;
		}
	}

	if (!movingPlanet && !shiftDown) {
		creatingNewParticle = true;
		newParticleInitialX = event.clientX - innerWidth / 2;
		newParticleInitialY = -(event.clientY - innerHeight / 2);
		newParticle = new Particle(newParticleInitialX, newParticleInitialY, 0, 0, false);
		particles.push(newParticle);
	}

	if (shiftDown) {
		planets.push(new Planet(event.clientX - innerWidth / 2, -(event.clientY - innerHeight / 2)));
	}

})
document.addEventListener("mousemove", (event) => {
	if (movingPlanet) {
		currentPlanet.x = event.clientX - innerWidth / 2;
		currentPlanet.y = event.clientY - innerHeight / 2;
	}
	if (creatingNewParticle) {
		newParticleFinalX = event.clientX - innerWidth / 2;
		newParticleFinalY = -(event.clientY - innerHeight / 2);
		newParticle.vX = (newParticleInitialX - newParticleFinalX) / 10;
		newParticle.vY = -(newParticleInitialY - newParticleFinalY) / 10;
	}
})
document.addEventListener("mouseup", (event) => {
	if (creatingNewParticle) {
		newParticle.readyToLaunch = true;
		creatingNewParticle = false;
	}

	movingPlanet = false;
})


function drawDebugLines() {
	let numOfDivisions = 8;
	ctx.beginPath();
	for (let i = 0; i < numOfDivisions; i++) {
		ctx.moveTo(0, 0);
		ctx.lineTo(innerWidth / 2, 0);
		ctx.rotate(Math.PI / numOfDivisions * 2);
	}
	ctx.strokeStyle = "#384858";
	ctx.stroke();
}



/*
  following is code which turns the vector visibility on and off
  - on click of checkbox, it checks if checkbox is checked or not, then accordingly hides/shows the vectors
*/
let vectorCheckbox = document.querySelector('#vector-check');
let canvasField = document.querySelector('#field');

// checkbox click event listener
vectorCheckbox.addEventListener('click', (ev) => {
  if(vectorCheckbox.checked == true) {
    canvasField.style.display = 'none';
  }
  else {
    canvasField.style.display = 'block';    
  }
});

// Initialize vector field once and only change on planet update
for (vector of vectors) {
	vector.update();
}

function animate() {

	ctx.clearRect(-innerWidth / 2, -innerHeight / 2, innerWidth, innerHeight);
	
	// drawDebugLines();
	
	if (movingPlanet || shiftDown) {
		ctxf.clearRect(-innerWidth / 2, -innerHeight / 2, innerWidth, innerHeight);
		for (vector of vectors) {
			vector.update();
		}
	}

	for (planet of planets) {
		planet.draw();
	}
	
	for (particle of particles) {
		particle.update();
	}

	requestAnimationFrame(animate);
}
animate();


