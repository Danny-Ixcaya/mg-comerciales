import { motion, } from 'framer-motion';
import React, { forwardRef } from 'react';
import { useMediaQuery } from '@react-hook/media-query';

// Forward ref -> sirve para pasar referencias a el componente padre
export const SearchBarContainer = forwardRef(({ isExpanded, containerVariants, containerTransition, children }, ref) => {
  const isLargeScreen = useMediaQuery('(max-width: 1024px');
  return (
    <motion.div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        width: isLargeScreen ? "24em" : "28em",
        height: "3.6em",
        backgroundColor: "#fff",
        borderRadius: "6px",
        boxShadow: "0px 2px 12px 3px rgba(0, 0, 0, 0.14)"
      }}
    >
      {/* Contenido del motion */}
      {children}
    </motion.div>
  );
});
