let scene, camera, renderer;
let isLocked = false;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let isRunning = false;
let canJump = true;
let isJumping = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let prevTime = performance.now();

const WALK_SPEED = 5.0;
const RUN_SPEED = 10.0;
const JUMP_FORCE = 8.0;
const GRAVITY = 20.0;
const ROOM_SIZE = { width: 50, height: 15, depth: 50 };

let pitch = 0;
let yaw = 0;

let bullets = [];
let shootCooldown = 0;
const SHOOT_COOLDOWN_TIME = 0.2;
const BULLET_SPEED = 50;
const MAX_BULLETS = 30;
let currentAmmo = MAX_BULLETS;
let isReloading = false;

let score = 0;
let gameObjects = [];
let gameTime = 120;
let gameActive = true;
let objectsRemaining = 0;
const MAX_OBJECTS = 25;

const loadingElement = document.getElementById('loading');
const hudElement = document.getElementById('hud');
const timerElement = document.querySelector('.timer-value');
const scoreElement = document.querySelector('.score-value');
const objectsElement = document.querySelector('.objects-value');
const ammoElement = document.querySelector('.ammo-count');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');
const fullscreenButton = document.getElementById('fullscreen-btn');
const fullscreenButtonMenu = document.getElementById('fullscreen-btn-menu');
const hitMarkerElement = document.getElementById('hit-marker');
const reloadIndicatorElement = document.getElementById('reload-indicator');

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 100);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.8, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x222233);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.getElementById('game-container').appendChild(renderer.domElement);

    addLighting();
    createRoom();
    createGameObjects();

    loadingElement.classList.add('hidden');
    setupEventListeners();
    animate();
    startGameTimer();
}

function addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 30, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -40;
    directionalLight.shadow.camera.right = 40;
    directionalLight.shadow.camera.top = 40;
    directionalLight.shadow.camera.bottom = -40;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffcc, 1.2, 50);
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    const lightSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 0.3 })
    );
    lightSphere.position.copy(pointLight.position);
    scene.add(lightSphere);

    [
        { x: -20, z: -20 },
        { x: 20, z: -20 },
        { x: -20, z: 20 },
        { x: 20, z: 20 }
    ].forEach(corner => {
        const cornerLight = new THREE.PointLight(0xffffee, 0.8, 40);
        cornerLight.position.set(corner.x, 10, corner.z);
        scene.add(cornerLight);
    });
}

function createRoom() {
    const roomGroup = new THREE.Group();

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(ROOM_SIZE.width, ROOM_SIZE.depth),
        new THREE.MeshPhongMaterial({ color: 0x5a8f5a, shininess: 50, side: THREE.DoubleSide })
    );
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x1a237e, shininess: 30 });

    const northWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE.width, ROOM_SIZE.height, 0.5), wallMaterial);
    northWall.position.set(0, ROOM_SIZE.height/2, -ROOM_SIZE.depth/2);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    roomGroup.add(northWall);

    const southWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE.width, ROOM_SIZE.height, 0.5), wallMaterial);
    southWall.position.set(0, ROOM_SIZE.height/2, ROOM_SIZE.depth/2);
    southWall.castShadow = true;
    southWall.receiveShadow = true;
    roomGroup.add(southWall);

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, ROOM_SIZE.height, ROOM_SIZE.depth), wallMaterial);
    westWall.position.set(-ROOM_SIZE.width/2, ROOM_SIZE.height/2, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    roomGroup.add(westWall);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, ROOM_SIZE.height, ROOM_SIZE.depth), wallMaterial);
    eastWall.position.set(ROOM_SIZE.width/2, ROOM_SIZE.height/2, 0);
    eastWall.castShadow = true;
    eastWall.receiveShadow = true;
    roomGroup.add(eastWall);

    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE.width, 0.5, ROOM_SIZE.depth),
        new THREE.MeshPhongMaterial({ color: 0x0d47a1, shininess: 40 })
    );
    ceiling.position.set(0, ROOM_SIZE.height, 0);
    ceiling.castShadow = true;
    ceiling.receiveShadow = true;
    roomGroup.add(ceiling);

    scene.add(roomGroup);
}

