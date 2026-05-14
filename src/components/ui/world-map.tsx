// src/components/ui/world-map.tsx
export const WorldMap = () => {
  return (
    <div 
      className="w-full h-full bg-center bg-no-repeat bg-cover opacity-30"
      style={{ 
        backgroundImage: "url('/sfondo_mondo.png')", 
        backgroundBlendMode: "overlay"
      }} 
    />
  );
};