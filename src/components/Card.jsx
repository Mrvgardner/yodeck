import { motion } from 'framer-motion'

// The rain choreography:
//  - enter: drop in from above the viewport with a damped spring + slight tilt
//  - exit:  fall through the bottom, accelerating with rotation, fading
const dropIn = {
  initial:  { y: '-120vh', opacity: 0, rotate: -4, scale: 0.96 },
  animate:  {
    y: 0, opacity: 1, rotate: 0, scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 14,
      mass: 1.2,
      opacity: { duration: 0.4 },
    },
  },
  exit: {
    y: '140vh',
    opacity: 0,
    rotate: 6,
    scale: 0.94,
    transition: {
      duration: 1.4,
      ease: [0.6, 0.04, 0.98, 0.16], // sharp accelerating fall
    },
  },
}

export default function Card({ children, className = '', surface = 'glass', padding = 'p-10' }) {
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
