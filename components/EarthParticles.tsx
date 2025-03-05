import type React from "react"

const EarthParticles: React.FC = () => {
  return (
    <div className="earth-particles-container">
      <svg width="100%" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="black" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        {[...Array(30)].map((_, i) => (
          <circle
            key={i}
            className="particle"
            cx={Math.random() * 300}
            cy={Math.random() * 200}
            r={Math.random() * 3 + 1}
            fill="url(#particleGradient)"
          >
            <animate
              attributeName="cx"
              from={Math.random() * 300}
              to={Math.random() * 300}
              dur={`${Math.random() * 20 + 10}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              from={Math.random() * 200}
              to={Math.random() * 200}
              dur={`${Math.random() * 20 + 10}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

export default EarthParticles

