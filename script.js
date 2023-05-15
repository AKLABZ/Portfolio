const container = document.querySelector('.container');
const images = document.querySelectorAll('.image');

// create a separate container for the text
const textContainer = document.createElement('div');
textContainer.classList.add('text-container');
container.appendChild(textContainer);

const fontLoader = new THREE.FontLoader();

fontLoader.load('./fonts/helvetiker_regular.typeface.json', function(font) {
  const textGeometry = new THREE.TextGeometry('Avery', {
    font: font,
    size: 10,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelOffset: 0,
    bevelSegments: 10,
  });

  const material = new THREE.MeshStandardMaterial({ color: 0xadb5bd, metalness: 1, roughness: 0.2 });
  const textMesh = new THREE.Mesh(textGeometry, material);

  // position the text above the images
  textMesh.position.set(0, 0, -50);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 0);
  textContainer.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 100);

  const scene = new THREE.Scene();
  scene.add(textMesh);

  const pointLight = new THREE.PointLight(0xe5e5e5, 1000, 1000);
  pointLight.position.set(0, 0, 50);
  scene.add(pointLight);

  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
  const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
  scene.add(cubeCamera);

  const reflectiveMaterial = new THREE.MeshBasicMaterial({
    envMap: cubeRenderTarget.texture,
    transparent: true,
    opacity: 0.01,
  });
  const reflectiveCube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), reflectiveMaterial);
  reflectiveCube.position.set(0, 0, -100);
  scene.add(reflectiveCube);
  
  function animate() {
    requestAnimationFrame(animate);
    textMesh.rotation.x += 0;
    textGeometry.center();
    textMesh.rotation.y += 0.01;
    cubeCamera.update(renderer, scene);
    renderer.render(scene, camera);
  }

  animate();
});

function getRandomPosition() {
    const x = Math.floor(Math.random() * (container.clientWidth - images[0].clientWidth));
    const y = Math.floor(Math.random() * (container.clientHeight - images[0].clientHeight));
    return [x, y];
  }
  
  function moveImage(image) {
    const [x, y] = getRandomPosition();
    image.style.transition = 'transform 3s ease-in-out';
    image.style.transform = `translate(${x}px, ${y}px)`;
  }
  
  images.forEach((image) => {
    image.addEventListener('mouseenter', () => {
      image.style.zIndex = '2';
      reflectiveCube.material.opacity = 0.5;
    });
  
    image.addEventListener('mouseleave', () => {
      image.style.zIndex = '1';
      reflectiveCube.material.opacity = 0.8;
    });
  });
  
  setInterval(() => {
    images.forEach((image) => {
      moveImage(image);
    });
  }, 3000);
  
let animationPaused = false;
let animateId = null;

function animate() {
  if (!animationPaused) {
    animateId = requestAnimationFrame(animate);
    textMesh.rotation.x += 0.01;
    textMesh.rotation.y += 0.01;
    cubeCamera.update(renderer, scene);
    renderer.render(scene, camera);
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'q') {
    animationPaused = true;
    cancelAnimationFrame(animateId);
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'q') {
    animationPaused = false;
    animate();
  }
});

animate();

  