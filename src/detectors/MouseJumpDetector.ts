/**
 * Detects sudden jumps in cursor position with delayed timing, which may indicate virtualization artifacts
 * or input redirection (e.g., from VMs or bots).
 */

import { Detector } from '../types';

export default class MouseJumpDetector implements Detector {
  private config: any;
  private reporter: any;
  private lastMouseEventTime: number | null = null;
  private lastMousePos: { x: number; y: number } | null = null;

  constructor(config: any, reporter: any) {
    this.config = config;
    this.reporter = reporter;
  }

  private getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  public start(): void {
    document.addEventListener('mousemove', e => {
      const now = Date.now();

      if (this.lastMouseEventTime && this.lastMousePos) {
        const timeDelta = now - this.lastMouseEventTime;
        const dist = this.getDistance(this.lastMousePos, { x: e.clientX, y: e.clientY });
        if (dist > this.config.get('jumpThreshold') && timeDelta > 100) {
          this.reporter.notify('Jump in mouse movement detected', e);
        }
      }

      this.lastMousePos = { x: e.clientX, y: e.clientY };
      this.lastMouseEventTime = now;
    });
  }
}
