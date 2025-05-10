/**
 * webhook-logger.ts
 * 
 * A utility for enhanced webhook debugging with structured logs,
 * request tracing, and persistent logging capabilities.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Generic type for log data
type LogData = Record<string, unknown>;

interface WebhookLogEntry {
  timestamp: string;
  level: LogLevel;
  webhookSource: string; // 'polar', 'clerk', etc.
  eventType: string;
  message: string;
  data?: LogData;
  requestId?: string;
}

// Generate a unique ID for each webhook request for tracing
const generateRequestId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// In-memory storage of recent webhook logs (useful for debug endpoints)
// This stores most recent logs in memory, limiting to prevent memory issues
const MAX_LOGS = 100;
const recentLogs: WebhookLogEntry[] = [];

/**
 * Main webhook logger function that provides structured logging
 */
export const webhookLogger = (webhookSource: string, requestId: string = generateRequestId()) => {
  const createLogEntry = (
    level: LogLevel,
    eventType: string,
    message: string,
    data?: unknown
  ): WebhookLogEntry => {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      webhookSource,
      eventType,
      message,
      data: typeof data === 'object' ? filterSensitiveData(data) as LogData : data as LogData,
      requestId
    };
    
    // Store in memory for recent logs (for debug endpoints)
    recentLogs.unshift(entry);
    if (recentLogs.length > MAX_LOGS) {
      recentLogs.pop();
    }
    
    return entry;
  };

  return {
    requestId,
    
    debug: (eventType: string, message: string, data?: unknown) => {
      const entry = createLogEntry('debug', eventType, message, data);
      console.log(`🔍 [${entry.webhookSource}] [${entry.eventType}] [${entry.requestId}] ${message}`);
      if (data) console.log(JSON.stringify(data, null, 2));
    },
    
    info: (eventType: string, message: string, data?: unknown) => {
      const entry = createLogEntry('info', eventType, message, data);
      console.log(`ℹ️ [${entry.webhookSource}] [${entry.eventType}] [${entry.requestId}] ${message}`);
      if (data) console.log(JSON.stringify(data, null, 2));
    },
    
    warn: (eventType: string, message: string, data?: unknown) => {
      const entry = createLogEntry('warn', eventType, message, data);
      console.warn(`⚠️ [${entry.webhookSource}] [${entry.eventType}] [${entry.requestId}] ${message}`);
      if (data) console.warn(JSON.stringify(data, null, 2));
    },
    
    error: (eventType: string, message: string, data?: unknown) => {
      const entry = createLogEntry('error', eventType, message, data);
      console.error(`❌ [${entry.webhookSource}] [${entry.eventType}] [${entry.requestId}] ${message}`);
      if (data) console.error(JSON.stringify(data, null, 2));
    },
    
    // Create a step logger for multi-step processes
    step: (eventType: string, stepName: string) => {
      const entry = createLogEntry('info', eventType, `Step: ${stepName}`);
      console.log(`📌 [${entry.webhookSource}] [${entry.eventType}] [${entry.requestId}] Step: ${stepName}`);
      return {
        success: (message: string, data?: unknown) => {
          const successEntry = createLogEntry('info', eventType, `✅ ${stepName} - ${message}`, data);
          console.log(`✅ [${successEntry.webhookSource}] [${successEntry.eventType}] [${successEntry.requestId}] ${stepName} - ${message}`);
          if (data) console.log(JSON.stringify(data, null, 2));
        },
        fail: (message: string, data?: unknown) => {
          const failEntry = createLogEntry('error', eventType, `❌ ${stepName} - ${message}`, data);
          console.error(`❌ [${failEntry.webhookSource}] [${failEntry.eventType}] [${failEntry.requestId}] ${stepName} - ${message}`);
          if (data) console.error(JSON.stringify(data, null, 2));
        }
      };
    },
    
    // Create a timer for performance tracking
    timer: (eventType: string, operationName: string) => {
      const startTime = Date.now();
      createLogEntry('debug', eventType, `⏱️ Started: ${operationName}`);
      
      return {
        end: (additionalMessage: string = '') => {
          const duration = Date.now() - startTime;
          const message = `⏱️ Completed: ${operationName} (${duration}ms)${additionalMessage ? ' - ' + additionalMessage : ''}`;
          createLogEntry('debug', eventType, message, { durationMs: duration });
          console.log(`⏱️ [${webhookSource}] [${eventType}] [${requestId}] ${message}`);
        }
      };
    }
  };
};

/**
 * Helper to filter out sensitive data that shouldn't be logged
 */
function filterSensitiveData(data: unknown): unknown {
  if (!data) return data;
  
  // Make a copy of the data to avoid modifying the original
  // Safe to use JSON.parse/stringify on unknown since we've checked it's not null
  const filteredData = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
  
  // List of sensitive fields to mask
  const sensitiveFields = [
    'password', 'token', 'secret', 'key', 'authentication',
    'authorization', 'credential', 'credit_card', 'card_number'
  ];
  
  // Recursively mask sensitive fields
  const maskSensitiveRecursive = (obj: Record<string, unknown>) => {
    if (typeof obj !== 'object' || obj === null) return;
    
    // Ensure we have a proper Record<string, unknown> before proceeding
    if (Object.getPrototypeOf(obj) !== Object.prototype) return;
    
    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase();
      
      // Check if this key contains any sensitive terms
      if (sensitiveFields.some(term => lowerKey.includes(term))) {
        if (typeof obj[key] === 'string') {
          // Mask the value but show first and last character
          const value = obj[key] as string;
          if (value.length > 2) {
            obj[key] = `${value.charAt(0)}${'*'.repeat(value.length - 2)}${value.charAt(value.length - 1)}`;
          } else {
            obj[key] = '***';
          }
        } else {
          obj[key] = '***';
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively check nested objects
        // Type assertion needed here to satisfy TypeScript
        maskSensitiveRecursive(obj[key] as Record<string, unknown>);
      }
    });
  };
  
  maskSensitiveRecursive(filteredData);
  return filteredData;
}

/**
 * Get recent webhook logs for debugging purposes
 */
export function getRecentWebhookLogs(
  limit: number = 20,
  source?: string,
  level?: LogLevel
): WebhookLogEntry[] {
  let filtered = [...recentLogs];
  
  if (source) {
    filtered = filtered.filter(log => log.webhookSource === source);
  }
  
  if (level) {
    filtered = filtered.filter(log => log.level === level);
  }
  
  return filtered.slice(0, limit);
}

/**
 * Formats an error object into a consistently structured object for logging
 */
interface ErrorDetails {
  name?: string;
  stack?: string;
  [key: string]: unknown;
}

export function formatError(error: unknown): { message: string; details?: ErrorDetails } {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
        ...Object.getOwnPropertyNames(error).reduce((acc, key) => {
          // TypeScript requires casting to unknown first, then indexing with the key
          acc[key] = (error as unknown as Record<string, unknown>)[key];
          return acc;
        }, {} as Record<string, unknown>),
      }
    };
  }
  
  return {
    message: String(error),
    details: typeof error === 'object' && error !== null ? 
      { value: error } as ErrorDetails : 
      { value: String(error) } as ErrorDetails
  };
} 