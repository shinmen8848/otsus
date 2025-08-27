// LUT (Look-Up Table) Loader for Professional Color Grading
import { LUTSettings } from '@/types/color-grading';

export interface LUTData {
  size: number;
  data: Float32Array;
  format: 'cube' | '3dl' | 'lut';
}

export class LUTLoader {
  /**
   * Load and parse a LUT file
   */
  public static async loadLUT(file: File): Promise<LUTData> {
    const text = await file.text();
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'cube':
        return this.parseCubeLUT(text);
      case '3dl':
        return this.parse3DLLUT(text);
      case 'lut':
        return this.parseLUT(text);
      default:
        throw new Error(`Unsupported LUT format: ${extension}`);
    }
  }

  /**
   * Parse .cube format LUT (Adobe/DaVinci Resolve format)
   */
  private static parseCubeLUT(text: string): LUTData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    let size = 32; // default size
    const lutData: number[] = [];

    for (const line of lines) {
      if (line.startsWith('LUT_3D_SIZE')) {
        size = parseInt(line.split(' ')[1]);
        continue;
      }

      if (line.startsWith('DOMAIN_MIN') || line.startsWith('DOMAIN_MAX') || line.startsWith('TITLE')) {
        continue;
      }

      // Parse RGB values
      const values = line.split(/\s+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (values.length === 3) {
        lutData.push(...values);
      }
    }

    if (lutData.length !== size * size * size * 3) {
      throw new Error(`Invalid LUT data size. Expected ${size * size * size * 3}, got ${lutData.length}`);
    }

    return {
      size,
      data: new Float32Array(lutData),
      format: 'cube'
    };
  }

  /**
   * Parse .3dl format LUT (Autodesk/Lustre format)
   */
  private static parse3DLLUT(text: string): LUTData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    let size = 32;
    const lutData: number[] = [];
    let dataStarted = false;

    for (const line of lines) {
      // Check for size specification
      if (line.includes('3D')) {
        const sizeMatch = line.match(/(\d+)/);
        if (sizeMatch) {
          size = parseInt(sizeMatch[1]);
        }
        continue;
      }

      // Skip header lines
      if (line.includes('Mesh') || line.includes('3DMESH')) {
        dataStarted = true;
        continue;
      }

      if (!dataStarted) continue;

      // Parse RGB values
      const values = line.split(/\s+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (values.length >= 3) {
        lutData.push(values[0], values[1], values[2]);
      }
    }

    return {
      size,
      data: new Float32Array(lutData),
      format: '3dl'
    };
  }

  /**
   * Parse generic .lut format
   */
  private static parseLUT(text: string): LUTData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Try to detect format and size
    let size = 32;
    const lutData: number[] = [];

    for (const line of lines) {
      if (line.startsWith('#') || line.startsWith('//')) continue;

      const values = line.split(/\s+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (values.length >= 3) {
        lutData.push(values[0], values[1], values[2]);
      }
    }

    // Estimate size from data length
    const totalValues = lutData.length / 3;
    size = Math.round(Math.cbrt(totalValues));

    return {
      size,
      data: new Float32Array(lutData),
      format: 'lut'
    };
  }

  /**
   * Create a WebGL texture from LUT data
   */
  public static createLUTTexture(gl: WebGLRenderingContext, lutData: LUTData): WebGLTexture | null {
    const texture = gl.createTexture();
    if (!texture) return null;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Convert 3D LUT to 2D texture layout
    const textureSize = lutData.size * lutData.size;
    const textureData = new Uint8Array(textureSize * lutData.size * 4);

    for (let b = 0; b < lutData.size; b++) {
      for (let g = 0; g < lutData.size; g++) {
        for (let r = 0; r < lutData.size; r++) {
          const lutIndex = (b * lutData.size * lutData.size + g * lutData.size + r) * 3;
          const texIndex = (b * textureSize + g * lutData.size + r) * 4;

          textureData[texIndex] = Math.round(lutData.data[lutIndex] * 255);     // R
          textureData[texIndex + 1] = Math.round(lutData.data[lutIndex + 1] * 255); // G
          textureData[texIndex + 2] = Math.round(lutData.data[lutIndex + 2] * 255); // B
          textureData[texIndex + 3] = 255; // A
        }
      }
    }

    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA,
      textureSize, lutData.size, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, textureData
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return texture;
  }

  /**
   * Generate a preview thumbnail for a LUT
   */
  public static generateLUTPreview(lutData: LUTData, size: number = 64): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        // Create a gradient from red to blue
        const r = x / (size - 1);
        const g = y / (size - 1);
        const b = 0.5;

        // Apply LUT transformation
        const [newR, newG, newB] = this.sampleLUT(lutData, r, g, b);

        data[index] = Math.round(newR * 255);     // R
        data[index + 1] = Math.round(newG * 255); // G
        data[index + 2] = Math.round(newB * 255); // B
        data[index + 3] = 255;                    // A
      }
    }

    return imageData;
  }

  /**
   * Sample a color from the LUT
   */
  private static sampleLUT(lutData: LUTData, r: number, g: number, b: number): [number, number, number] {
    const size = lutData.size;
    const scale = size - 1;

    // Clamp input values
    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    b = Math.max(0, Math.min(1, b));

    // Calculate indices
    const rIndex = r * scale;
    const gIndex = g * scale;
    const bIndex = b * scale;

    const r0 = Math.floor(rIndex);
    const g0 = Math.floor(gIndex);
    const b0 = Math.floor(bIndex);

    const r1 = Math.min(r0 + 1, scale);
    const g1 = Math.min(g0 + 1, scale);
    const b1 = Math.min(b0 + 1, scale);

    const rFrac = rIndex - r0;
    const gFrac = gIndex - g0;
    const bFrac = bIndex - b0;

    // Trilinear interpolation
    const getValue = (ri: number, gi: number, bi: number) => {
      const index = (bi * size * size + gi * size + ri) * 3;
      return [
        lutData.data[index],
        lutData.data[index + 1],
        lutData.data[index + 2]
      ];
    };

    const c000 = getValue(r0, g0, b0);
    const c001 = getValue(r0, g0, b1);
    const c010 = getValue(r0, g1, b0);
    const c011 = getValue(r0, g1, b1);
    const c100 = getValue(r1, g0, b0);
    const c101 = getValue(r1, g0, b1);
    const c110 = getValue(r1, g1, b0);
    const c111 = getValue(r1, g1, b1);

    // Interpolate along r axis
    const c00 = [
      c000[0] * (1 - rFrac) + c100[0] * rFrac,
      c000[1] * (1 - rFrac) + c100[1] * rFrac,
      c000[2] * (1 - rFrac) + c100[2] * rFrac
    ];
    const c01 = [
      c001[0] * (1 - rFrac) + c101[0] * rFrac,
      c001[1] * (1 - rFrac) + c101[1] * rFrac,
      c001[2] * (1 - rFrac) + c101[2] * rFrac
    ];
    const c10 = [
      c010[0] * (1 - rFrac) + c110[0] * rFrac,
      c010[1] * (1 - rFrac) + c110[1] * rFrac,
      c010[2] * (1 - rFrac) + c110[2] * rFrac
    ];
    const c11 = [
      c011[0] * (1 - rFrac) + c111[0] * rFrac,
      c011[1] * (1 - rFrac) + c111[1] * rFrac,
      c011[2] * (1 - rFrac) + c111[2] * rFrac
    ];

    // Interpolate along g axis
    const c0 = [
      c00[0] * (1 - gFrac) + c10[0] * gFrac,
      c00[1] * (1 - gFrac) + c10[1] * gFrac,
      c00[2] * (1 - gFrac) + c10[2] * gFrac
    ];
    const c1 = [
      c01[0] * (1 - gFrac) + c11[0] * gFrac,
      c01[1] * (1 - gFrac) + c11[1] * gFrac,
      c01[2] * (1 - gFrac) + c11[2] * gFrac
    ];

    // Interpolate along b axis
    return [
      c0[0] * (1 - bFrac) + c1[0] * bFrac,
      c0[1] * (1 - bFrac) + c1[1] * bFrac,
      c0[2] * (1 - bFrac) + c1[2] * bFrac
    ];
  }

  /**
   * Validate LUT file format
   */
  public static validateLUTFile(file: File): boolean {
    const validExtensions = ['cube', '3dl', 'lut'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    return validExtensions.includes(extension || '');
  }
}
