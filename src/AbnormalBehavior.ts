/**
 * AbnormalBehavior orchestrates anomaly detection by managing detectors, config, and reporting.
 * It serves as the core entry point of the botbuster library, allowing users to register and run detectors.
 *
 * Usage: create an instance, register detectors with `.use()`, and start monitoring with `.start()`.
 */

import Config from './core/Config';
import Reporter from './core/Reporter';
import { Detector } from './types';

export default class AbnormalBehavior {
  public config: Config;
  public reporter: Reporter;
  private detectors: Detector[] = [];

  constructor(userConfig: Record<string, any> = {}) {
    this.config = new Config(userConfig);
    this.reporter = new Reporter(this.config);
  }

  use(detector: Detector): void {
    this.detectors.push(detector);
    if (typeof detector.start === 'function') {
      detector.start();
    }
  }

  start(): void {
    this.detectors.forEach(det => {
      if (typeof det.start === 'function') {
        det.start();
      }
    });
  }

  listen(callback: (issue: any) => void): void {
    this.reporter.listen(callback);
  }

  getIssues(): any[] {
    return this.reporter.getIssues();
  }

  setConfig(newConfig: Record<string, any>): void {
    this.config.update(newConfig);
  }

  static createPlugin(PluginClass: new (config: any, reporter: any) => Detector) {
    return (config: any, reporter: any) => new PluginClass(config, reporter);
  }
}
