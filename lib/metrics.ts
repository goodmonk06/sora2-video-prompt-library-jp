/**
 * Metrics collection utility
 * Provides simple metrics tracking for monitoring
 */

import { logger } from "./logger";

export interface MetricLabels {
  [key: string]: string | number;
}

class MetricsCollector {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, labels?: MetricLabels, value: number = 1) {
    const key = this.buildKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);

    logger.debug("Counter incremented", {
      metric: name,
      labels,
      value,
      total: current + value,
    });
  }

  /**
   * Set a gauge metric
   */
  setGauge(name: string, value: number, labels?: MetricLabels) {
    const key = this.buildKey(name, labels);
    this.gauges.set(key, value);

    logger.debug("Gauge set", { metric: name, labels, value });
  }

  /**
   * Record a histogram value (e.g., response time)
   */
  recordHistogram(name: string, value: number, labels?: MetricLabels) {
    const key = this.buildKey(name, labels);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);

    logger.debug("Histogram recorded", { metric: name, labels, value });
  }

  /**
   * Get current counter value
   */
  getCounter(name: string, labels?: MetricLabels): number {
    const key = this.buildKey(name, labels);
    return this.counters.get(key) || 0;
  }

  /**
   * Get current gauge value
   */
  getGauge(name: string, labels?: MetricLabels): number | undefined {
    const key = this.buildKey(name, labels);
    return this.gauges.get(key);
  }

  /**
   * Get histogram statistics
   */
  getHistogramStats(name: string, labels?: MetricLabels) {
    const key = this.buildKey(name, labels);
    const values = this.histograms.get(key) || [];

    if (values.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Get all metrics as a report
   */
  getReport() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Array.from(this.histograms.entries()).map(([key, values]) => ({
        key,
        ...this.getHistogramStats(key),
      })),
    };
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    logger.info("Metrics reset");
  }

  private buildKey(name: string, labels?: MetricLabels): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}=${v}`)
      .join(",");
    return `${name}{${labelStr}}`;
  }
}

// Singleton instance
export const metrics = new MetricsCollector();

// Common metric names as constants
export const METRICS = {
  API_REQUEST: "api_request_total",
  API_RESPONSE_TIME: "api_response_time_ms",
  API_ERROR: "api_error_total",
  PROMPT_CREATED: "prompt_created_total",
  PROMPT_VIEWED: "prompt_viewed_total",
  PROMPT_USED: "prompt_used_total",
  COLLECTION_CREATED: "collection_created_total",
  FAVORITE_ADDED: "favorite_added_total",
} as const;
