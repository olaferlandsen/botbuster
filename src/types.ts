/**
 * Type definitions for core interfaces used across the botbuster library.
 * Includes:
 *  - Detector: Interface all detectors must implement.
 *  - Issue: Structure used to report anomalies.
 *  - Config: Interface for accessing config values.
 *  - Reporter: Interface for logging and broadcasting issues.
 */

export interface Detector {
  start(): void | Promise<void>;
}

export interface Issue {
  reason: string;
  event: Event | null;
  time: number;
}

export interface Reporter {
  notify(reason: string, event?: Event | null): void;
  listen(callback: (issue: Issue) => void): void;
  getIssues(): Issue[];
}

export interface Config {
  get(key: string): any;
  set(key: string, value: any): void;
  update(newConfig: Record<string, any>): void;
}