function createGameObjects() {
    gameObjects = [];
    objectsRemaining = 0;
    for (let i = 0; i < 12; i++) spawnNewObject();
    updateUI();
}

function spawnNewObject() {
    if (gameObjects.length >= MAX_OBJECTS) return;

    const types = ['cube','sphere','pyramid','cylinder','torus'];
    const type = types[Math.floor(Math.random()*types.length)];

    let obj, size, points;

    switch(type){
        case 'cube':
            size = Math.random()*1.5+0.8;
            obj = new THREE.Mesh(new THREE.BoxGeometry(size,size,size), new THREE.MeshPhongMaterial({color:Math.random()*0xffffff,shininess:60}));
            points=10;
            obj.userData={type:'cube',points:points,size:size};
            break;
        case 'sphere':
            size = Math.random()*1.2+0.6;
            obj = new THREE.Mesh(new THREE.SphereGeometry(size,32,32), new THREE.MeshPhongMaterial({color:Math.random()*0xffffff,shininess:100}));
            points=15;
            obj.userData={type:'sphere',points:points,radius:size};
            break;
        case 'pyramid':
            size = Math.random()*2+1.2;
            obj = new THREE.Mesh(new THREE.ConeGeometry(1.2,size,4), new THREE.MeshPhongMaterial({color:Math.random()*0xffffff,shininess:80}));
            points=20;
            obj.userData={type:'pyramid',points:points,height:size};
            break;
        case 'cylinder':
            size=Math.random()*1.5+0.8;
            obj=new THREE.Mesh(new THREE.CylinderGeometry(size*0.6,size*0.6,size*1.5,16),new THREE.MeshPhongMaterial({color:Math.random()*0xffffff,shininess:70}));
            points=12;
            obj.userData={type:'cylinder',points:points,radius:size};
            break;
        case 'torus':
            size=Math.random()*0.8+0.5;
            obj=new THREE.Mesh(new THREE.TorusGeometry(size,0.3,16,32),new THREE.MeshPhongMaterial({color:Math.random()*0xffffff,shininess:90}));
            points=18;
            obj.userData={type:'torus',points:points,radius:size};
            break;
    }

    const x = (Math.random()-0.5)*(ROOM_SIZE.width-8);
    const z = (Math.random()-0.5)*(ROOM_SIZE.depth-8);
    obj.position.set(x,(obj.userData.size||obj.userData.radius||1)+0.5,z);
    obj.rotation.y=Math.random()*Math.PI;
    obj.rotation.x=Math.random()*0.5;
    obj.userData.rotationSpeed={x:(Math.random()-0.5)*0.02,y:(Math.random()-0.5)*0.02,z:(Math.random()-0.5)*0.02};
    obj.userData.floatSpeed=Math.random()*0.5+0.2;
    obj.userData.floatOffset=Math.random()*Math.PI*2;
    obj.userData.originalY=obj.position.y;
    obj.castShadow=true;
    obj.receiveShadow=true;
    scene.add(obj);
    gameObjects.push(obj);
    objectsRemaining++;
}

function updateObjectsAnimation(delta){
    gameObjects.forEach(obj=>{
        if(!obj) return;
        obj.rotation.x+=obj.userData.rotationSpeed.x;
        obj.rotation.y+=obj.userData.rotationSpeed.y;
        obj.rotation.z+=obj.userData.rotationSpeed.z;
        obj.position.y=obj.userData.originalY+Math.sin(performance.now()*0.001*obj.userData.floatSpeed+obj.userData.floatOffset)*0.3;
    });
}

