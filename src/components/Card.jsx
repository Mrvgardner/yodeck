import { motion } from 'framer-motion'

// The rain choreography — switched from spring physics to fixed-duration
// tweens for performance. Springs require per-frame physics math in JS;
// tweens precompute and hand off entirely to the GPU compositor.
const dropIn = {
  initial: { y: '-110vh', opacity: 0, rotate: -3 },
  animate: {
    y: 0, opacity: 1, rotate: 0,
    transition: {
      // ease-out-back-ish — quick drop, soft settle, no bounce iteration
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 0.35 },
    },
  },
  exit: {
    y: '130vh',
    opacity: 0,
    rotate: 5,
    transition: {
      duration: 1.2,
      ease: [0.6, 0.04, 0.98, 0.16],
    },
  },
}

export default function Card({ children, className = '', surface = 'glass', padding = 'p-14' }) {
  const surfaceClass = {
    glass:  'card-surface text-sc-cream',
    amber:  'card-surface-amber text-white',
    cream:  'card-surface-cream text-sc-navy',
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
