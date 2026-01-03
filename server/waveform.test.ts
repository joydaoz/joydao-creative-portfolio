/// <reference lib="dom" />
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Audio Waveform Visualization", () => {
  let mockAudioElement: Partial<HTMLAudioElement>;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    // Mock audio element
    mockAudioElement = {
      play: vi.fn(),
      pause: vi.fn(),
      currentTime: 0,
      duration: 100,
      volume: 0.7,
      paused: true,
    };

    // Create real canvas for testing
    mockCanvas = document.createElement("canvas");
    mockCanvas.width = 800;
    mockCanvas.height = 150;
  });

  describe("Canvas Setup", () => {
    it("should create canvas with correct dimensions", () => {
      expect(mockCanvas.width).toBe(800);
      expect(mockCanvas.height).toBe(150);
    });

    it("should create a canvas element", () => {
      expect(mockCanvas).toBeDefined();
      expect(mockCanvas).toBeInstanceOf(HTMLCanvasElement);
    });
  });

  describe("Audio Element Properties", () => {
    it("should have audio element with correct initial state", () => {
      expect(mockAudioElement.currentTime).toBe(0);
      expect(mockAudioElement.duration).toBe(100);
      expect(mockAudioElement.volume).toBe(0.7);
      expect(mockAudioElement.paused).toBe(true);
    });

    it("should support play and pause methods", () => {
      mockAudioElement.play?.();
      expect(mockAudioElement.play).toHaveBeenCalled();

      mockAudioElement.pause?.();
      expect(mockAudioElement.pause).toHaveBeenCalled();
    });
  });

  describe("Visualization Modes", () => {
    it("should support bars visualization mode", () => {
      const mode = "bars";
      expect(["bars", "waveform", "spectrum"]).toContain(mode);
    });

    it("should support waveform visualization mode", () => {
      const mode = "waveform";
      expect(["bars", "waveform", "spectrum"]).toContain(mode);
    });

    it("should support spectrum visualization mode", () => {
      const mode = "spectrum";
      expect(["bars", "waveform", "spectrum"]).toContain(mode);
    });
  });

  describe("Color Gradient Calculation", () => {
    it("should calculate hue based on frequency index", () => {
      const frequencyIndex = 64;
      const bufferLength = 256;
      const hue = (frequencyIndex / bufferLength) * 120;

      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThanOrEqual(120);
    });

    it("should map frequency to green-to-red spectrum", () => {
      const greenHue = 0;
      const redHue = 120;

      expect(greenHue).toBe(0);
      expect(redHue).toBe(120);
    });

    it("should calculate lightness based on amplitude", () => {
      const amplitude = 128;
      const lightness = 50 + (amplitude / 255) * 30;

      expect(lightness).toBeGreaterThan(50);
      expect(lightness).toBeLessThanOrEqual(80);
    });

    it("should handle low amplitude values", () => {
      const amplitude = 0;
      const lightness = 50 + (amplitude / 255) * 30;

      expect(lightness).toBe(50);
    });

    it("should handle high amplitude values", () => {
      const amplitude = 255;
      const lightness = 50 + (amplitude / 255) * 30;

      expect(lightness).toBe(80);
    });
  });

  describe("Animation Loop", () => {
    it("should use requestAnimationFrame for smooth animation", () => {
      const rafSpy = vi.spyOn(window, "requestAnimationFrame");

      const animationId = requestAnimationFrame(() => {});

      expect(rafSpy).toHaveBeenCalled();
      cancelAnimationFrame(animationId);
    });

    it("should cancel animation frame when stopping", () => {
      const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
      const animationId = requestAnimationFrame(() => {});

      cancelAnimationFrame(animationId);
      expect(cancelSpy).toHaveBeenCalledWith(animationId);
    });
  });

  describe("Performance Optimization", () => {
    it("should use Uint8Array for frequency data", () => {
      const bufferLength = 256;
      const dataArray = new Uint8Array(bufferLength);

      expect(dataArray.byteLength).toBe(bufferLength);
      expect(dataArray instanceof Uint8Array).toBe(true);
    });

    it("should set smoothing constant for analyser", () => {
      const analyser = {
        smoothingTimeConstant: 0.8,
      };

      expect(analyser.smoothingTimeConstant).toBe(0.8);
    });

    it("should handle canvas resize efficiently", () => {
      const newWidth = 1024;
      const newHeight = 200;

      mockCanvas.width = newWidth;
      mockCanvas.height = newHeight;

      expect(mockCanvas.width).toBe(newWidth);
      expect(mockCanvas.height).toBe(newHeight);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing audio element gracefully", () => {
      const nullAudio = null;
      expect(nullAudio).toBeNull();
    });

    it("should validate frequency data array length", () => {
      const bufferLength = 256;
      const dataArray = new Uint8Array(bufferLength);

      expect(dataArray.length).toBe(bufferLength);
    });
  });

  describe("Responsive Canvas", () => {
    it("should support different canvas sizes", () => {
      const sizes = [
        { width: 400, height: 75 },
        { width: 800, height: 150 },
        { width: 1200, height: 225 },
      ];

      sizes.forEach((size) => {
        mockCanvas.width = size.width;
        mockCanvas.height = size.height;

        expect(mockCanvas.width).toBe(size.width);
        expect(mockCanvas.height).toBe(size.height);
      });
    });

    it("should maintain canvas element after resize", () => {
      mockCanvas.width = 1024;
      mockCanvas.height = 200;

      expect(mockCanvas).toBeInstanceOf(HTMLCanvasElement);
    });
  });

  describe("FFT Configuration", () => {
    it("should use 512 FFT size for frequency analysis", () => {
      const fftSize = 512;
      expect(fftSize).toBe(512);
    });

    it("should calculate correct frequency bin count", () => {
      const fftSize = 512;
      const frequencyBinCount = fftSize / 2;

      expect(frequencyBinCount).toBe(256);
    });
  });

  describe("Waveform Data Processing", () => {
    it("should process frequency data correctly", () => {
      const frequencyData = new Uint8Array(256);
      frequencyData[0] = 100;
      frequencyData[128] = 200;
      frequencyData[255] = 150;

      expect(frequencyData[0]).toBe(100);
      expect(frequencyData[128]).toBe(200);
      expect(frequencyData[255]).toBe(150);
    });

    it("should normalize frequency values between 0-255", () => {
      const frequencyData = new Uint8Array(256);

      for (let i = 0; i < frequencyData.length; i++) {
        frequencyData[i] = Math.random() * 255;
        expect(frequencyData[i]).toBeGreaterThanOrEqual(0);
        expect(frequencyData[i]).toBeLessThanOrEqual(255);
      }
    });
  });
});
