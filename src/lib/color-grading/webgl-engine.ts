import { 
  ColorGradingEngine, 
  ColorGradingSettings, 
  ColorSpaceSettings, 
  PerformanceMetrics 
} from '@/types/color-grading';
import { 
  vertexShaderSource, 
  fragmentShaderSource, 
  createShader, 
  createProgram 
} from './webgl-shaders';

export class WebGLColorGradingEngine implements ColorGradingEngine {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private canvas: HTMLCanvasElement;
  private uniforms: { [key: string]: WebGLUniformLocation | null } = {};
  private attributes: { [key: string]: number } = {};
  private textures: { image?: WebGLTexture; lut?: WebGLTexture } = {};
  private framebuffer: WebGLFramebuffer | null = null;
  private isInitialized = false;
  private performanceMetrics: PerformanceMetrics = {
    processingTime: 0,
    fps: 0,
    memoryUsage: 0
  };

  constructor() {
    this.canvas = document.createElement('canvas');
    this.initialize();
  }

  private initialize(): boolean {
    try {
      this.gl = this.canvas.getContext('webgl', {
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
        antialias: false
      });

      if (!this.gl) {
        console.warn('WebGL not supported, falling back to Canvas API');
        return false;
      }

      // Create shaders
      const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

      if (!vertexShader || !fragmentShader) {
        console.error('Failed to create shaders');
        return false;
      }

      // Create program
      this.program = createProgram(this.gl, vertexShader, fragmentShader);
      if (!this.program) {
        console.error('Failed to create shader program');
        return false;
      }

      // Get uniform and attribute locations
      this.setupUniforms();
      this.setupAttributes();
      this.setupGeometry();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('WebGL initialization failed:', error);
      return false;
    }
  }

  private setupUniforms(): void {
    if (!this.gl || !this.program) return;

    const uniformNames = [
      'u_image', 'u_lut',
      'u_exposure', 'u_contrast', 'u_highlights', 'u_shadows', 'u_whites', 'u_blacks',
      'u_temperature', 'u_tint', 'u_vibrance', 'u_saturation', 'u_hue', 'u_lightness',
      'u_clarity', 'u_dehaze',
      'u_vignetteAmount', 'u_vignetteMidpoint', 'u_vignetteRoundness', 'u_vignetteFeather',
      'u_toneMappingAlgorithm', 'u_toneMappingExposure', 'u_toneMappingWhitePoint',
      'u_useLUT', 'u_lutIntensity'
    ];

    uniformNames.forEach(name => {
      this.uniforms[name] = this.gl!.getUniformLocation(this.program!, name);
    });
  }

  private setupAttributes(): void {
    if (!this.gl || !this.program) return;

    this.attributes.position = this.gl.getAttribLocation(this.program, 'a_position');
    this.attributes.texCoord = this.gl.getAttribLocation(this.program, 'a_texCoord');
  }

