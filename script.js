import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

// Import the canvas element
const canvas = document.getElementById('canvas');

// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // Antialiasing is used to smooth the edges of what is rendered
    antialias: true,
    // Activate the support of transparency
    alpha: true
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

// Create the controls
const controls = new OrbitControls(camera, canvas);

// Handle the window resize event
window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});






//Table Creation

// Définir les dimensions
const tableLength = 12; // Longueur de la table
const tableWidth = 0.1; // Largeur de la table
const tableHeight = 10; // Épaisseur du dessus de la table
const legHeight = 5; // Hauteur des pieds
const legRadius = 0.2; // Rayon des pieds

// Créer la géométrie du dessus de la table
const tableTopGeometry = new THREE.BoxGeometry(tableLength, tableWidth, tableHeight, 100, 100, 100  ); // dimensions à ajuster selon vos besoins

// Créer la géométrie des pieds de la table
const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32); // hauteur et rayon à ajuster

// Charger la texture
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('wood.jpg');
const woodDisplacementTexture = textureLoader.load('wooddisplacementmap.jpg');
// Créer le matériau
const material = new THREE.MeshStandardMaterial({ map: woodTexture});
const material2 = new THREE.MeshStandardMaterial({ 
    map: woodTexture , 
    displacementMap : woodDisplacementTexture, 
    displacementScale: 0.1,
    normalMap: textureLoader.load('NormalMap.png')
});

// Créer le dessus de la table et ajouter à la scène
const tableTop = new THREE.Mesh(tableTopGeometry, material2);
tableTop.position.y = -1.5; // ajuster la position en y

// Créer et ajouter les pieds de la table
for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(legGeometry, material);
    leg.position.y = -2.5; // la moitié de la hauteur des pieds
    leg.position.x = (i < 2) ? -5.8 : 5.8; // positionner les pieds aux quatre coins
    leg.position.z = (i % 2 === 0) ? -4.75 : 4.75;
    tableTop.add(leg); // attacher les pieds au dessus de la table
}

// Ajouter le dessus de la table à la scène (supposant que vous avez déjà une scène 'scene')
scene.add(tableTop);

//sphere creation
// const geometry = new THREE.SphereGeometry(0.05,32,16);
// const sphere = new THREE.Mesh(geometry,material);
// sphere.position.y=-1.2;
// sphere.position.x=-0.038;
// sphere.position.z=0.03  ;
const offset = new THREE.Vector3(-0.038,-1.2,0.03); 
// scene.add(sphere);


// const geometry2 = new THREE.CylinderGeometry( 0.05, 0.05, 0.1, 50 , 1, false, 17); 
// const cylinder = new THREE.Mesh( geometry2, material ); 
// cylinder.rotation.x = Math.PI / 2;
// cylinder.position.y=-1.2;
// cylinder.position.x=-0.038;
// cylinder.position.z=0.03  ;
// scene.add( cylinder );

// Adding a background
let textureEquirec = textureLoader.load( 'ski1.jpg' );
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.colorSpace = THREE.SRGBColorSpace;

scene.background = textureEquirec;





// Add a light
const light = new THREE.PointLight( 0xffffff, 1, 0, 0 );
light.position.set( 20, 20, 20 );
scene.add( light );



//Create the group
const group = new THREE.Group();






// Créez une instance de GLTFLoader
const loader = new GLTFLoader();

// Chargez votre modèle GLTF
loader.load('nozzle_head.glb', (gltf) => {
    const model = gltf.scene;

    // Charger la texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('textures1.png', (texture) => {
        // Appliquer la texture et le matériau

        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({ map: texture });
            }
        });

        const light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 4, 0.01 );
        // Set the position of the light
        light.position.set( -1, -1, -1 );
        // Make the light point toward an object (here, a sphere that we defined before)
        light.target = model;
        scene.add( light );

        //rotation of 180°
        model.rotation.x = Math.PI;
        model.scale.set(0.85,0.85,0.85);

        //add to group
        group.add(model);
    });
});

