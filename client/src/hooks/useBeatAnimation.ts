/**
 * useBeatAnimation - React hook for beat-reactive animations
 * Provides easy integration of beat sync animations into any component
 */

import { useEffect, useRef, useCallback } from "react";
import {
  BeatSyncAnimationLibrary,
  AnimationPreset,
  AnimationConfig,
} from "@/lib/beatSyncAnimationLibrary";
import { BeatData } from "@/lib/beatDetector";

interface UseBeatAnimationOptions {
  elementId: string;
  preset: AnimationPreset;
  intensity?: number;
  duration?: number;
  triggerOnBeat?: boolean;
}

/**
 * Hook for applying beat-reactive animations to DOM elements
 */
export function useBeatAnimation(
  options: UseBeatAnimationOptions,
  beatData: BeatData | null
) {
  const animationLibraryRef = useRef<BeatSyncAnimationLibrary>(
    new BeatSyncAnimationLibrary()
  );
  const elementRef = useRef<HTMLElement | null>(null);
  const lastBeatTimeRef = useRef<number>(0);

  const {
    elementId,
    preset,
    intensity = 0.3,
    duration = 300,
    triggerOnBeat = true,
  } = options;

  // Get element reference
  useEffect(() => {
    elementRef.current = document.getElementById(elementId);
  }, [elementId]);

  // Apply animation to element
  useEffect(() => {
    if (!elementRef.current) return;

    const animationLibrary = animationLibraryRef.current;
    const state = animationLibrary.getAnimationState(elementId);

    if (state) {
      animationLibrary.applyAnimationToElement(elementId, elementRef.current);
    }

    const animationFrame = requestAnimationFrame(() => {
      animationLibrary.applyAnimationToElement(elementId, elementRef.current);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [elementId]);

  // Trigger animation on beat
  useEffect(() => {
    if (!triggerOnBeat || !beatData?.isBeat) return;

    const now = Date.now();
    // Prevent multiple triggers for same beat
    if (now - lastBeatTimeRef.current < 100) return;

    lastBeatTimeRef.current = now;
    animationLibraryRef.current.triggerBeatAnimation(elementId, preset);
  }, [beatData?.isBeat, elementId, preset, triggerOnBeat]);

  // Cleanup
  useEffect(() => {
    return () => {
      animationLibraryRef.current.stopAnimation(elementId);
    };
  }, [elementId]);

  const startAnimation = useCallback(() => {
    const config: AnimationConfig = {
      preset,
      intensity,
      duration,
    };
    animationLibraryRef.current.createAnimation(elementId, config);
  }, [elementId, preset, intensity, duration]);

  const stopAnimation = useCallback(() => {
    animationLibraryRef.current.stopAnimation(elementId);
  }, [elementId]);

  const triggerBeat = useCallback(() => {
    animationLibraryRef.current.triggerBeatAnimation(elementId, preset);
  }, [elementId, preset]);

  return {
    startAnimation,
    stopAnimation,
    triggerBeat,
    getState: () => animationLibraryRef.current.getAnimationState(elementId),
  };
}

/**
 * Hook for managing multiple synchronized beat animations
 */
export function useSynchronizedBeatAnimations(
  elementIds: string[],
  preset: AnimationPreset,
  beatData: BeatData | null,
  options?: {
    intensity?: number;
    duration?: number;
    staggerDelay?: number;
  }
) {
  const animationLibraryRef = useRef<BeatSyncAnimationLibrary>(
    new BeatSyncAnimationLibrary()
  );
  const lastBeatTimeRef = useRef<number>(0);

  const {
    intensity = 0.3,
    duration = 300,
    staggerDelay = 50,
  } = options || {};

  // Trigger synchronized animations on beat
  useEffect(() => {
    if (!beatData?.isBeat) return;

    const now = Date.now();
    if (now - lastBeatTimeRef.current < 100) return;

    lastBeatTimeRef.current = now;
    animationLibraryRef.current.createSynchronizedAnimations(
      elementIds,
      preset,
      intensity,
      duration,
      staggerDelay
    );
  }, [beatData?.isBeat, elementIds, preset, intensity, duration, staggerDelay]);

  const startAll = useCallback(() => {
    animationLibraryRef.current.createSynchronizedAnimations(
      elementIds,
      preset,
      intensity,
      duration,
      staggerDelay
    );
  }, [elementIds, preset, intensity, duration, staggerDelay]);

  const stopAll = useCallback(() => {
    animationLibraryRef.current.stopAllAnimations();
  }, []);

  const getStats = useCallback(() => {
    return animationLibraryRef.current.getAnimationStats();
  }, []);

  return { startAll, stopAll, getStats };
}

/**
 * Hook for frequency-based beat animations
 * Triggers different animations based on detected frequency bands
 */
export function useFrequencyBeatAnimation(
  elementId: string,
  beatData: BeatData | null
) {
  const animationLibraryRef = useRef<BeatSyncAnimationLibrary>(
    new BeatSyncAnimationLibrary()
  );
  const lastBeatTimeRef = useRef<number>(0);

  // Trigger different animations based on frequency
  useEffect(() => {
    if (!beatData?.isBeat) return;

    const now = Date.now();
    if (now - lastBeatTimeRef.current < 100) return;

    lastBeatTimeRef.current = now;

    // Choose animation based on dominant frequency
    let preset: AnimationPreset = "pulse";

    if (beatData.kickStrength > 0.6) {
      // Strong kick - use bounce animation
      preset = "bounce";
    } else if (beatData.bassStrength > 0.6) {
      // Strong bass - use scale animation
      preset = "scale";
    } else if (beatData.beatStrength > 0.5) {
      // General beat - use pulse
      preset = "pulse";
    }

    animationLibraryRef.current.triggerBeatAnimation(elementId, preset);
  }, [beatData?.isBeat, beatData?.kickStrength, beatData?.bassStrength, beatData?.beatStrength, elementId]);

  return {
    getState: () => animationLibraryRef.current.getAnimationState(elementId),
  };
}
