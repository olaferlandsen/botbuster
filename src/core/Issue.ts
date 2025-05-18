/**
 * Represents a single anomaly detected in the system.
 * Captures the reason, associated DOM event (if any), and timestamp.
 */

export default class Issue {
  reason: string;
  event: Event | null;
  time: number;

  constructor(reason: string, event: Event | null = null) {
    this.reason = reason;
    this.event = event;
    this.time = Date.now();
  }
}
