export class VideoBackground {
  private readonly root: HTMLElement;

  constructor(_videoSelector = '.bgVideo', root: HTMLElement = document.body) {
    this.root = root;
  }

  setHomeState() {
    this.root.classList.remove('fx-active');
  }

  async startFromGesture() {
    this.root.classList.add('fx-active');
  }

  setReadingPace() {
    // No-op for CSS-only transition background.
  }
}
