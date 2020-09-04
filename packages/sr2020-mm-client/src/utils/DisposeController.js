export class DisposeController {
  constructor() {
    this.disposed = false;
  }

  dispose() {
    this.disposed = true;
  }

  isDisposed() {
    return this.disposed;
  }

  isDisposedCheck() {
    if (this.disposed) {
      throw new Error('Call of disposed instance');
    }
  }
}
