import type React from "react"

const ShootingStars: React.FC = () => {
  return (
    <div className="shooting-stars">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="shooting-star"
          style={
            {
              "--delay": `${Math.random() * 5}s`,
              "--top": `${Math.random() * 100}%`,
              "--left": `${Math.random() * 100}%`,
            } as React.CSSProperties
          }
        ></div>
      ))}
    </div>
  )
}

export default ShootingStars

