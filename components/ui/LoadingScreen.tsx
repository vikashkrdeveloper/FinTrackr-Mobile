import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, ImageBackground, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const LoadingScreen = () => {
  const { isDark, theme } = useAppTheme();
  
  // Animation values
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: Fade in + Scale up
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Endless pulse animation after appearance
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [opacity, scale]);

  return (
    <ImageBackground 
      source={require('../../assets/images/splash_bg.png')} 
      style={styles.container}
    >
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.2)' }]}>
        <Animated.View style={{ 
          transform: [{ scale }], 
          opacity,
          alignItems: 'center',
          justifyContent: 'center' 
        }}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
  }
});
