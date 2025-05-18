/**
 * Config class provides runtime access to configurable thresholds and behaviors.
 * Combines user-provided options with sensible defaults for anomaly detection.
 */

export default class Config {
  private settings: Record<string, any>;

  constructor(userConfig: Record<string, any> = {}) {
    this.settings = {
      jumpThreshold: 150,

      linearityThreshold: 0.99,
      angleDeviationThreshold: 0.005,

      linearAngleTolerance: 4,

      edgeClickTolerance: 2, // 2-10px
      minEdgeClicks: 2,

      movementIntervalTolerance: 0.09,
      clickDurationTolerance: 0.1,
      mouseHistoryLimit: 100,
      suspiciousKeywords: [/virtual/i, /vmware/i, /vbox/i, /simulat/i, /emulat/i, /parallels/i],
      autoLog: true,
      endpoint: null,
      ...userConfig
    };
  }

  get(key: string): any {
    return this.settings[key];
  }

  set(key: string, value: any): void {
    this.settings[key] = value;
  }

  update(newConfig: Record<string, any>): void {
    this.settings = { ...this.settings, ...newConfig };
  }
}