  private setupGeometry(): void {
    if (!this.gl) return;

    // Create quad geometry
    const positions = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1, 1,   1, -1,   1, 1
    ]);

    const texCoords = new Float32Array([
      0, 0,  1, 0,  0, 1,
      0, 1,  1, 0,  1, 1
    ]);

    // Position buffer
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    // Texture coordinate buffer
    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);

    // Setup vertex attributes
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.enableVertexAttribArray(this.attributes.position);
    this.gl.vertexAttribPointer(this.attributes.position, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.enableVertexAttribArray(this.attributes.texCoord);
    this.gl.vertexAttribPointer(this.attributes.texCoord, 2, this.gl.FLOAT, false, 0, 0);
  }

  private createTexture(imageData: ImageData): WebGLTexture | null {
    if (!this.gl) return null;

    const texture = this.gl.createTexture();
    if (!texture) return null;

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, 
      imageData.width, imageData.height, 0,
      this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageData.data
    );

    // Set texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  private setUniforms(settings: ColorGradingSettings): void {
    if (!this.gl || !this.program) return;

    this.gl.useProgram(this.program);

    // Basic adjustments
    this.gl.uniform1f(this.uniforms.u_exposure, settings.exposure);
    this.gl.uniform1f(this.uniforms.u_contrast, settings.contrast);
    this.gl.uniform1f(this.uniforms.u_highlights, settings.highlights);
    this.gl.uniform1f(this.uniforms.u_shadows, settings.shadows);
    this.gl.uniform1f(this.uniforms.u_whites, settings.whites);
    this.gl.uniform1f(this.uniforms.u_blacks, settings.blacks);

    // Color adjustments
    this.gl.uniform1f(this.uniforms.u_temperature, settings.temperature);
    this.gl.uniform1f(this.uniforms.u_tint, settings.tint);
    this.gl.uniform1f(this.uniforms.u_vibrance, settings.vibrance);
    this.gl.uniform1f(this.uniforms.u_saturation, settings.saturation);
    this.gl.uniform1f(this.uniforms.u_hue, settings.hue);
    this.gl.uniform1f(this.uniforms.u_lightness, settings.lightness);

    // Advanced adjustments
    this.gl.uniform1f(this.uniforms.u_clarity, settings.clarity);
    this.gl.uniform1f(this.uniforms.u_dehaze, settings.dehaze);

    // Vignette
    this.gl.uniform1f(this.uniforms.u_vignetteAmount, settings.vignette.amount);
    this.gl.uniform1f(this.uniforms.u_vignetteMidpoint, settings.vignette.midpoint);
    this.gl.uniform1f(this.uniforms.u_vignetteRoundness, settings.vignette.roundness);
    this.gl.uniform1f(this.uniforms.u_vignetteFeather, settings.vignette.feather);

    // Tone mapping
    const toneMappingAlgorithms = { 'linear': 0, 'reinhard': 1, 'aces': 2, 'uncharted2': 3 };
    this.gl.uniform1i(this.uniforms.u_toneMappingAlgorithm, toneMappingAlgorithms[settings.toneMapping.algorithm]);
    this.gl.uniform1f(this.uniforms.u_toneMappingExposure, settings.toneMapping.exposure);
    this.gl.uniform1f(this.uniforms.u_toneMappingWhitePoint, settings.toneMapping.whitePoint);

    // LUT
    this.gl.uniform1i(this.uniforms.u_useLUT, settings.lut ? 1 : 0);
    if (settings.lut) {
      this.gl.uniform1f(this.uniforms.u_lutIntensity, settings.lut.intensity);
    }

    // Texture units
    this.gl.uniform1i(this.uniforms.u_image, 0);
    this.gl.uniform1i(this.uniforms.u_lut, 1);
  }

  public async processImage(
    imageData: ImageData,
    settings: ColorGradingSettings,
    colorSpace?: ColorSpaceSettings
  ): Promise<ImageData> {
    const startTime = performance.now();

    if (!this.isInitialized || !this.gl) {
      throw new Error('WebGL engine not initialized');
    }

    try {
      // Set canvas size
      this.canvas.width = imageData.width;
      this.canvas.height = imageData.height;
      this.gl.viewport(0, 0, imageData.width, imageData.height);

      // Create and bind texture
      if (this.textures.image) {
        this.gl.deleteTexture(this.textures.image);
      }
      this.textures.image = this.createTexture(imageData);

      if (!this.textures.image) {
        throw new Error('Failed to create texture');
      }

      // Bind textures
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.image);

      if (this.textures.lut) {
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.lut);
      }

      // Set uniforms
      this.setUniforms(settings);

      // Render
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

      // Read pixels
      const pixels = new Uint8ClampedArray(imageData.width * imageData.height * 4);
      this.gl.readPixels(0, 0, imageData.width, imageData.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);

      // Update performance metrics
      const endTime = performance.now();
      this.performanceMetrics.processingTime = endTime - startTime;
      this.performanceMetrics.fps = 1000 / this.performanceMetrics.processingTime;

      return new ImageData(pixels, imageData.width, imageData.height);
    } catch (error) {
      console.error('WebGL processing error:', error);
      throw error;
    }
  }

  public supportsWebGL(): boolean {
    return this.isInitialized;
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  public dispose(): void {
    if (this.gl) {
      if (this.textures.image) this.gl.deleteTexture(this.textures.image);
      if (this.textures.lut) this.gl.deleteTexture(this.textures.lut);
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.framebuffer) this.gl.deleteFramebuffer(this.framebuffer);
    }
    this.isInitialized = false;
  }
}
