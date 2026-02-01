/**
 * BeatSyncAnimationLibrary - Reusable beat-reactive animation presets
 * Provides animation utilities for creating cohesive beat-reactive UI across the site
 */

export type AnimationPreset = "pulse" | "scale" | "glow" | "rotation" | "bounce" | "shimmer";

export interface AnimationConfig {
  preset: AnimationPreset;
  intensity: number; // 0-1, controls animation strength
  duration: number; // milliseconds
  delay?: number; // milliseconds
  easing?: string; // CSS easing function
}

export interface AnimationState {
  isActive: boolean;
  progress: number; // 0-1
  value: number; // Current animated value
  timestamp: number;
}

export class BeatSyncAnimationLibrary {
  private animationStates: Map<string, AnimationState> = new Map();
  private animationFrameIds: Map<string, number> = new Map();

  /**
   * Pulse animation - oscillates between normal and scaled state
   */
  createPulseAnimation(
    elementId: string,
    intensity: number = 0.3,
    duration: number = 200
  ): void {
    const startTime = Date.now();
    const startScale = 1;
    const maxScale = 1 + intensity;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      // Ease-in-out sine for smooth pulse
      const easeProgress = Math.sin(progress * Math.PI);
      const currentScale = startScale + (maxScale - startScale) * easeProgress;

      this.updateAnimationState(elementId, {
        isActive: true,
        progress,
        value: currentScale,
        timestamp: Date.now(),
      });

      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.set(elementId, frameId);
    };

