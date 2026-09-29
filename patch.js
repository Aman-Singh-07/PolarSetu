const fs = require('fs');
const file = 'frontend/src/components/social-card/CardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the window resize event with ResizeObserver
const oldUseEffect = `
  // Dynamically compute scale factor based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newScale = containerWidth / config.width;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [config.width]);
`;

const newUseEffect = `
  // Dynamically compute scale factor using ResizeObserver to handle CSS transitions
  useEffect(() => {
    const updateScale = (width: number) => {
      const newScale = width / config.width;
      setScale(newScale);
    };

    if (!containerRef.current) return;

    // Initial scale
    updateScale(containerRef.current.clientWidth);

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Use borderBoxSize if available for better accuracy, else fallback to contentRect
        const width = entry.contentRect.width;
        if (width > 0) {
          updateScale(width);
        }
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [config.width]);
`;

content = content.replace(oldUseEffect.trim(), newUseEffect.trim());

fs.writeFileSync(file, content);
