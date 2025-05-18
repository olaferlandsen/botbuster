import { Detector } from '../types';

interface ClickStats {
  count: number;
  edgeHits: number;
}
/**
 * Detects clicks occurring near the edges of DOM elements, which is uncommon for real users.
 * Useful to flag automated or imprecise input systems.
 */
export default class ClickEdgeDetector implements Detector {
  private config: any;
  private reporter: any;
  private clickHistory: Map<HTMLElement, ClickStats> = new Map();

  constructor(config: any, reporter: any) {
    this.config = config;
    this.reporter = reporter;
  }

  public start(): void {
    document.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();

      if (!target || !rect || !this.isVisible(target)) return;
      if (rect.width < 20 || rect.height < 20) return;
      if (e.clientX === 0 && e.clientY === 0) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const tol = parseInt(this.config.get('edgeClickTolerance'), 10);
      const minEdgeClicks = parseInt(this.config.get('minEdgeClicks'), 10);

      if (isNaN(tol) || tol < 1 || tol > 50) return;
      if (isNaN(minEdgeClicks) || minEdgeClicks < 1) return;

      const nearEdge =
        clickX < tol || clickY < tol || rect.width - clickX < tol || rect.height - clickY < tol;

      this.updateClickStats(target, nearEdge);

      if (nearEdge) {
        this.reporter.notify('Click near edge of element', e);
      }

      const stats = this.clickHistory.get(target);
      if (
        stats &&
        stats.count >= 5 &&
        stats.edgeHits >= minEdgeClicks &&
        stats.edgeHits / stats.count > 0.8
      ) {
        this.reporter.notify('Suspicious click pattern near edges', {
          target,
          stats
        });
      }
    });
  }

  private isVisible(el: HTMLElement): boolean {
    const style = window.getComputedStyle(el);
    return (
      style && style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null
    );
  }

  private updateClickStats(el: HTMLElement, isEdge: boolean): void {
    const stats = this.clickHistory.get(el) || { count: 0, edgeHits: 0 };
    stats.count += 1;
    if (isEdge) stats.edgeHits += 1;
    this.clickHistory.set(el, stats);
  }
}
