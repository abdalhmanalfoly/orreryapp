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
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
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

////////////////////////////////////////////
//NOTE: create planet
const genratePlanet = (size, planetTexture, x, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
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
    ...genratePlanet(planetSizes.mercury, mercuryTexture, planetDistances.mercury),
    rotaing_speed_around_sun: defaultSpeeds.mercuryAround,
    self_rotation_speed: defaultSpeeds.mercurySelf,
  },
  {
    ...genratePlanet(planetSizes.venus, venusTexture, planetDistances.venus),
    rotaing_speed_around_sun: defaultSpeeds.venusAround,
    self_rotation_speed: defaultSpeeds.venusSelf,
  },
  {
    ...genratePlanet(planetSizes.earth, earthTexture, planetDistances.earth),
    rotaing_speed_around_sun: defaultSpeeds.earthAround,
    self_rotation_speed: defaultSpeeds.earthSelf,
  },
  {
    ...genratePlanet(planetSizes.mars, marsTexture, planetDistances.mars),
    rotaing_speed_around_sun: defaultSpeeds.marsAround,
    self_rotation_speed: defaultSpeeds.marsSelf,
  },
  {
    ...genratePlanet(planetSizes.jupiter, jupiterTexture, planetDistances.jupiter),
    rotaing_speed_around_sun: defaultSpeeds.jupiterAround,
    self_rotation_speed: defaultSpeeds.jupiterSelf,
  },
  {
    ...genratePlanet(planetSizes.saturn, saturnTexture, planetDistances.saturn, {
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }),
    rotaing_speed_around_sun: defaultSpeeds.saturnAround,
    self_rotation_speed: defaultSpeeds.saturnSelf,
  },
  {
    ...genratePlanet(planetSizes.uranus, uranusTexture, planetDistances.uranus, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }),
    rotaing_speed_around_sun: defaultSpeeds.uranusAround,
    self_rotation_speed: defaultSpeeds.uranusSelf,
  },
  {
    ...genratePlanet(planetSizes.neptune, neptuneTexture, planetDistances.neptune),
    rotaing_speed_around_sun: defaultSpeeds.neptuneAround,
    self_rotation_speed: defaultSpeeds.neptuneSelf,
  },
  {
    ...genratePlanet(planetSizes.pluto, plutoTexture, planetDistances.pluto),
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
  speed: 1,
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

//////////////////////////////////////

//////////////////////////////////////
//NOTE - animate function
function animate(time) {
  sun.rotateY(options.speed *  0.00004 );
  planets.forEach(
    ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      planet.rotateY(options.speed * self_rotation_speed);
    }
  );
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
