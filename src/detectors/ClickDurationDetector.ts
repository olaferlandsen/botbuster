/**
 * Detects mouse clicks that are too short in duration between mousedown and mouseup.
 * These events may indicate automation rather than human interaction.
 */
export default class ClickDurationDetector {
  private config: any;
  private reporter: any;
  private startTime: number | null = null;

  constructor(config: any, reporter: any) {
    this.config = config;
    this.reporter = reporter;
  }

  start() {
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  stop() {
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  private onMouseDown = () => {
    this.startTime = performance.now();
  };

  private onMouseUp = () => {
    if (this.startTime === null) return;
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    if (duration < this.config.clickDurationTolerance) {
      this.reporter.notify(`Click duration too short: ${duration.toFixed(3)} ms`);
    }

    this.startTime = null;
  };
}
