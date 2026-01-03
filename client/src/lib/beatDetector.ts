/**
 * BeatDetector - Real-time beat detection from audio frequency data
 * Analyzes frequency spectrum to detect kick drums, bass, and overall beat patterns
 */

export interface BeatData {
  kickDetected: boolean;
  bassDetected: boolean;
  beatStrength: number; // 0-1, overall beat intensity
  kickStrength: number; // 0-1, kick drum intensity
  bassStrength: number; // 0-1, bass intensity
  bpm: number; // Estimated BPM
  isBeat: boolean; // True if a beat was detected this frame
}

export class BeatDetector {
  private analyser: AnalyserNode;
  private frequencyData: Uint8Array | null = null;
  private beatHistory: number[] = [];
  private kickHistory: number[] = [];
  private bassHistory: number[] = [];
  private lastBeatTime: number = 0;
  private beatThreshold: number = 0.5;
  private kickThreshold: number = 0.6;
  private bassThreshold: number = 0.55;
  private historySize: number = 60; // 60 frames of history for smoothing
  private bpmEstimate: number = 120;
  private beatIntervals: number[] = [];

  constructor(analyser: AnalyserNode) {
    this.analyser = analyser;
    this.frequencyData = new Uint8Array(analyser.frequencyBinCount);
  }

