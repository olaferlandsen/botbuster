/**
 * Reporter manages anomaly notifications. It can log issues, send them to a backend, or dispatch to listeners.
 * Supports auto-logging and optional endpoint reporting.
 */

import Issue from './Issue';

export default class Reporter {
  private config: any;
  private listeners: ((issue: Issue) => void)[] = [];
  private issues: Issue[] = [];

  constructor(config: any) {
    this.config = config;
  }

  notify(reason: string, event: Event | null = null): void {
    const issue = new Issue(reason, event);
    this.issues.push(issue);

    if (this.config.get('autoLog')) {
      console.warn('[Botbuster]', reason, event);
    }

    if (this.config.get('endpoint')) {
      fetch(this.config.get('endpoint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issue)
      }).catch(() => {});
    }

    this.listeners.forEach(cb => cb(issue));
  }

  listen(callback: (issue: Issue) => void): void {
    this.listeners.push(callback);
  }

  getIssues(): Issue[] {
    return [...this.issues];
  }
}
