/**
 * Abstract base class for all behavior detectors.
 * Each detector receives configuration and a reporter to notify about anomalies.
 */

import Config from './Config';
import Reporter from './Reporter';

export abstract class Detector {
  protected config: Config;
  protected reporter: Reporter;

  constructor(config: Config, reporter: Reporter) {
    this.config = config;
    this.reporter = reporter;
  }

  abstract start(): void;
  abstract stop(): void;
}
