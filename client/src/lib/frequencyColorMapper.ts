/**
 * FrequencyColorMapper - Maps audio frequency bands to distinct colors
 * Provides frequency-specific color mapping for audio visualization
 */

export interface FrequencyBand {
  name: string;
  minHz: number;
  maxHz: number;
  color: string;
  hue: number;
}

export interface ColorStop {
  position: number;
  color: string;
  band: string;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface FrequencyData {
  color: string;
  magnitude: number;
  band: string;
}

export class FrequencyColorMapper {
  private frequencyBands: FrequencyBand[] = [
    { name: "Sub-Bass", minHz: 20, maxHz: 60, color: "#ff0000", hue: 0 },
    { name: "Bass", minHz: 60, maxHz: 250, color: "#ff7700", hue: 30 },
    { name: "Low-Mids", minHz: 250, maxHz: 500, color: "#ffdd00", hue: 60 },
    { name: "Mids", minHz: 500, maxHz: 2000, color: "#ffff00", hue: 60 },
    { name: "High-Mids", minHz: 2000, maxHz: 4000, color: "#00ff00", hue: 120 },
    { name: "Presence", minHz: 4000, maxHz: 8000, color: "#00ffff", hue: 180 },
    { name: "Brilliance", minHz: 8000, maxHz: 16000, color: "#0099ff", hue: 210 },
    { name: "Ultra-High", minHz: 16000, maxHz: 22050, color: "#00ff99", hue: 150 },
  ];

  /**
   * Get frequency band for a given frequency in Hz
   */
  getFrequencyBand(frequencyHz: number): FrequencyBand {
    for (const band of this.frequencyBands) {
      if (frequencyHz >= band.minHz && frequencyHz < band.maxHz) {
        return band;
      }
    }
    return this.frequencyBands[this.frequencyBands.length - 1];
  }

  /**
   * Get all frequency bands
   */
  getFrequencyBands(): FrequencyBand[] {
    return [...this.frequencyBands];
  }

  /**
   * Map FFT bin to hex color
   */
  mapBinToColor(bin: number, fftSize: number): string {
    const nyquist = 22050;
    const frequencyHz = (bin / fftSize) * nyquist;
    return this.getHSLColor(frequencyHz);
  }

  /**
   * Get HSL color for frequency
   */
  getHSLColor(
    frequencyHz: number,
    saturation: number = 100,
    lightness: number = 50
  ): string {
    const band = this.getFrequencyBand(frequencyHz);
    const hue = band.hue;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Get RGB color for frequency
   */
  getRGBColor(frequencyHz: number): RGBColor {
    const band = this.getFrequencyBand(frequencyHz);
    const hex = band.color;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return { r, g, b };
  }

  /**
   * Get color stops for gradient
   */
  getColorStops(): ColorStop[] {
    return this.frequencyBands.map((band, index) => ({
      position: index / this.frequencyBands.length,
      color: band.color,
      band: band.name,
    }));
  }

  /**
   * Interpolate color between frequency bands
   */
  interpolateColor(
    frequencyHz: number,
    saturation: number = 100,
    lightness: number = 50
  ): string {
    const band = this.getFrequencyBand(frequencyHz);
    return `hsl(${band.hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Get color with magnitude-based brightness
   */
  getColorWithMagnitude(
    frequencyHz: number,
    magnitude: number,
    maxMagnitude: number = 255,
    saturation: number = 100
  ): string {
    const band = this.getFrequencyBand(frequencyHz);
    const normalizedMagnitude = Math.min(1, magnitude / maxMagnitude);

    // Map magnitude to lightness (30-80%)
    const baseLightness = 30;
    const maxLightness = 80;
    const lightness = baseLightness + normalizedMagnitude * (maxLightness - baseLightness);

    return `hsl(${band.hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Map frequency data array to colors
   */
  mapFrequencyDataToColors(
    frequencyData: Uint8Array,
    fftSize: number
  ): FrequencyData[] {
    const nyquist = 22050;
    const result: FrequencyData[] = [];

    for (let i = 0; i < frequencyData.length; i++) {
      const frequencyHz = (i / frequencyData.length) * nyquist;
      const magnitude = frequencyData[i];
      const band = this.getFrequencyBand(frequencyHz);

      const color = this.getColorWithMagnitude(frequencyHz, magnitude, 255, 100);

      result.push({
        color,
        magnitude,
        band: band.name,
      });
    }

    return result;
  }

  /**
   * Get dominant frequency band from data
   */
  getDominantBand(frequencyData: Uint8Array, fftSize: number): FrequencyBand {
    let maxMagnitude = 0;
    let maxIndex = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxMagnitude) {
        maxMagnitude = frequencyData[i];
        maxIndex = i;
      }
    }

    const nyquist = 22050;
    const frequencyHz = (maxIndex / frequencyData.length) * nyquist;
    return this.getFrequencyBand(frequencyHz);
  }

  /**
   * Get energy for specific frequency band
   */
  getBandEnergy(
    frequencyData: Uint8Array,
    bandName: string,
    fftSize: number
  ): number {
    const band = this.frequencyBands.find((b) => b.name === bandName);
    if (!band) return 0;

    const nyquist = 22050;
    const minBin = Math.floor((band.minHz / nyquist) * frequencyData.length);
    const maxBin = Math.floor((band.maxHz / nyquist) * frequencyData.length);

    let energy = 0;
    for (let i = minBin; i < maxBin && i < frequencyData.length; i++) {
      energy += frequencyData[i];
    }

    return energy / (maxBin - minBin);
  }

  /**
   * Get energy for all frequency bands
   */
  getAllBandEnergies(frequencyData: Uint8Array, fftSize: number): Record<string, number> {
    const energies: Record<string, number> = {};

    for (const band of this.frequencyBands) {
      energies[band.name] = this.getBandEnergy(frequencyData, band.name, fftSize);
    }

    return energies;
  }

  /**
   * Get color gradient string for CSS
   */
  getGradientString(): string {
    const stops = this.getColorStops();
    return stops.map((stop) => `${stop.color} ${stop.position * 100}%`).join(", ");
  }

  /**
   * Analyze frequency distribution
   */
  analyzeFrequencyDistribution(
    frequencyData: Uint8Array,
    fftSize: number
  ): Record<string, number> {
    const energies = this.getAllBandEnergies(frequencyData, fftSize);
    const total = Object.values(energies).reduce((a, b) => a + b, 0);

    const distribution: Record<string, number> = {};
    for (const [band, energy] of Object.entries(energies)) {
      distribution[band] = total > 0 ? (energy / total) * 100 : 0;
    }

    return distribution;
  }
}
