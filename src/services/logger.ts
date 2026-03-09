type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  url?: string;
}

class Logger {
  private sessionId: string;
  private isDev = import.meta.env.DEV;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId: sessionStorage.getItem('userId') || undefined,
      sessionId: this.sessionId,
      url: window.location.href,
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry(level, message, context);

    // Console logging
    const consoleMethod = level === 'debug' ? 'log' : level;
    console[consoleMethod](`[${level.toUpperCase()}]`, message, context || '');

    // Send to backend in production
    if (!this.isDev && level !== 'debug') {
      this.sendToBackend(entry);
    }

    // Store critical errors locally
    if (level === 'error') {
      this.storeLocally(entry);
    }
  }

  private async sendToBackend(entry: LogEntry) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7231/api'}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to backend:', error);
    }
  }

  private storeLocally(entry: LogEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      logs.push(entry);
      localStorage.setItem('error_logs', JSON.stringify(logs.slice(-50))); // Keep last 50
    } catch (error) {
      console.error('Failed to store log locally:', error);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    this.log('error', message, errorContext);
  }
}

export const logger = new Logger();
