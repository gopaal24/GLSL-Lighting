varying vec2 vUvs;
varying vec3 vNormals;
varying vec3 vPosition;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vNormals = (modelMatrix * vec4(normal, 0.)).xyz;
    // vNormals = normal;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUvs = uv;
}