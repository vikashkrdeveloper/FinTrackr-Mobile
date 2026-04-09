/**
 * Production-Grade Global Logger for FinTrackr
 * Inspired by industry standards for scalable logging architecture.
 */

type LogLevel = "info" | "warn" | "error" | "debug" | "success";

class LoggerService {
  private isDev = __DEV__;
  private originals = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  private log(level: LogLevel, message: string, meta?: any) {
    const logData = {
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };

    // Print to console in development with specific formatting
    if (this.isDev) {
      const emoji = this.getEmoji(level);
      const levelLabel = `[${level.toUpperCase()}]`;
      
      // Use standard console methods (original references to avoid loops)
      if (level === 'error') {
        this.originals.error(`${emoji} ${levelLabel} ${message}`, meta || "");
      } else if (level === 'warn') {
        this.originals.warn(`${emoji} ${levelLabel} ${message}`, meta || "");
      } else {
        this.originals.log(`${emoji} ${levelLabel} ${message}`, meta || "");
      }
    }

    // Transport Layer: Send to backend (placeholder)
    this.sendToServer(logData);
  }

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case "info": return "🔹";
      case "success": return "✅";
      case "warn": return "⚠️";
      case "error": return "❌";
      case "debug": return "🐛";
      default: return "📝";
    }
  }

  info(msg: string, meta?: any) {
    this.log("info", msg, meta);
  }

  success(msg: string, meta?: any) {
    this.log("success", msg, meta);
  }

  warn(msg: string, meta?: any) {
    this.log("warn", msg, meta);
  }

  error(msg: string, error?: any, data?: any) {
    this.log("error", msg, { error, ...data });
  }

  debug(msg: string, meta?: any) {
    this.log("debug", msg, meta);
  }

  private async sendToServer(logData: any) {
    try {
      // Placeholder for production monitoring (e.g., Sentry, Firebase, or custom API)
    } catch (err) {
      // Silent fail for transport issues
    }
  }
}

export const Logger = new LoggerService();
