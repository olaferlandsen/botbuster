/**
 * TabVisibilityDetector
 *
 * Detects when the user leaves or returns to the browser tab or window,
 * ignoring blur/focus events from input elements like <input> or <textarea>.
 */

import { Detector } from '../core/Detector';

export default class TabVisibilityDetector extends Detector {
  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.reporter.notify('User has switched to another tab or window', null);
    }
  };

  private handleWindowBlur = (event: FocusEvent) => {
    const active = document.activeElement;
    if (
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement ||
      active instanceof HTMLSelectElement ||
      active instanceof HTMLButtonElement ||
      (active && active.hasAttribute('contenteditable'))
    ) {
      return;
    }

    this.reporter.notify('User has blurred the window', event);
  };

  start() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleWindowBlur);
  }

  stop() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleWindowBlur);
  }
}
