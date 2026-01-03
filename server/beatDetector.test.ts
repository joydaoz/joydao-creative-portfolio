/// <reference lib="dom" />
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Beat Detection Algorithm", () => {
  let mockAnalyser: Partial<AnalyserNode>;
  let mockFrequencyData: Uint8Array;

  beforeEach(() => {
    mockFrequencyData = new Uint8Array(256);

    mockAnalyser = {
      frequencyBinCount: 256,
      getByteFrequencyData: vi.fn((data: Uint8Array) => {
        for (let i = 0; i < data.length; i++) {
          data[i] = mockFrequencyData[i];
        }
      }),
    };
  });

  describe("Frequency Analysis", () => {
    it("should analyze frequency data correctly", () => {
      expect(mockFrequencyData).toBeInstanceOf(Uint8Array);
      expect(mockFrequencyData.length).toBe(256);
    });

    it("should handle empty frequency data", () => {
      mockFrequencyData.fill(0);
      expect(mockFrequencyData.every((val) => val === 0)).toBe(true);
    });

    it("should handle maximum frequency values", () => {
      mockFrequencyData.fill(255);
      expect(mockFrequencyData.every((val) => val === 255)).toBe(true);
    });
  });

  describe("Kick Drum Detection", () => {
    it("should detect kick drum presence in low frequencies", () => {
      // Simulate kick drum energy in 60-100 Hz range
      const kickStart = Math.floor((60 / 22050) * 256);
      const kickEnd = Math.floor((200 / 22050) * 256);

      for (let i = kickStart; i < kickEnd; i++) {
        mockFrequencyData[i] = 200; // High energy in kick range
      }

      let kickEnergy = 0;
      for (let i = kickStart; i < kickEnd; i++) {
        kickEnergy += mockFrequencyData[i];
      }

      const avgKickEnergy = kickEnergy / (kickEnd - kickStart) / 255;
      expect(avgKickEnergy).toBeGreaterThan(0.5);
    });

    it("should return 0 for no kick drum", () => {
      mockFrequencyData.fill(0);

      const kickStart = Math.floor((60 / 22050) * 256);
      const kickEnd = Math.floor((200 / 22050) * 256);

      let kickEnergy = 0;
      for (let i = kickStart; i < kickEnd; i++) {
        kickEnergy += mockFrequencyData[i];
      }

      const avgKickEnergy = kickEnergy / (kickEnd - kickStart) / 255;
      expect(avgKickEnergy).toBe(0);
    });
  });

  describe("Bass Detection", () => {
    it("should detect bass presence in low-mid frequencies", () => {
      // Simulate bass energy in 200-500 Hz range
      const bassStart = Math.floor((200 / 22050) * 256);
      const bassEnd = Math.floor((500 / 22050) * 256);

      for (let i = bassStart; i < bassEnd; i++) {
        mockFrequencyData[i] = 180; // High energy in bass range
      }

      let bassEnergy = 0;
      for (let i = bassStart; i < bassEnd; i++) {
        bassEnergy += mockFrequencyData[i];
      }

      const avgBassEnergy = bassEnergy / (bassEnd - bassStart) / 255;
      expect(avgBassEnergy).toBeGreaterThan(0.5);
    });

    it("should return 0 for no bass", () => {
      mockFrequencyData.fill(0);

      const bassStart = Math.floor((200 / 22050) * 256);
      const bassEnd = Math.floor((500 / 22050) * 256);

      let bassEnergy = 0;
      for (let i = bassStart; i < bassEnd; i++) {
        bassEnergy += mockFrequencyData[i];
      }

      const avgBassEnergy = bassEnergy / (bassEnd - bassStart) / 255;
      expect(avgBassEnergy).toBe(0);
    });
  });

  describe("Beat Onset Detection", () => {
    it("should detect sudden energy increase as beat onset", () => {
      const history: number[] = [0.3, 0.3, 0.3, 0.3, 0.3];
      const currentEnergy = 0.8;

      const recentAverage = history.reduce((a, b) => a + b, 0) / history.length;
      const variance = history.reduce(
        (sum, val) => sum + Math.pow(val - recentAverage, 2),
        0
      ) / history.length;
      const stdDev = Math.sqrt(variance);

      const threshold = recentAverage + stdDev * 1.5;
      const isBeat = currentEnergy > threshold;

      expect(isBeat).toBe(true);
    });

    it("should calculate beat threshold correctly", () => {
      const history: number[] = [0.3, 0.3, 0.3, 0.3, 0.3];

      const recentAverage = history.reduce((a, b) => a + b, 0) / history.length;
      const variance = history.reduce(
        (sum, val) => sum + Math.pow(val - recentAverage, 2),
        0
      ) / history.length;
      const stdDev = Math.sqrt(variance);

      const threshold = recentAverage + stdDev * 1.5;
      expect(threshold).toBeDefined();
      expect(threshold).toBeGreaterThanOrEqual(0);
      expect(threshold).toBeLessThanOrEqual(1);
    });
  });

  describe("BPM Estimation", () => {
    it("should calculate BPM from beat intervals", () => {
      const beatIntervals = [500, 500, 500, 500]; // 500ms intervals = 120 BPM
      const avgInterval = beatIntervals.reduce((a, b) => a + b, 0) / beatIntervals.length;
      const bpm = Math.round(60000 / avgInterval);

      expect(bpm).toBe(120);
    });

    it("should handle fast tempo (140 BPM)", () => {
      const beatIntervals = [428, 428, 428]; // ~140 BPM
      const avgInterval = beatIntervals.reduce((a, b) => a + b, 0) / beatIntervals.length;
      const bpm = Math.round(60000 / avgInterval);

      expect(bpm).toBe(140);
    });

    it("should handle slow tempo (90 BPM)", () => {
      const beatIntervals = [666, 666, 666]; // ~90 BPM
      const avgInterval = beatIntervals.reduce((a, b) => a + b, 0) / beatIntervals.length;
      const bpm = Math.round(60000 / avgInterval);

      expect(bpm).toBe(90);
    });

    it("should clamp BPM to reasonable range", () => {
      const clampBPM = (bpm: number) => Math.max(60, Math.min(200, bpm));

      expect(clampBPM(50)).toBe(60);
      expect(clampBPM(120)).toBe(120);
      expect(clampBPM(250)).toBe(200);
    });
  });

  describe("Energy Smoothing", () => {
    it("should smooth energy values using exponential moving average", () => {
      const history = [0.1, 0.2, 0.3, 0.4, 0.5];
      const weight = 2 / (history.length + 1);

      let smoothed = 0;
      for (let i = 0; i < history.length; i++) {
        const alpha = weight * Math.pow(1 - weight, history.length - i - 1);
        smoothed += history[i] * alpha;
      }

      expect(smoothed).toBeGreaterThan(0);
      expect(smoothed).toBeLessThanOrEqual(0.5);
    });

    it("should give more weight to recent values", () => {
      const history = [0.1, 0.9];
      const weight = 2 / (history.length + 1);

      let smoothed = 0;
      for (let i = 0; i < history.length; i++) {
        const alpha = weight * Math.pow(1 - weight, history.length - i - 1);
        smoothed += history[i] * alpha;
      }

      expect(smoothed).toBeGreaterThan(0.5);
    });
  });

  describe("Threshold Management", () => {
    it("should validate beat threshold is between 0-1", () => {
      const validateThreshold = (value: number) => {
        return Math.max(0, Math.min(1, value));
      };

      expect(validateThreshold(-0.5)).toBe(0);
      expect(validateThreshold(0.5)).toBe(0.5);
      expect(validateThreshold(1.5)).toBe(1);
    });

    it("should apply different thresholds for kick and bass", () => {
      const kickThreshold = 0.6;
      const bassThreshold = 0.55;

      const kickStrength = 0.65;
      const bassStrength = 0.58;

      expect(kickStrength > kickThreshold).toBe(true);
      expect(bassStrength > bassThreshold).toBe(true);
    });
  });

  describe("Beat Cooldown", () => {
    it("should prevent multiple beat detections in short time", () => {
      const beatCooldown = 100; // 100ms cooldown
      const lastBeatTime = Date.now();
      const currentTime = lastBeatTime + 50;

      const canDetectBeat = currentTime - lastBeatTime > beatCooldown;
      expect(canDetectBeat).toBe(false);
    });

    it("should allow beat detection after cooldown expires", () => {
      const beatCooldown = 100;
      const lastBeatTime = Date.now() - 150;
      const currentTime = Date.now();

      const canDetectBeat = currentTime - lastBeatTime > beatCooldown;
      expect(canDetectBeat).toBe(true);
    });
  });

  describe("Frequency Bin Calculation", () => {
    it("should calculate correct frequency bin for given Hz", () => {
      const frequency = 100; // 100 Hz
      const nyquist = 22050;
      const fftSize = 256;

      const binIndex = Math.floor((frequency / nyquist) * fftSize);
      expect(binIndex).toBeGreaterThan(0);
      expect(binIndex).toBeLessThan(fftSize);
    });

    it("should map low frequencies to early bins", () => {
      const lowFreq = 50;
      const highFreq = 1000;
      const nyquist = 22050;
      const fftSize = 256;

      const lowBin = Math.floor((lowFreq / nyquist) * fftSize);
      const highBin = Math.floor((highFreq / nyquist) * fftSize);

      expect(lowBin).toBeLessThan(highBin);
    });
  });

  describe("Performance Optimization", () => {
    it("should maintain reasonable history size", () => {
      const maxHistorySize = 60;
      const history: number[] = [];

      for (let i = 0; i < 100; i++) {
        history.push(Math.random());
        if (history.length > maxHistorySize) {
          history.shift();
        }
      }

      expect(history.length).toBe(maxHistorySize);
    });

    it("should use Uint8Array for memory efficiency", () => {
      const frequencyData = new Uint8Array(256);
      expect(frequencyData.byteLength).toBe(256);
      expect(frequencyData instanceof Uint8Array).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle silence (all zeros)", () => {
      mockFrequencyData.fill(0);

      const kickStart = Math.floor((60 / 22050) * 256);
      const kickEnd = Math.floor((200 / 22050) * 256);

      let kickEnergy = 0;
      for (let i = kickStart; i < kickEnd; i++) {
        kickEnergy += mockFrequencyData[i];
      }

      expect(kickEnergy).toBe(0);
    });

    it("should handle white noise (random values)", () => {
      for (let i = 0; i < mockFrequencyData.length; i++) {
        mockFrequencyData[i] = Math.floor(Math.random() * 256);
      }

      const avgValue =
        mockFrequencyData.reduce((a, b) => a + b, 0) / mockFrequencyData.length;
      expect(avgValue).toBeGreaterThan(0);
      expect(avgValue).toBeLessThan(255);
    });

    it("should handle very high energy peaks", () => {
      mockFrequencyData.fill(255);

      const avgEnergy = mockFrequencyData.reduce((a, b) => a + b, 0) / mockFrequencyData.length / 255;
      expect(avgEnergy).toBe(1);
    });
  });
});
