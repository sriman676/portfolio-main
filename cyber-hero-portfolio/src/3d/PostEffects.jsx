import React from "react";
import { EffectComposer, Bloom, Glitch, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { useStore } from "../systems/store";
import { GlitchMode } from "postprocessing";

const PostEffects = () => {
  const showGlitch = useStore((state) => state.showGlitch);
  const activeIntrusions = useStore((state) => state.activeIntrusions);
  const perfTier = useStore((state) => state.perfTier);

  // Performance Optimization: Disable complex effects on low-tier devices
  if (perfTier === "Tier3") return null;

  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        intensity={1.2} 
        luminanceThreshold={0.9} 
        mipmapBlur 
      />
      
      {showGlitch && (
        <Glitch
          delay={[0, 0.2]}
          duration={[0.1, 0.4]}
          strength={[0.1, 0.3]}
          mode={4} // CONSTANT_WILD mode enum value
          active
          ratio={0.1}
        />
      )}

      {activeIntrusions > 0 && (
         <ChromaticAberration 
            offset={[0.002, 0.002]} 
         />
      )}

      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};

export default PostEffects;