function shoot(){
    if(!gameActive||shootCooldown>0||currentAmmo<=0||isReloading) return;
    
    const bullet=new THREE.Mesh(new THREE.SphereGeometry(0.15,16,16),new THREE.MeshBasicMaterial({color:0xFFFF00}));
    const dir=new THREE.Vector3(0,0,-1);
    dir.applyQuaternion(camera.quaternion);
    bullet.position.copy(camera.position).add(dir.clone().multiplyScalar(1.5));
    bullet.userData={velocity:dir.normalize().multiplyScalar(BULLET_SPEED),lifetime:2.0};
    scene.add(bullet);
    bullets.push(bullet);
    currentAmmo--;
    shootCooldown=SHOOT_COOLDOWN_TIME;
    
    showHitMarker();
    updateUI();
}

function updateBullets(delta){
    for(let i=bullets.length-1;i>=0;i--){
        const b=bullets[i];
        b.position.add(b.userData.velocity.clone().multiplyScalar(delta));
        b.userData.lifetime-=delta;
        for(let j=gameObjects.length-1;j>=0;j--){
            const obj=gameObjects[j];
            if(!obj) continue;
            const size=obj.userData.radius||obj.userData.size||1;
            if(b.position.distanceTo(obj.position)<size*1.2){
                scene.remove(obj);
                score+=obj.userData.points;
                gameObjects.splice(j,1);
                objectsRemaining--;
                scene.remove(b);
                bullets.splice(i,1);
                showHitMarker();
                setTimeout(spawnNewObject,100);
                updateUI();
                break;
            }
        }
        if(b.userData.lifetime<=0){
            scene.remove(b);
            bullets.splice(i,1);
        }
    }
    if(shootCooldown>0) shootCooldown-=delta;
}

function showHitMarker() {
    hitMarkerElement.style.opacity = '1';
    hitMarkerElement.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
        hitMarkerElement.style.opacity = '0';
        hitMarkerElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
}

function checkCollisions(){
    const r=0.8;
    const pos=camera.position.clone();
    for(const obj of gameObjects){
        if(!obj) continue;
        const d=pos.distanceTo(obj.position);
        const size=obj.userData.radius||obj.userData.size||1;
        if(d<r+size){
            const push=pos.clone().sub(obj.position).normalize();
            camera.position.add(push.multiplyScalar(0.15));
        }
    }
}

function updateCameraRotation(){
    camera.rotation.set(0,0,0,'YXZ');
    camera.rotateY(yaw);
    camera.rotateX(pitch);
}

function setupEventListeners(){
    document.addEventListener('keydown',e=>{
        if(!gameActive) return;
        switch(e.code){
            case'ArrowUp':case'KeyW':moveForward=true;break;
            case'ArrowDown':case'KeyS':moveBackward=true;break;
            case'ArrowLeft':case'KeyA':moveLeft=true;break;
            case'ArrowRight':case'KeyD':moveRight=true;break;
            case'ShiftLeft':case'ShiftRight':isRunning=true;break;
            case'Space':if(canJump&&!isJumping){velocity.y=JUMP_FORCE;canJump=false;isJumping=true;}break;
            case'KeyR':reloadAmmo();break;
        }
    });
    document.addEventListener('keyup',e=>{
        switch(e.code){
            case'ArrowUp':case'KeyW':moveForward=false;break;
            case'ArrowDown':case'KeyS':moveBackward=false;break;
            case'ArrowLeft':case'KeyA':moveLeft=false;break;
            case'ArrowRight':case'KeyD':moveRight=false;break;
            case'ShiftLeft':case'ShiftRight':isRunning=false;break;
            case'Space':isJumping=false;break;
        }
    });
    document.addEventListener('mousedown',e=>{
        if(e.button===0) shoot();
        renderer.domElement.requestPointerLock();
    });
    document.addEventListener('pointerlockchange',()=>{
        isLocked=document.pointerLockElement===renderer.domElement;
    });
    document.addEventListener('mousemove',e=>{
        if(!isLocked||!gameActive) return;
        yaw-=e.movementX*0.002;
        pitch-=e.movementY*0.002;
        pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,pitch));
        updateCameraRotation();
    });
    window.addEventListener('resize',()=>{
        camera.aspect=window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
    });
    fullscreenButton.addEventListener('click',toggleFullscreen);
    fullscreenButtonMenu.addEventListener('click',toggleFullscreen);
    restartButton.addEventListener('click',restartGame);
}

