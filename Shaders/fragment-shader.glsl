varying vec2 vUvs;
varying vec3 vNormals;
varying vec3 vPosition;
uniform samplerCube specMap;

float inverseLerp(float value, float minValue, float maxValue){
    return (value -  minValue)/(maxValue - minValue);
}

float remap(float value, float  minA, float  maxA, float  minB, float  maxB){
    float t = inverseLerp(value, minA, maxA);
    return mix(minB, maxB, t);    
}

void main(void){
    vec3 baseColor = vec3(.3, .1, .0);
    vec3 lighting = vec3(.0);
    vec3 normals = normalize(vNormals);
    vec3 viewDir = normalize(cameraPosition - vPosition);
  
    vec3 color = vec3(.0);

    // Ambient
    vec3 ambient = vec3(0.5);

    // Hemi Light
    vec3 skyColor = vec3(.0, .3, .6);
    vec3 groundColor = vec3(.6, .3, .1);
	
    float hemiMix = remap(normals.y, -1.0, 1.0, 0.0, 1.0);
    vec3 hemi = mix(groundColor, skyColor, hemiMix);

    // Direction Light 
    vec3 lightDir = vec3(1.);
    vec3 lightColor = vec3(1., 1., .9);
    float dp = max(0., dot(lightDir, normals));

    vec3 diffuse = dp * lightColor;

    // Phong Specular
    vec3 r = normalize(reflect(-lightDir, normals));
    float phongValue = max(0., dot(viewDir, r));
    phongValue = pow(phongValue, 32.);

    vec3 specular = vec3(phongValue);

    // IBL Specular
    vec3 iblCoord = normalize(reflect(-viewDir, normals));
    vec3 iblSample = textureCube(specMap, iblCoord).xyz;

    specular += iblSample*0.5;

    // Fresnel Effect
    float fresnel = 1. - max(0., dot(viewDir, normals));
    fresnel = pow(fresnel, 2.);

    specular *= fresnel;

    lighting = ambient * 0.5 + hemi*0.5 + diffuse*.5;

    //liner to gamma color correction
    color = pow(color, vec3(1./2.2));   
    
    color = baseColor * lighting + specular;


    gl_FragColor = vec4(color, 1.);
}