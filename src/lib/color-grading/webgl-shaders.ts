// WebGL Shaders for High-Performance Color Grading

// Vertex shader - standard for image processing
export const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// Fragment shader with comprehensive color grading functions
export const fragmentShaderSource = `
  precision highp float;
  
  uniform sampler2D u_image;
  uniform sampler2D u_lut;
  
  // Basic adjustments
  uniform float u_exposure;
  uniform float u_contrast;
  uniform float u_highlights;
  uniform float u_shadows;
  uniform float u_whites;
  uniform float u_blacks;
  
  // Color adjustments
  uniform float u_temperature;
  uniform float u_tint;
  uniform float u_vibrance;
  uniform float u_saturation;
  uniform float u_hue;
  uniform float u_lightness;
  
  // Advanced adjustments
  uniform float u_clarity;
  uniform float u_dehaze;
  
  // Vignette
  uniform float u_vignetteAmount;
  uniform float u_vignetteMidpoint;
  uniform float u_vignetteRoundness;
  uniform float u_vignetteFeather;
  
  // Tone mapping
  uniform int u_toneMappingAlgorithm;
  uniform float u_toneMappingExposure;
  uniform float u_toneMappingWhitePoint;
  
  // LUT
  uniform bool u_useLUT;
  uniform float u_lutIntensity;
  
  varying vec2 v_texCoord;
  
  // Color space conversion matrices
  const mat3 sRGB_to_XYZ = mat3(
    0.4124564, 0.3575761, 0.1804375,
    0.2126729, 0.7151522, 0.0721750,
    0.0193339, 0.1191920, 0.9503041
  );
  
  const mat3 XYZ_to_sRGB = mat3(
    3.2404542, -1.5371385, -0.4985314,
    -0.9692660, 1.8760108, 0.0415560,
    0.0556434, -0.2040259, 1.0572252
  );
  
  // Temperature and tint adjustment
  vec3 adjustTemperatureTint(vec3 color, float temp, float tint) {
    // Convert temperature (2000K-10000K) to RGB multipliers
    float tempK = temp;
    vec3 tempColor;
    
    if (tempK < 6600.0) {
      tempColor.r = 1.0;
      tempColor.g = clamp(0.39008157 * log(tempK / 100.0) - 0.63184144, 0.0, 1.0);
      tempColor.b = tempK < 2000.0 ? 0.0 : clamp(0.543206789 * log((tempK / 100.0) - 10.0) - 1.19625408, 0.0, 1.0);
    } else {
      tempColor.r = clamp(1.29293618 * pow(tempK / 100.0 - 60.0, -0.1332047), 0.0, 1.0);
      tempColor.g = clamp(1.12989086 * pow(tempK / 100.0 - 60.0, -0.0755148), 0.0, 1.0);
      tempColor.b = 1.0;
    }
    
    // Apply temperature
    color *= tempColor;
    
    // Apply tint (green-magenta shift)
    color.g += tint * 0.01;
    color.r += tint * -0.005;
    color.b += tint * -0.005;
    
    return color;
  }
  
  // HSL conversion functions
  vec3 rgb2hsl(vec3 color) {
    float maxVal = max(max(color.r, color.g), color.b);
    float minVal = min(min(color.r, color.g), color.b);
    float delta = maxVal - minVal;
    
    vec3 hsl;
    hsl.z = (maxVal + minVal) * 0.5; // Lightness
    
    if (delta == 0.0) {
      hsl.x = 0.0; // Hue
      hsl.y = 0.0; // Saturation
    } else {
      hsl.y = hsl.z > 0.5 ? delta / (2.0 - maxVal - minVal) : delta / (maxVal + minVal);
      
      if (maxVal == color.r) {
        hsl.x = (color.g - color.b) / delta + (color.g < color.b ? 6.0 : 0.0);
      } else if (maxVal == color.g) {
        hsl.x = (color.b - color.r) / delta + 2.0;
      } else {
        hsl.x = (color.r - color.g) / delta + 4.0;
      }
      hsl.x /= 6.0;
    }
    
    return hsl;
  }
  
  vec3 hsl2rgb(vec3 hsl) {
    float c = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
    float x = c * (1.0 - abs(mod(hsl.x * 6.0, 2.0) - 1.0));
    float m = hsl.z - c * 0.5;
    
    vec3 rgb;
    if (hsl.x < 1.0/6.0) {
      rgb = vec3(c, x, 0.0);
    } else if (hsl.x < 2.0/6.0) {
      rgb = vec3(x, c, 0.0);
    } else if (hsl.x < 3.0/6.0) {
      rgb = vec3(0.0, c, x);
    } else if (hsl.x < 4.0/6.0) {
      rgb = vec3(0.0, x, c);
    } else if (hsl.x < 5.0/6.0) {
      rgb = vec3(x, 0.0, c);
    } else {
      rgb = vec3(c, 0.0, x);
    }
    
    return rgb + m;
  }
  
  // Tone mapping algorithms
  vec3 reinhardToneMapping(vec3 color, float exposure, float whitePoint) {
    color *= exposure;
    return color / (1.0 + color / (whitePoint * whitePoint));
  }
  
  vec3 acesToneMapping(vec3 color, float exposure) {
    color *= exposure;
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
  }
  
  vec3 uncharted2ToneMapping(vec3 color, float exposure, float whitePoint) {
    color *= exposure;
    const float A = 0.15;
    const float B = 0.50;
    const float C = 0.10;
    const float D = 0.20;
    const float E = 0.02;
    const float F = 0.30;
    
    vec3 mapped = ((color * (A * color + C * B) + D * E) / (color * (A * color + B) + D * F)) - E / F;
    vec3 whiteScale = 1.0 / (((whitePoint * (A * whitePoint + C * B) + D * E) / (whitePoint * (A * whitePoint + B) + D * F)) - E / F);
    
    return mapped * whiteScale;
  }
  
  // LUT sampling function
  vec3 sampleLUT(sampler2D lut, vec3 color) {
    float lutSize = 32.0; // Assuming 32x32x32 LUT
    float scale = (lutSize - 1.0) / lutSize;
    float offset = 1.0 / (2.0 * lutSize);
    
    color = clamp(color, 0.0, 1.0);
    
    float blueSlice = color.b * (lutSize - 1.0);
    float blueSliceFloor = floor(blueSlice);
    float blueSliceFrac = blueSlice - blueSliceFloor;
    
    vec2 coord1 = vec2(
      (color.r * scale + offset) + blueSliceFloor / lutSize,
      color.g * scale + offset
    );
    
    vec2 coord2 = vec2(
      (color.r * scale + offset) + (blueSliceFloor + 1.0) / lutSize,
      color.g * scale + offset
    );
    
    vec3 color1 = texture2D(lut, coord1).rgb;
    vec3 color2 = texture2D(lut, coord2).rgb;
    
    return mix(color1, color2, blueSliceFrac);
  }
  
  // Vignette effect
  vec3 applyVignette(vec3 color, vec2 coord, float amount, float midpoint, float roundness, float feather) {
    vec2 center = vec2(0.5, 0.5);
    vec2 diff = coord - center;
    diff.x *= roundness;
    
    float distance = length(diff);
    float vignette = smoothstep(midpoint, midpoint + feather, distance);
    
    return mix(color, color * (1.0 - amount), vignette);
  }
  
  void main() {
    vec3 color = texture2D(u_image, v_texCoord).rgb;
    
    // Apply exposure
    color *= pow(2.0, u_exposure);
    
    // Apply temperature and tint
    color = adjustTemperatureTint(color, u_temperature, u_tint);
    
    // Apply contrast
    color = (color - 0.5) * (1.0 + u_contrast) + 0.5;
    
    // Apply HSL adjustments
    vec3 hsl = rgb2hsl(color);
    hsl.x += u_hue / 360.0;
    hsl.y *= (1.0 + u_saturation);
    hsl.z += u_lightness;
    color = hsl2rgb(hsl);
    
    // Apply tone mapping
    if (u_toneMappingAlgorithm == 1) {
      color = reinhardToneMapping(color, u_toneMappingExposure, u_toneMappingWhitePoint);
    } else if (u_toneMappingAlgorithm == 2) {
      color = acesToneMapping(color, u_toneMappingExposure);
    } else if (u_toneMappingAlgorithm == 3) {
      color = uncharted2ToneMapping(color, u_toneMappingExposure, u_toneMappingWhitePoint);
    }
    
    // Apply LUT if enabled
    if (u_useLUT) {
      vec3 lutColor = sampleLUT(u_lut, color);
      color = mix(color, lutColor, u_lutIntensity);
    }
    
    // Apply vignette
    color = applyVignette(color, v_texCoord, u_vignetteAmount, u_vignetteMidpoint, u_vignetteRoundness, u_vignetteFeather);
    
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

// Shader compilation utilities
export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}
