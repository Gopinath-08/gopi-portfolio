const PatternBackground = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] dark:opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />
  );
};

export default PatternBackground;