  /**
   * Analyze current audio frame and detect beats
   */
  detect(): BeatData {
    if (!this.frequencyData) {
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    this.analyser.getByteFrequencyData(this.frequencyData as any);

    // Detect kick drums (low frequencies: 20-200 Hz)
    const kickStrength = this.detectKickDrum();

    // Detect bass (low-mid frequencies: 200-500 Hz)
    const bassStrength = this.detectBass();

    // Calculate overall beat strength
    const beatStrength = (kickStrength * 0.6 + bassStrength * 0.4);

    // Update history for smoothing
    this.beatHistory.push(beatStrength);
    this.kickHistory.push(kickStrength);
    this.bassHistory.push(bassStrength);

    if (this.beatHistory.length > this.historySize) {
      this.beatHistory.shift();
      this.kickHistory.shift();
      this.bassHistory.shift();
    }

    // Detect beat onset (sudden increase in energy)
    const isBeat = this.detectBeatOnset(beatStrength);

    // Update BPM estimate
    this.updateBPMEstimate(isBeat);

    return {
      kickDetected: kickStrength > this.kickThreshold,
      bassDetected: bassStrength > this.bassThreshold,
      beatStrength: this.smoothValue(this.beatHistory),
      kickStrength: this.smoothValue(this.kickHistory),
      bassStrength: this.smoothValue(this.bassHistory),
      bpm: this.bpmEstimate,
      isBeat,
    };
  }

  /**
   * Detect kick drum presence in low frequencies (20-200 Hz)
   * Kick drums typically have strong energy in the 60-100 Hz range
   */
  private detectKickDrum(): number {
    if (!this.frequencyData) return 0;
    const kickStart = Math.floor((60 / 22050) * this.frequencyData.length);
    const kickEnd = Math.floor((200 / 22050) * this.frequencyData.length);

    let kickEnergy = 0;
    for (let i = kickStart; i < kickEnd; i++) {
      kickEnergy += this.frequencyData[i];
    }

    // Normalize to 0-1 range
    const avgKickEnergy = kickEnergy / (kickEnd - kickStart) / 255;
    return Math.min(1, avgKickEnergy);
  }

  /**
   * Detect bass presence in low-mid frequencies (200-500 Hz)
   */
  private detectBass(): number {
    if (!this.frequencyData) return 0;
    const bassStart = Math.floor((200 / 22050) * this.frequencyData.length);
    const bassEnd = Math.floor((500 / 22050) * this.frequencyData.length);

    let bassEnergy = 0;
    for (let i = bassStart; i < bassEnd; i++) {
      bassEnergy += this.frequencyData[i];
    }

    // Normalize to 0-1 range
    const avgBassEnergy = bassEnergy / (bassEnd - bassStart) / 255;
    return Math.min(1, avgBassEnergy);
  }

  /**
   * Detect beat onset by comparing current energy to recent average
   * A beat is detected when there's a sudden spike in energy
   */
  private detectBeatOnset(currentBeatStrength: number): boolean {
    if (this.beatHistory.length < 10) return false;

    // Calculate average of previous frames (excluding current)
    const recentAverage = this.beatHistory
      .slice(-10, -1)
      .reduce((a, b) => a + b, 0) / 9;

    // Calculate standard deviation for adaptive thresholding
    const variance = this.beatHistory
      .slice(-10, -1)
      .reduce((sum, val) => sum + Math.pow(val - recentAverage, 2), 0) / 9;
    const stdDev = Math.sqrt(variance);

    // Beat detected if current strength significantly exceeds recent average
    const threshold = recentAverage + stdDev * 1.5;
    const beatDetected = currentBeatStrength > threshold;

    // Add cooldown to prevent multiple detections for same beat
    const now = Date.now();
    if (beatDetected && now - this.lastBeatTime > 100) {
      this.lastBeatTime = now;
      return true;
    }

    return false;
  }

  /**
   * Update BPM estimate based on detected beat intervals
   */
  private updateBPMEstimate(beatDetected: boolean): void {
    if (!beatDetected) return;

    const now = Date.now();
    if (this.beatIntervals.length > 0) {
      const lastBeatInterval = now - (this.lastBeatTime || now);
      this.beatIntervals.push(lastBeatInterval);

      // Keep only recent intervals
      if (this.beatIntervals.length > 8) {
        this.beatIntervals.shift();
      }

      // Calculate average interval and convert to BPM
      if (this.beatIntervals.length > 2) {
        const avgInterval = this.beatIntervals.reduce((a, b) => a + b, 0) / this.beatIntervals.length;
        const newBPM = Math.round(60000 / avgInterval);

        // Smooth BPM changes to avoid jitter
        this.bpmEstimate = Math.round(this.bpmEstimate * 0.7 + newBPM * 0.3);

        // Clamp BPM to reasonable range (60-200)
        this.bpmEstimate = Math.max(60, Math.min(200, this.bpmEstimate));
      }
    }
  }

  /**
   * Smooth values using exponential moving average
   */
  private smoothValue(history: number[]): number {
    if (history.length === 0) return 0;

    let smoothed = 0;
    const weight = 2 / (history.length + 1);

    for (let i = 0; i < history.length; i++) {
      const alpha = weight * Math.pow(1 - weight, history.length - i - 1);
      smoothed += history[i] * alpha;
    }

    return Math.min(1, smoothed);
  }

  /**
   * Get frequency bin index for a given frequency in Hz
   */
  private getFrequencyBinIndex(frequency: number): number {
    const nyquist = 22050; // Half of typical 44.1kHz sample rate
    return Math.floor((frequency / nyquist) * (this.frequencyData?.length || 256));
  }

  /**
   * Reset beat detector state
   */
  reset(): void {
    this.beatHistory = [];
    this.kickHistory = [];
    this.bassHistory = [];
    this.lastBeatTime = 0;
    this.beatIntervals = [];
    this.bpmEstimate = 120;
  }

  /**
   * Set custom thresholds for beat detection
   */
  setThresholds(beat: number, kick: number, bass: number): void {
    this.beatThreshold = Math.max(0, Math.min(1, beat));
    this.kickThreshold = Math.max(0, Math.min(1, kick));
    this.bassThreshold = Math.max(0, Math.min(1, bass));
  }

  /**
   * Get current BPM estimate
   */
  getBPM(): number {
    return this.bpmEstimate;
  }

  /**
   * Get beat history for visualization
   */
  getBeatHistory(): number[] {
    return [...this.beatHistory];
  }
}
