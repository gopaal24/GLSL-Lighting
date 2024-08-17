import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

class Shaders{
    constructor(){

    }

    async initialize(){
        this.threejs_ = new THREE.WebGLRenderer();
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
            "./assets/left.png",
            "./assets/right.png", 
            "./assets/top.png",
            "./assets/bottom.png",
            "./assets/front.png",
            "./assets/back.png"
        ]);

        this.scene_.background = texture;
        console.log(texture)
        
        await this.setupProject_();
        this.previousRAF_ = null;
        this.onWindowResize_();
        this.raf_();
    }

    async setupProject_(){
        const vsh = await fetch('./shaders/vertex-shader.glsl');
        const fsh = await fetch('./shaders/fragment-shader.glsl');

        this.material = new THREE.ShaderMaterial({
            uniforms:{
                iTime: { value: 0.0 },
                iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }   
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text()
        });

        const loader = new GLTFLoader();
        loader.load("./assets/suzanne.glb", (gltf)=>{
            gltf.scene.traverse((child)=>{
                child.material = this.material;
            });
            this.scene_.add(gltf.scene)
        })

        const geometry = new THREE.PlaneGeometry(1,1);
        const plane = new THREE.Mesh(geometry, this.material);
        // this.scene_.add(plane);
        this.clock = new THREE.Clock();
        this.time = 0.2
    }

    onWindowResize_(){
        this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }

    raf_(){
        requestAnimationFrame((t) => {
            if(this.previousRAF_ === null){
                this.previousRAF_ -= t;
            }
            this.time = this.clock.getElapsedTime();
            this.material.uniforms.iTime.value = this.time*3;
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