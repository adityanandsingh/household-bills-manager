"use client"

import type React from "react"

import { memo, useRef, useEffect, useState } from "react"

interface VirtualizedListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}

function VirtualizedListComponent<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = "",
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(Math.ceil(height / itemHeight) + 1)

  const totalHeight = items.length * itemHeight
  const visibleItemCount = Math.ceil(height / itemHeight)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const newStartIndex = Math.floor(scrollTop / itemHeight)
        const newEndIndex = newStartIndex + visibleItemCount + 1

        setStartIndex(newStartIndex)
        setEndIndex(Math.min(newEndIndex, items.length))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [itemHeight, visibleItemCount, items.length])

  const visibleItems = items.slice(startIndex, endIndex)

  return (
    <div ref={containerRef} className={`overflow-auto ${className}`} style={{ height }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: startIndex * itemHeight,
            width: "100%",
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const VirtualizedList = memo(VirtualizedListComponent) as typeof VirtualizedListComponent

