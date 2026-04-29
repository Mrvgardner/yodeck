import { motion } from 'framer-motion'

// The rain choreography — translate + opacity only.
// Rotation and scale force non-axis-aligned compositing every frame; on the
// Yodeck player that compounds with the iframe and ticker animation. Pure
// translateY + opacity stays on the GPU's fast path.
const dropIn = {
  initial: { y: '-100vh', opacity: 0 },
  animate: {
    y: 0, opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],   // ease-out-quint — quick drop, soft settle
      opacity: { duration: 0.3 },
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.7, 0],    // ease-in — accelerate as it falls
    },
  },
}

export default function Card({ children, className = '', surface = 'glass', padding = 'p-14' }) {
  const surfaceClass = {
    glass:  'card-surface text-sc-cream',
    amber:  'card-surface-amber text-white',
    cream:  'card-surface-cream text-sc-navy',
    storm:  'card-surface-storm text-sc-cream',
  }[surface] || 'card-surface text-sc-cream'

  return (
    <motion.div
      variants={dropIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`absolute inset-0 rounded-[28px] overflow-hidden ${surfaceClass} ${padding} ${className}`}
    >
      {children}
    </motion.div>
  )
}