//TODO recouper le g  lb 
// et ajouter la ligne d'extrusion sur animate utiliser la position 
// actuelle et l'ancienne pour d'abord tracer un cylindre 
// court entre les 2 coord. Et le faire tous les i%10 par exemple 
// (toutes les 10 itérations pour pas que yuait trop de trucs à charger.)
// jouer sur la texture, le material les lights et le story telling
// rajouter un bouton pour lancer l'impression 3D simple en vase mode
// post processng sur la table par exemple outline
// +++ ajouter une texture sur la table en bois (displacement map) en rendant noir 
// et blanc puis mettre les bordures en noir puis créer du relief.

//directional light
const light1 = new THREE.DirectionalLight( 0xffffff, 1 );
// Set the position of the light
light1.position.set( 1, 1, 1 );
// Make the light point toward an object (here, a sphere that we defined before)
light1.target = tableTop;
scene.add( light1 );




//add group to scene
scene.add(group);



//test pointer down
window.addEventListener('pointerdown', (event) => {
  console.log(`The user pressed the pointer at ${event.clientX/window.innerWidth*100}% of the width, ${event.clientY/window.innerHeight*100}% of the height of the screen`);
});



// BOUTTON that starts rotation and pause it
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  console.log('The user clicked on the button');
  isRotating = !isRotating; // Basculer l'état de la rotation

});

const button2 = document.getElementById('monBouton');
button2.addEventListener('click', () => {
    var texte = document.getElementById('texteCache');
    if (texte.style.display === "none") {
        texte.style.display = "block";
    } else {
        texte.style.display = "none";
    }
});




//Raycasting
const raycaster = new THREE.Raycaster();

let pointerPosition = { x: 0, y: 0 };

window.addEventListener('pointermove', (event) => {
    pointerPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointerPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});


//Post processing



const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.1, // strength
    0.3, // radius
    0.1 // threshold
);
const outputPass = new OutputPass();

composer.addPass(renderPass);
composer.addPass(bloomPass);
composer.addPass(outputPass);

let i=0;
let isRotating = false;
let t = 0;
let r = 1;
let pastcoordx = 0;
let pastcoordy = 0;
let pastcoordz = 0;

// Create the animation loop
const animate = () => {
    // Call animate recursively
    requestAnimationFrame(animate);

    if(isRotating) {
        pastcoordx = group.position.x ;
        pastcoordy = group.position.y ;
        pastcoordz = group.position.z ;

        group.position.set(Math.cos(t)*r,t/100,Math.sin(t)*r);
        

        if(i%5==0){
            //créer une geo(sphérique) dans la boucle
            // const geometry = new THREE.CylinderGeometry( 5, 5, 20, 50 ); 
            // const material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
            // const cylinder = new THREE.Mesh( geometry, material ); scene.add( cylinder );
            const geometry2 = new THREE.CylinderGeometry( 0.05, 0.05, 0.1, 50 , 1, false, 17); 
            const cylinder = new THREE.Mesh( geometry2, material ); 
            cylinder.rotateX(Math.PI / 2);
            cylinder.rotateZ(t);
            // cylinder.rotateZ((i / 52.5) * Math.PI / 2);
  
            cylinder.position.x = offset.x + group.position.x;
            cylinder.position.y = offset.y + group.position.y;
            cylinder.position.z = offset.z + group.position.z;
            scene.add( cylinder );
        }
        t+=0.02;
    }

    // Update the controls
    controls.update();


    raycaster.setFromCamera(pointerPosition, camera);
    const intersects = raycaster.intersectObject(tableTop);
    if (intersects.length > 0) {
        tableTop.material.opacity = 0.5;
    } else {
        tableTop.material.opacity = 1;
    }
    // Render the scene
    // renderer.render(scene, camera);
    composer.render();
    i++;

}

// Call animate for the first time
animate();

//si je veux recommit je recommit avec un nouveau nom 
// puis je git push tout simplement ("git push")
