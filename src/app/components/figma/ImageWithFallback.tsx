import React, { useState } from "react";

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-muted text-muted-foreground text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <svg
          viewBox="0 0 88 88"
          width="88"
          height="88"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          opacity="0.3"
          strokeWidth="3.7"
        >
          <rect x="16" y="16" width="56" height="56" rx="6" />
          <path d="m16 58 16-18 32 32" />
          <circle cx="53" cy="35" r="7" />
        </svg>
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