function reloadAmmo(){
    if(isReloading||currentAmmo===MAX_BULLETS) return;
    isReloading=true;
    reloadIndicatorElement.style.opacity = '1';
    
    setTimeout(()=>{
        currentAmmo=MAX_BULLETS;
        isReloading=false;
        reloadIndicatorElement.style.opacity = '0';
        updateUI();
    },1000);
}

function startGameTimer(){
    const interval=setInterval(()=>{
        if(!gameActive){clearInterval(interval);return;}
        gameTime--;
        updateTimerDisplay();
        if(gameTime<=0){gameActive=false;clearInterval(interval);endGame();}
    },1000);
}

function updateTimerDisplay(){
    const m=Math.floor(gameTime/60);
    const s=gameTime%60;
    timerElement.textContent=`${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function updateUI(){
    scoreElement.textContent=score;
    objectsElement.textContent=objectsRemaining;
    ammoElement.textContent=currentAmmo;
}

function endGame(){
    gameOverElement.style.display='block';
    finalScoreElement.textContent=score;
    hudElement.style.display='none';
}

function restartGame(){
    score=0;
    gameTime=120;
    gameActive=true;
    currentAmmo=MAX_BULLETS;
    bullets.forEach(b=>scene.remove(b));
    bullets=[];
    gameObjects.forEach(o=>scene.remove(o));
    gameObjects=[];
    camera.position.set(0,1.8,0);
    pitch=0;yaw=0;updateCameraRotation();
    createGameObjects();
    gameOverElement.style.display='none';
    hudElement.style.display='block';
    updateUI();
    updateTimerDisplay();
    startGameTimer();
}

function toggleFullscreen(){
    if(!document.fullscreenElement){document.documentElement.requestFullscreen();}
    else{document.exitFullscreen();}
}

function updatePosition(delta){
    if(!gameActive) return;
    const speed=isRunning?RUN_SPEED:WALK_SPEED;
    velocity.y-=GRAVITY*delta;
    const forward=new THREE.Vector3(0,0,-1);
    const right=new THREE.Vector3(1,0,0);
    forward.applyQuaternion(camera.quaternion);
    right.applyQuaternion(camera.quaternion);
    forward.y=0;right.y=0;forward.normalize();right.normalize();
    const moveX=(moveRight?1:0)-(moveLeft?1:0);
    const moveZ=(moveForward?1:0)-(moveBackward?1:0);
    camera.position.x+=(forward.x*moveZ+right.x*moveX)*speed*delta;
    camera.position.z+=(forward.z*moveZ+right.z*moveX)*speed*delta;
    camera.position.y+=velocity.y*delta;
    if(camera.position.y<1.8){camera.position.y=1.8;velocity.y=0;canJump=true;}
    if(camera.position.y>ROOM_SIZE.height-2){camera.position.y=ROOM_SIZE.height-2;velocity.y=0;}
    const halfW=ROOM_SIZE.width/2-1.5;
    const halfD=ROOM_SIZE.depth/2-1.5;
    camera.position.x=Math.max(-halfW,Math.min(halfW,camera.position.x));
    camera.position.z=Math.max(-halfD,Math.min(halfD,camera.position.z));
    checkCollisions();
}

function animate(){
    requestAnimationFrame(animate);
    const time=performance.now();
    const delta=(time-prevTime)/1000;
    prevTime=time;
    if(gameActive){
        updatePosition(delta);
        updateBullets(delta);
        updateObjectsAnimation(delta);
    }
    renderer.render(scene,camera);
}

window.onload=init;