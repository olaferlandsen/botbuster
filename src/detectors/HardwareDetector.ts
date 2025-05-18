/**
 * Inspects browser APIs to detect suspicious hardware or virtualization environments.
 * Looks at media device labels and WebGL vendor strings to flag virtual or emulated sources.
 */

import { Detector } from '../types';

export default class HardwareDetector implements Detector {
  private config: any;
  private reporter: any;

  constructor(config: any, reporter: any) {
    this.config = config;
    this.reporter = reporter;
  }

  private async checkDevices(): Promise<void> {
    if (navigator.mediaDevices?.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      devices.forEach(device => {
        if (this.config.get('suspiciousKeywords').some((r: RegExp) => r.test(device.label))) {
          this.reporter.notify(`Suspicious media device vendor: ${device.label}`);
        }
      });
    }
  }

  private checkWebGL(): void {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const keywords = this.config.get('suspiciousKeywords');
        if (
          keywords.some((r: RegExp) => r.test(vendor)) ||
          keywords.some((r: RegExp) => r.test(renderer))
        ) {
          this.reporter.notify(`Suspicious WebGL vendor or renderer: ${vendor}, ${renderer}`);
        }
      }
    }
  }

  public async start(): Promise<void> {
    await this.checkDevices();
    this.checkWebGL();
  }
}
