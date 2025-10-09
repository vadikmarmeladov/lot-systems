// Event Emitter
export class EventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

// Other utility functions
export const fp = {
  // Add any functional programming utilities your code uses
  pipe: (...fns: Function[]) => (x: any) => fns.reduce((v, f) => f(v), x),
  // Add other fp utilities as needed
};

// Add any other utilities that your code imports from '#shared/utils'
