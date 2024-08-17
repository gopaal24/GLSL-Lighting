varying vec2 vUvs;
varying vec3 vNormals;
varying vec3 vPosition;
uniform samplerCube specMap;

uniform vec3 modelColor;
uniform vec3 ambientColor;
uniform vec3 hemiSkyColor;
uniform vec3 hemiGroundColor;
uniform vec3 directionColor;

uniform float ambientIntensity;
uniform float hemiIntensity;
uniform float directionIntensity;

// uniform float 

float inverseLerp(float value, float minValue, float maxValue){
    return (value -  minValue)/(maxValue - minValue);
}

float remap(float value, float  minA, float  maxA, float  minB, float  maxB){
    float t = inverseLerp(value, minA, maxA);
    return mix(minB, maxB, t);    
}

void main(void){
    vec3 baseColor = modelColor;
    vec3 lighting = vec3(.0);
    vec3 normals = normalize(vNormals);
    vec3 viewDir = normalize(cameraPosition - vPosition);
  
    vec3 color = vec3(.0);

    // Ambient
    vec3 ambient = ambientColor;

    // Hemi Light
    vec3 skyColor = hemiSkyColor;
    vec3 groundColor = hemiGroundColor;
	
    float hemiMix = remap(normals.y, -1.0, 1.0, 0.0, 1.0);
    vec3 hemi = mix(groundColor, skyColor, hemiMix);

    // Direction Light 
    vec3 lightDir = vec3(1.);
    vec3 lightColor = directionColor;
    float dp = max(0., dot(lightDir, normals));

    vec3 diffuse = dp * lightColor;

    // Phong Specular
    vec3 r = normalize(reflect(-lightDir, normals));
    float phongValue = max(0., dot(viewDir, r));
    phongValue = pow(phongValue, 2000.);

    vec3 specular = vec3(phongValue);

    // IBL Specular
    vec3 iblCoord = normalize(reflect(-viewDir, normals));
    vec3 iblSample = textureCube(specMap, iblCoord).xyz;

    specular += iblSample;

    // Fresnel Effect
    float fresnel = 1. - max(0., dot(viewDir, normals));
    fresnel = pow(fresnel, 2.);

    specular *= fresnel;

    lighting = ambient * 0.5 + hemi*.8 + diffuse*.5;

    //liner to gamma color correction
    color = pow(color, vec3(1./2.2));   
    
    color = baseColor * lighting + specular;


    gl_FragColor = vec4(color, 1.);
}