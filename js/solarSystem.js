//Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

                     
//////////////////////////////////////
//NOTE Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
//NOTE import all texture
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const moonTexture = textureLoader.load("./image/moon.jpeg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");



//////////////////////////////////////

//////////////////////////////////////
//NOTE Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////

//////////////////////////////////////
//NOTE screen bg
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  "./image/stars.jpg",
  "./image/stars.jpg",
  "./image/stars.jpg",
  "./image/stars.jpg",
  "./image/stars.jpg",
  "./image/stars.jpg",
]);
scene.background = cubeTexture;
//////////////////////////////////////

//////////////////////////////////////
//NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);
camera.position.set(-70, 90, 180);
////////////////////////////////////

//////////////////////////////////////
//NOTE Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun
const sungeo = new THREE.SphereGeometry(30, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
    opacity: 0.3, 
    transparent: true
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the circular path
  const numSegments = 100; // Number of segments to create the circular path
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}
//////////////////////////////////////


////////////////////x-y from sun ////////////
const planetDistances = {

  mercury: 38, 
  venus: 54,    
  earth: 72,   
  mars: 88,     
  jupiter: 110,  
  saturn: 148,
  uranus: 186,   
  neptune: 210,
  pluto: 226     
  
};

const planetSizes = {
  mercury: 0.5,   
  venus: 1.0,   
  earth: 1.0,    
  mars: 0.53,     
  jupiter: 10.0, 
  saturn: 8.0,
  uranus: 4.0,   
  neptune: 3.8,  
  pluto: 0.7     
};

const SpaceshipArray = [];

