import { useEffect } from 'react';
import { type DimensionValue, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Motion, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SkeletonProps = { width: DimensionValue; height?: DimensionValue; aspectRatio?: number; radius?: number; style?: ViewStyle };

/** Pulsing placeholder shown while real content loads. */
export function Skeleton({ width, height, aspectRatio, radius = Radius.md, style }: SkeletonProps) {
  const theme = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.45, { duration: Motion.pulse }), -1, true));
  }, [opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width, height, aspectRatio, borderRadius: radius, backgroundColor: theme.backgroundElement }, pulse, style]}
    />
  );
}
