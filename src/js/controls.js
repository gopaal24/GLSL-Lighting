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
          x: 0.2,
          y: 0.3,
          z: 0.2,
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
    model.close();

    const ambient = this.gui.addFolder("Ambient Light");
    ambient
      .add(this.params.ambient, "intensity", 0.0, 1.0, 0.1)
      .name("Intensity");
    ambient.addColor(this.params.ambient, "color").onChange((value) => {
        this.material.uniforms.ambientColor.value.set(value);
      });
    ambient.close();

    const hemi = this.gui.addFolder("Hemi Light");
    hemi.add(this.params.hemi, "Intensity", 0.0, 1.0, 0.1);
    hemi.addColor(this.params.hemi, "Sky Color").onChange((value) => {
        this.material.uniforms.hemiSkyColor.value.set(value);
      });
    hemi.addColor(this.params.hemi, "Ground Color").onChange((value) => {
        this.material.uniforms.hemiGroundColor.value.set(value);
      });
    hemi.close();

    const directional = this.gui.addFolder("Directional Light");
    directional.add(this.params.directional, "Intensity", 0.0, 1.0, 0.1);
    directional.close();

    const position = directional.addFolder("Position");
    position.add(this.params.directional.Position, "x", -10, 10, 0.1);
    position.add(this.params.directional.Position, "y", -10, 10, 0.1);
    position.add(this.params.directional.Position, "z", -10, 10, 0.1);
    position.close();

    directional.addColor(this.params.directional, "color").onChange((value) => {
        this.material.uniforms.directionColor.value.set(value);
      });
  }
}
