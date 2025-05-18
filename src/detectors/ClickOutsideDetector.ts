/**
 * Detects clicks that occur on a DOM element but not within its actual visual boundaries.
 * Flags events where `target` differs from the real element under the pointer.
 */

import { Detector } from '../types';

export default class ClickOutsideDetector implements Detector {
  private config: any;
  private reporter: any;

  constructor(config: any, reporter: any) {
    this.config = config;
    this.reporter = reporter;
  }

  public start(): void {
    document.addEventListener('click', e => {
      const realTarget = document.elementFromPoint(e.clientX, e.clientY);
      if (!realTarget || !(e.target as HTMLElement).contains(realTarget)) {
        this.reporter.notify('Click registered outside of actual element', e);
      }
    });
  }
}
