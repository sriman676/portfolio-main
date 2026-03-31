import { useEffect } from "react";
import { useStore } from "./store";

export const DeviceController = () => {
  const setPerfTier = useStore((state) => state.setPerfTier);

  useEffect(() => {
    const evaluate = () => {
      const cores = navigator.hardwareConcurrency || 4;
      const memory = navigator.deviceMemory || 4;
      const webGL = !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('webgl2');
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      let tier = 'mid';

      if (cores >= 8 && memory >= 8 && webGL && !isMobile) {
        tier = 'high';
      } else if (cores < 4 || isMobile) {
        tier = 'low';
      }

      setPerfTier(tier);
    };

    evaluate();
  }, [setPerfTier]);
  
  return null;
};
