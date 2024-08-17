import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export class ShaderControls {
  constructor(material) {
    this.material = material;
    this.gui = new GUI();
    this.settingupParams();
    this.setupGUI();
  }

  settingupParams() {
    this.params = {
      model: {
        color: new THREE.Color("#7f7f7f"),
        metalness: 0.5,
        roughness: 0.5,
      },
      ambient: {
        intensity: 0.5,
        color: new THREE.Color("#7F7F7F"),
      },
      hemi: {
        Intensity: 0.5,
        "Sky Color": new THREE.Color("#004c99"),
        "Ground Color": new THREE.Color("#994c19"),
      },
      directional: {
        Intensity: 0.5,
        Position: {
          x: 1,
          y: 1,
          z: 1,
        },
        color: new THREE.Color("#ffffe5"),
      },
    };
  }

  setupGUI() {
    const model = this.gui.addFolder("Model");
    model.addColor(this.params.model, "color").onChange((value) => {
      this.material.uniforms.modelColor.value.set(value);
    });
    model.add(this.params.model, "roughness", 0.0, 1.0, 0.1).onChange((value) => {
      console.log(value)
      this.material.uniforms.roughness.value = value;
    });
    model.add(this.params.model, "metalness", 0.0, 1.0, 0.1).onChange((value) => {
      this.material.uniforms.metalness.value = value;
    });
    model.close();

    const ambient = this.gui.addFolder("Ambient Light");
    ambient
      .add(this.params.ambient, "intensity", 0.0, 1.0, 0.1)
      .name("Intensity")
      .onChange((value) => {
        this.material.uniforms.ambientIntensity.value = value;
      });
    ambient.addColor(this.params.ambient, "color").onChange((value) => {
      this.material.uniforms.ambientColor.value.set(value);
    });
    ambient.close();

    const hemi = this.gui.addFolder("Hemi Light");
    hemi.add(this.params.hemi, "Intensity", 0.0, 1.0, 0.1).onChange((value) => {
      this.material.uniforms.hemiIntensity.value = value;
    });
    hemi.addColor(this.params.hemi, "Sky Color").onChange((value) => {
      this.material.uniforms.hemiSkyColor.value.set(value);
    });
    hemi.addColor(this.params.hemi, "Ground Color").onChange((value) => {
      this.material.uniforms.hemiGroundColor.value.set(value);
    });
    hemi.close();

    const directional = this.gui.addFolder("Directional Light");
    directional
      .add(this.params.directional, "Intensity", 0.0, 1.0, 0.1)
      .onChange((value) => {
        this.material.uniforms.directionIntensity.value = value;
      });
    directional.close();

    const position = directional.addFolder("Position");
    position
      .add(this.params.directional.Position, "x", -10, 10, 0.1)
      .onChange((value) => {
        console.log(this.material.uniforms.directionPosition.value.x);
        this.material.uniforms.directionPosition.value.x = value;
      });
    position
      .add(this.params.directional.Position, "y", -10, 10, 0.1)
      .onChange((value) => {
        this.material.uniforms.directionPosition.value.y = value;
      });
    position
      .add(this.params.directional.Position, "z", -10, 10, 0.1)
      .onChange((value) => {
        this.material.uniforms.directionPosition.value.z = value;
      });
    position.close();

    directional.addColor(this.params.directional, "color").onChange((value) => {
      this.material.uniforms.directionColor.value.set(value);
    });
  }
}
