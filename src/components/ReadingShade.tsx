export class ReadingShade {
  private readonly node: HTMLElement | null;

  constructor(selector = '.shadeOverlay') {
    this.node = document.querySelector<HTMLElement>(selector);
  }

  setImmediate(opacity: number) {
    if (!this.node) return;
    this.node.style.transition = 'none';
    this.node.style.setProperty('--reading-shade-opacity', String(opacity));
    void this.node.offsetWidth;
  }

  fadeTo(opacity: number, durationMs: number, easing = 'ease-out') {
    if (!this.node) return;
    this.node.style.transition = `opacity ${durationMs}ms ${easing}`;
    this.node.style.setProperty('--reading-shade-opacity', String(opacity));
  }
}