    animate();
  }

  /**
   * Scale animation - smoothly scales element up and down
   */
  createScaleAnimation(
    elementId: string,
    intensity: number = 0.2,
    duration: number = 300
  ): void {
    const startTime = Date.now();
    const minScale = 1 - intensity;
    const maxScale = 1 + intensity;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      // Ease-in-out cubic for smooth scaling
      const easeProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const currentScale = minScale + (maxScale - minScale) * easeProgress;

      this.updateAnimationState(elementId, {
        isActive: true,
        progress,
        value: currentScale,
        timestamp: Date.now(),
      });

      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.set(elementId, frameId);
    };

    animate();
  }

  /**
   * Glow animation - modulates opacity/shadow intensity
   */
  createGlowAnimation(
    elementId: string,
    intensity: number = 0.8,
    duration: number = 400
  ): void {
    const startTime = Date.now();
    const minGlow = 0.3;
    const maxGlow = minGlow + intensity;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      // Sine wave for smooth glow pulsing
      const easeProgress = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
      const currentGlow = minGlow + (maxGlow - minGlow) * easeProgress;

      this.updateAnimationState(elementId, {
        isActive: true,
        progress,
        value: currentGlow,
        timestamp: Date.now(),
      });

      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.set(elementId, frameId);
    };

    animate();
  }

  /**
   * Rotation animation - spins element
   */
  createRotationAnimation(
    elementId: string,
    intensity: number = 1,
    duration: number = 1000
  ): void {
    const startTime = Date.now();
    const maxRotation = 360 * intensity;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      // Linear rotation
      const currentRotation = maxRotation * progress;

      this.updateAnimationState(elementId, {
        isActive: true,
        progress,
        value: currentRotation,
        timestamp: Date.now(),
      });

      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.set(elementId, frameId);
    };

    animate();
  }

  /**
   * Bounce animation - bouncy easing with multiple bounces
   */
  createBounceAnimation(
    elementId: string,
    intensity: number = 0.5,
    duration: number = 500
  ): void {
    const startTime = Date.now();
    const maxTranslate = 20 * intensity;

    const easeOutBounce = (t: number): number => {
      const n1 = 7.5625;
      const d1 = 2.75;

      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, (elapsed % duration) / duration);

      const easeProgress = easeOutBounce(progress);
      const currentTranslate = maxTranslate * easeProgress;

      this.updateAnimationState(elementId, {
        isActive: true,
        progress,
        value: currentTranslate,
        timestamp: Date.now(),
      });

      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.set(elementId, frameId);
    };

    animate();
  }

  /**
   * Shimmer animation - creates a shimmering effect
   */
  createShimmerAnimation(
    elementId: string,
    intensity: number = 0.5,
    duration: number = 600
  ): void {
    const startTime = Date.now();
    const minOpacity = 0.5;
    const maxOpacity = minOpacity + intensity;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      // Multiple sine waves for shimmer effect
      const shimmer1 = Math.sin(progress * Math.PI * 2) * 0.3;
      const shimmer2 = Math.sin(progress * Math.PI * 4) * 0.2;
      const easeProgress = 0.5 + shimmer1 + shimmer2;

      const currentOpacity = minOpacity + (maxOpacity - minOpacity) * Math.max(0, Math.min(1, easeProgress));

      this.updateAnimationState(elementId, {
        isActive: true,
        progress,
        value: currentOpacity,
        timestamp: Date.now(),
      });

      const frameId = requestAnimationFrame(animate);
      this.animationFrameIds.set(elementId, frameId);
    };

    animate();
  }

  /**
   * Create animation from config
   */
  createAnimation(elementId: string, config: AnimationConfig): void {
    const { preset, intensity, duration } = config;

    switch (preset) {
      case "pulse":
        this.createPulseAnimation(elementId, intensity, duration);
        break;
      case "scale":
        this.createScaleAnimation(elementId, intensity, duration);
        break;
      case "glow":
        this.createGlowAnimation(elementId, intensity, duration);
        break;
      case "rotation":
        this.createRotationAnimation(elementId, intensity, duration);
        break;
      case "bounce":
        this.createBounceAnimation(elementId, intensity, duration);
        break;
      case "shimmer":
        this.createShimmerAnimation(elementId, intensity, duration);
        break;
    }
  }

  /**
   * Stop animation for element
   */
  stopAnimation(elementId: string): void {
    const frameId = this.animationFrameIds.get(elementId);
    if (frameId !== undefined) {
      cancelAnimationFrame(frameId);
      this.animationFrameIds.delete(elementId);
    }

    const state = this.animationStates.get(elementId);
    if (state) {
      state.isActive = false;
    }
  }

  /**
   * Stop all animations
   */
  stopAllAnimations(): void {
    const ids = Array.from(this.animationFrameIds.keys());
    for (const elementId of ids) {
      this.stopAnimation(elementId);
    }
  }

  /**
   * Get animation state
   */
  getAnimationState(elementId: string): AnimationState | undefined {
    return this.animationStates.get(elementId);
  }

  /**
   * Update animation state
   */
  private updateAnimationState(elementId: string, state: AnimationState): void {
    this.animationStates.set(elementId, state);
  }

  /**
   * Apply animation to DOM element
   */
  applyAnimationToElement(elementId: string, element: HTMLElement | null): void {
    if (!element) return;

    const state = this.getAnimationState(elementId);
    if (!state) return;

    // Apply transform based on animation value
    const transforms: string[] = [];

    // Check animation type and apply appropriate transform
    if (state.value > 1 || state.value < 1) {
      // Likely a scale animation
      if (state.value > 0.5 && state.value < 2) {
        transforms.push(`scale(${state.value})`);
      }
    }

    // Apply rotation if value is in rotation range
    if (state.value > 180) {
      transforms.push(`rotate(${state.value}deg)`);
    }

    if (transforms.length > 0) {
      element.style.transform = transforms.join(" ");
    }

    // Apply opacity for glow/shimmer
    if (state.value > 0 && state.value < 1) {
      element.style.opacity = state.value.toString();
    }
  }

  /**
   * Create beat-triggered animation burst
   */
  triggerBeatAnimation(elementId: string, preset: AnimationPreset = "pulse"): void {
    this.stopAnimation(elementId);

    const config: AnimationConfig = {
      preset,
      intensity: 0.4,
      duration: 200,
    };

    this.createAnimation(elementId, config);

    // Auto-stop after one cycle
    setTimeout(() => {
      this.stopAnimation(elementId);
    }, config.duration);
  }

  /**
   * Create synchronized animations for multiple elements
   */
  createSynchronizedAnimations(
    elementIds: string[],
    preset: AnimationPreset,
    intensity: number = 0.3,
    duration: number = 300,
    staggerDelay: number = 50
  ): void {
    elementIds.forEach((id, index) => {
      setTimeout(() => {
        this.createAnimation(id, {
          preset,
          intensity,
          duration,
          delay: index * staggerDelay,
        });
      }, index * staggerDelay);
    });
  }

  /**
   * Get all active animations
   */
  getActiveAnimations(): string[] {
    const entries = Array.from(this.animationStates.entries());
    return entries
      .filter(([, state]) => state.isActive)
      .map(([id]) => id);
  }

  /**
   * Get animation statistics
   */
  getAnimationStats(): {
    totalAnimations: number;
    activeAnimations: number;
    animationIds: string[];
  } {
    const activeAnimations = this.getActiveAnimations();
    return {
      totalAnimations: this.animationStates.size,
      activeAnimations: activeAnimations.length,
      animationIds: activeAnimations,
    };
  }
}

// Singleton instance for app-wide use
export const beatSyncAnimationLibrary = new BeatSyncAnimationLibrary();
