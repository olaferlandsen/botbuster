/**
 * Detects whether mouse movement is excessively linear or unnaturally consistent in direction,
 * which can be a sign of automation or bot behavior.
 */

import { Detector } from '../core/Detector';
import Config from '../core/Config';
import Reporter from '../core/Reporter';

interface Position {
  x: number;
  y: number;
}

export default class MouseLinearityDetector extends Detector {
  private positions: Position[] = [];
  private linearityScores: number[] = [];
  private maxPoints = 80; // max mouse points to track
  private scoreWindowSize = 10; // how many linearity scores to average

  constructor(config: Config, reporter: Reporter) {
    super(config, reporter);
  }

  public start(): void {
    document.addEventListener('mousemove', this.onMouseMove);
  }

  public stop(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  // Calculates the standard deviation of the angles between movement segments
  private calculateAngleDeviation(): number {
    if (this.positions.length < 3) return 0;

    const angles: number[] = [];

    for (let i = 2; i < this.positions.length; i++) {
      const a = this.positions[i - 2];
      const b = this.positions[i - 1];
      const c = this.positions[i];

      const angle1 = Math.atan2(b.y - a.y, b.x - a.x);
      const angle2 = Math.atan2(c.y - b.y, c.x - b.x);
      let angle = angle2 - angle1;

      // Normalize angle between -PI and PI
      angle = Math.atan2(Math.sin(angle), Math.cos(angle));
      angles.push(Math.abs(angle));
    }

    const mean = angles.reduce((a, b) => a + b, 0) / angles.length;
    const variance = angles.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / angles.length;
    return Math.sqrt(variance);
  }

  public onMouseMove = (event: MouseEvent): void => {
    this.positions.push({ x: event.clientX, y: event.clientY });

    if (this.positions.length > this.maxPoints) {
      this.positions.shift();
    }

    const warmUpThreshold = 40;
    if (this.positions.length >= warmUpThreshold) {
      const start = this.positions[0];
      const end = this.positions[this.positions.length - 1];
      const directDistance = Math.hypot(end.x - start.x, end.y - start.y);

      let realDistance = 0;
      for (let i = 1; i < this.positions.length; i++) {
        const prev = this.positions[i - 1];
        const curr = this.positions[i];
        realDistance += Math.hypot(curr.x - prev.x, curr.y - prev.y);
      }

      if (realDistance === 0) return;

      const linearity = directDistance / realDistance;
      this.linearityScores.push(linearity);
      if (this.linearityScores.length > this.scoreWindowSize) {
        this.linearityScores.shift();
      }

      const avgLinearity =
        this.linearityScores.reduce((a, b) => a + b, 0) / this.linearityScores.length;
      const threshold = this.config.get('linearityThreshold');
      const margin = 0.005;

      if (avgLinearity > threshold + margin) {
        this.reporter.notify('Mouse movement is too linear', event);
        return;
      }

      const angleDeviation = this.calculateAngleDeviation();
      const angleThreshold = this.config.get('angleDeviationThreshold') ?? 0.01;

      if (angleDeviation < angleThreshold) {
        this.reporter.notify(
          'Mouse movement is too directionally consistent (possible bot)',
          event
        );
        return;
      }
    }
  };
}