const meteorArray = []; 
////////////////////////////////////////////
//NOTE: create planet
const generatePlanet = (size, planetTexture, x, ring,name, moon,meteor,Spaceship ) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  
  
  planet.name = name; 
  
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  
  
  if (ring) {
    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
    const ringMat = new THREE.MeshBasicMaterial({ map: ring.ringmat, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  
  if (moon) {
    const moonGeometry = new THREE.SphereGeometry(moon.size, 20, 20);
    const moonMaterial = new THREE.MeshBasicMaterial({ map: moon.texture });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    
    moonMesh.position.set(x + moon.distanceFromPlanet, 0.7, 0); 
    planetObj.add(moonMesh); 



  }
  

if (meteor) {
  const meteorCount = 4; 
  const meteorPositions = [
    { x: x + 0.7, y: 0.8, z: 0.2 },
    { x: x + 0.1, y: 1.5, z: 0.6 },
    { x: x + 0.8, y: 1.6, z: 0.9 },
    { x: x + 0.5, y: 2.3, z: 0.1 },
  ];

  const meteorcolor = [
    0xff0000, 
    0x8B4513, 
    0x8B4513, 
    0x6E8B3D, 
  ];

  for (let i = 0; i < meteorCount; i++) {
    
    const meteorGeometry = new THREE.DodecahedronGeometry(0.02); 
    const meteorMaterial = new THREE.MeshStandardMaterial({ color: meteorcolor[i] });
    const meteorMesh = new THREE.Mesh(meteorGeometry, meteorMaterial);
    
   
    meteorMesh.position.set(meteorPositions[i].x, meteorPositions[i].y, meteorPositions[i].z);
   
    meteorMesh.visible = false;

    
    planetObj.add(meteorMesh);
    
    meteorArray.push(meteorMesh);
  }
}






if (Spaceship) {
  const SpaceshipCount = 2; 
  const SpaceshipPositions = [
    { x: x + 0.1, y: 0.6, z: +1 },
    { x: x + 0.1, y: 0.6, z: -1 },
    { x: x + 0.1, y: 0.6, z: 1 },
  ];

  const Spaceshiprcolor = [
    0Xffffff, 
    0xffffff,
    0xffffff, 
 
  ];

  for (let i = 0; i < SpaceshipCount; i++) {
    const SpaceshipGeometry = new THREE.TetrahedronGeometry(0.05); 
    const SpaceshipMaterial = new THREE.MeshStandardMaterial({ color: Spaceshiprcolor[i] }); 
    const SpaceshipMesh = new THREE.Mesh(SpaceshipGeometry, SpaceshipMaterial);
    
    SpaceshipMesh.position.set(SpaceshipPositions[i].x, SpaceshipPositions[i].y, SpaceshipPositions[i].z);
   
    planetObj.add(SpaceshipMesh);
    
    SpaceshipMesh.visible = false;

    
    SpaceshipArray.push(SpaceshipMesh);
  }
}

const options = {
  showSpaceships: false, 
};



  
  
  scene.add(planetObj);
  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 1);
  
  return { planetObj: planetObj, planet: planet };
};





///////////////////////////real speed and defult speed ///////////



const realSpeeds = {
  mercuryAround: 0.00004,
  venusAround: 0.00015,
  earthAround: 0.00001,
  marsAround: 0.00008,
  jupiterAround: 0.00002,
  saturnAround: 0.00009,
  uranusAround: 0.00004,
  neptuneAround: 0.00001,
  plutoAround: 0.00007,

  mercurySelf: 0.00004,
  venusSelf: 0.00015,
  earthSelf: 0.0001,
  marsSelf: 0.0008,
  jupiterSelf: 0.000002,
  saturnSelf: 0.00009,
  uranusSelf: 0.00004,
  neptuneSelf: 0.00001,
  plutoSelf: 0.00007,
  
};


const defaultSpeeds = {
  mercuryAround: 0.04,
  venusAround: 0.015,
  earthAround: 0.01,
  marsAround: 0.008,
  jupiterAround: 0.002,
  saturnAround: 0.0009,
  uranusAround: 0.0004,
  neptuneAround: 0.0001,
  plutoAround: 0.07,

  mercurySelf: 0.04,
  venusSelf: 0.015,
  earthSelf: 0.01,
  marsSelf: 0.008,
  jupiterSelf: 0.00002,
  saturnSelf: 0.0009,
  uranusSelf: 0.0004,
  neptuneSelf: 0.0001,
  plutoSelf: 0.07,
  sunSpeed:0.004

};


////////////////////////////////////////////////////




const planets = [
  {
    ...generatePlanet(planetSizes.mercury, mercuryTexture, planetDistances.mercury, null, 'mercury'),
    rotaing_speed_around_sun: defaultSpeeds.mercuryAround,
    self_rotation_speed: defaultSpeeds.mercurySelf,
  },
  {
    ...generatePlanet(planetSizes.venus, venusTexture, planetDistances.venus, null, 'venus'),
    rotaing_speed_around_sun: defaultSpeeds.venusAround,
    self_rotation_speed: defaultSpeeds.venusSelf,
  },
  {
    ...generatePlanet(
      planetSizes.earth,
      earthTexture,
      planetDistances.earth,
      null,
      'earth'
      ,
      { size:0.273 , texture: moonTexture, distanceFromPlanet: 3 } ,
      {},
      {},
      
    ),
    isStationary: true,
    rotaing_speed_around_sun: defaultSpeeds.earthAround,
    self_rotation_speed: defaultSpeeds.earthSelf,
  },
  {
    ...generatePlanet(planetSizes.mars, marsTexture, planetDistances.mars, null, 'mars'),
    rotaing_speed_around_sun: defaultSpeeds.marsAround,
    self_rotation_speed: defaultSpeeds.marsSelf,
  },
  {
    ...generatePlanet(planetSizes.jupiter, jupiterTexture, planetDistances.jupiter, null, 'jupiter'),
    rotaing_speed_around_sun: defaultSpeeds.jupiterAround,
    self_rotation_speed: defaultSpeeds.jupiterSelf,
  },
  {
    ...generatePlanet(planetSizes.saturn, saturnTexture, planetDistances.saturn, { innerRadius: 10, outerRadius: 20, ringmat: saturnRingTexture }, 'saturn'),
    rotaing_speed_around_sun: defaultSpeeds.saturnAround,
    self_rotation_speed: defaultSpeeds.saturnSelf,
  },
  {
    ...generatePlanet(planetSizes.uranus, uranusTexture, planetDistances.uranus, { innerRadius: 7, outerRadius: 12, ringmat: uranusRingTexture }, 'uranus'),
    rotaing_speed_around_sun: defaultSpeeds.uranusAround,
    self_rotation_speed: defaultSpeeds.uranusSelf,
  },
  {
    ...generatePlanet(planetSizes.neptune, neptuneTexture, planetDistances.neptune, null, 'neptune'),
    rotaing_speed_around_sun: defaultSpeeds.neptuneAround,
    self_rotation_speed: defaultSpeeds.neptuneSelf,
  },
  {
    ...generatePlanet(planetSizes.pluto, plutoTexture, planetDistances.pluto, null, 'pluto'),
    rotaing_speed_around_sun: defaultSpeeds.plutoAround,
    self_rotation_speed: defaultSpeeds.plutoSelf,
  },
];


////////////////////////////////////////////////////////////////////////////
//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  "Real speed": false,
   "Move Earth":false,
  speed: 1,
  "Focus on Earth": false,
  "showMeteor" : false,
  "showSpaceships":false
  
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});

gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});


gui.add(options, "Real speed").onChange((e) => {
  updatePlanetSpeeds(e);
  
});


let earthMoving = false;
gui.add(options, "Move Earth").onChange((e) => {
  moveEarth(e)
  
});



function moveEarth() {
  const earth = planets.find(p => p.planet.name === 'earth'); 
  if (earth) {
    earthMoving = !earthMoving; 
    earth.isStationary = !earthMoving; 
  }
}


let lastEarthPosition;
gui.add(options, "Focus on Earth").onChange((e) => {
  const earth = planets[2]; 
  if (e) {
    earth.isStationary = true; 
    const earthPlanet = planets.find(p => p.planet.name === 'earth').planet;
    
    
    earthPlanet.position.set(72, 0, 0); 
    lastEarthPosition = earthPlanet.position.clone();
    orbit.target.copy(earthPlanet.position);
    console.log(lastEarthPosition);
    console.log(earthPlanet.position);
    
    let earthPosition = lastEarthPosition;
    orbit.update();
    
    camera.position.set(earthPosition.x + 1, earthPosition.y + 2, earthPosition.z + 3);
    camera.lookAt(earthPosition);
    
  } else {
    
    camera.position.set(-70, 90, 180);
    camera.lookAt(sun.position);
  }
});



gui.add(options, "showMeteor").onChange((e) => {
  meteorArray.forEach(meteor => {
    meteor.visible = e; 
  });
});

gui.add(options, "showSpaceships").onChange((e) => {
  SpaceshipArray.forEach(spaceship => {
    spaceship.visible = e; 
  });
});



function updatePlanetSpeeds(useRealSpeeds) {
  planets.forEach((planet, index) => {
    const planetNames = [
      'mercuryAround', 'venusAround', 'earthAround', 
      'marsAround', 'jupiterAround', 'saturnAround', 
      'uranusAround', 'neptuneAround', 'plutoAround'
    ];
    
    const speedSet = useRealSpeeds ? realSpeeds : defaultSpeeds;
    planet.rotaing_speed_around_sun = speedSet[planetNames[index]];
    planet.self_rotation_speed = speedSet[planetNames[index].replace('Around', 'Self')];

  });
}


const maxSpeed = new URL(window.location.href).searchParams.get("ms")*1
gui.add(options, "speed", 0, maxSpeed?maxSpeed:20);


var object4 = { 
  add: function() { 
    window.location.reload(); 
  } 
};


var button1 = gui.add(object4, "add").name("back to solar system");


button1.__li.style.backgroundColor = "#2196F3"; 
button1.__li.style.color = "black"; 

button1.__li.addEventListener("mouseenter", function() {
  button1.__li.style.backgroundColor = "#1976D2"; 
});

button1.__li.addEventListener("mouseleave", function() {
  button1.__li.style.backgroundColor = "#2196F3"; 
});




var object1 = { 
  add: function() { 
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  } 
};

var button = gui.add(object1, "add").name("Full Screen View"); 

button.__li.style.backgroundColor = "black"; 
button.__li.style.color = "white"; 



document.addEventListener("fullscreenchange", function() {
  if (document.fullscreenElement) {
    button.name("Exit Full Screen View");
  } else {
    button.name("Full Screen View"); 
  }
});


//////////////////////////////////////

//////////////////////////////////////
//NOTE - animate function


// Animation function
function animate(time) {
  sun.rotateY(options.speed * 0.00004);
  
  planets.forEach(({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed, isStationary }) => {
    if (!isStationary) {
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      planet.rotateY(options.speed * self_rotation_speed);
    }
  });
  
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//////////////////////////////////////
