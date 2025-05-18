/**
 * Detects mousemove events that occur at unnatural intervals (too fast or uniform).
 * Useful for identifying scripted or accelerated input.
 */

import { Detector } from '../types';

export default class MouseIntervalDetector implements Detector {
  private config: any;
  private reporter: any;
  private lastTime: number | null = null;

  constructor(config: any, reporter: any) {
    this.config = config;
    this.reporter = reporter;
  }

  public start(): void {
    document.addEventListener('mousemove', () => {
      const now = performance.now();
      if (this.lastTime !== null) {
        const interval = now - this.lastTime;

        if (interval > 1000 || interval === 0) {
          this.lastTime = now;
          return;
        }

        if (interval < this.config.get('movementIntervalTolerance')) {
          this.reporter.notify(`Mouse movement intervals too regular or fast: ${interval}`);
        }
      }
      this.lastTime = now;
    });
  }
}
