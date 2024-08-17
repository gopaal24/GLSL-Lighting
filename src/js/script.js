import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

import { ShaderControls } from "./controls.js";

class Shaders{
    constructor(){

    }

    async initialize(){
        this.threejs_ = new THREE.WebGLRenderer({antialias: true});
        document.body.appendChild(this.threejs_.domElement);

        window.addEventListener("resize", ()=>{
            this.onWindowResize_();
        }, false);

        this.scene_ = new THREE.Scene();
        this.camera_ = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera_.position.set(0,0, 5);

        const controls = new OrbitControls(this.camera_, this.threejs_.domElement)
        
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            "src/assets/cube/left.png",
            "src/assets/cube/right.png", 
            "src/assets/cube/top.png",
            "src/assets/cube/bottom.png",
            "src/assets/cube/front.png",
            "src/assets/cube/back.png"
        ]);

        this.scene_.background = texture;
        console.log(texture)
        
        await this.setupProject_();
        this.previousRAF_ = null;
        this.onWindowResize_();
        this.raf_();
    }

    async setupProject_(){
        
        const vsh = await fetch('src/Shaders/vertex-shader.glsl');
        const fsh = await fetch('src/Shaders/fragment-shader.glsl');

        this.material = new THREE.ShaderMaterial({
            uniforms:{
                modelColor: {value: new THREE.Color('#7F7F7F')}, 
                ambientColor: {value: new THREE.Color('#7F7F7F')}, 
                hemiSkyColor: {value: new THREE.Color('#004c99')}, 
                hemiGroundColor: {value: new THREE.Color('#994c19')}, 
                directionColor: {value: new THREE.Color('#ffffe5')},
                ambientIntensity: {value: 0.5}, 
                hemiIntensity: {value: 0.5}, 
                directionIntensity: {value: 0.5},
                directionPosition : {value: new THREE.Vector3(1, 1, 1)},
                roughness: {value: 0.5},
                metalness: {value: 0.5},
                specMap: {value: this.scene_.background}  
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text()
        });

        this.controls = new ShaderControls(this.material);

        const loader = new GLTFLoader();
        loader.load("src/assets/suzanne_animation_test.glb", (gltf)=>{
            gltf.scene.traverse((child)=>{
                child.material = this.material;
            });
            gltf.scene.rotation.x = -Math.PI/2
            this.scene_.add(gltf.scene)
        })

    }

    onWindowResize_(){
        this.camera_.aspect = window.innerWidth/window.innerHeight;
        this.camera_.updateProjectionMatrix();
        this.threejs_.setSize(window.innerWidth, window.innerHeight);
        this.threejs_.setPixelRatio(devicePixelRatio)
    }

    raf_(){
        requestAnimationFrame((t) => {
            if(this.previousRAF_ === null){
                this.previousRAF_ -= t;
            }
            this.step_(t - this.previousRAF_);
            this.threejs_.render(this.scene_, this.camera_);
            this.raf_();
            this.previousRAF_ = t;
        });
    }

    step_(timeElapsed){
    }
}

let APP_ = null;

window.addEventListener('DOMContentLoaded', async () => {
    APP_ = new Shaders();
    await APP_.initialize();
})
