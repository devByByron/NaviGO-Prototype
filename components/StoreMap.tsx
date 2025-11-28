import React, { useMemo } from 'react';
import { AISLES, PRODUCTS } from '../services/mockData';
import { ShoppingItem, Aisle } from '../types';

interface StoreMapProps {
  items: ShoppingItem[];
  activeItem?: ShoppingItem | null;
  onAisleClick?: (aisle: Aisle) => void;
  showRoute?: boolean;
}

const SCALE_X = 3.5; // Multiplier to fit screen width roughly
const SCALE_Y = 3.5;
const OFFSET_X = 20;
const OFFSET_Y = 20;

export const StoreMap: React.FC<StoreMapProps> = ({ items, activeItem, onAisleClick, showRoute = true }) => {
  
  // Calculate optimal path
  const routePoints = useMemo(() => {
    if (!showRoute || items.length === 0) return "";

    // Sort items by aisle
    const sortedItems = [...items].filter(i => !i.checked).sort((a, b) => a.aisle - b.aisle);
    
    // Start at entrance (bottom center usually, let's say 50, 100)
    let path = "M 50 100 "; // Start point
    
    sortedItems.forEach(item => {
      // Find product coords or aisle center if product coords missing
      // We use product coords from mockData
      const x = item.coordinates.x;
      const y = item.coordinates.y;
      path += `L ${x} ${y} `;
    });
    
    // End at checkout (top center usually, let's say 50, 0 or similar)
    path += "L 50 5"; 

    return path;
  }, [items, showRoute]);

  // Convert logical 0-100 coords to SVG viewbox
  // We'll just use 0 0 100 110 ViewBox for simplicity
  
  return (
    <div className="w-full aspect-[4/5] bg-slate-50 relative rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <svg viewBox="0 0 100 110" className="w-full h-full p-4">
        {/* Entrance / Checkout Labels */}
        <text x="50" y="5" fontSize="4" textAnchor="middle" fill="#94a3b8">CHECKOUT</text>
        <text x="50" y="105" fontSize="4" textAnchor="middle" fill="#94a3b8">ENTRANCE</text>

        {/* Aisles */}
        {AISLES.map(aisle => (
          <g key={aisle.id} onClick={() => onAisleClick?.(aisle)}>
            <rect
              x={aisle.coordinates.x}
              y={aisle.coordinates.y}
              width={aisle.coordinates.w}
              height={aisle.coordinates.h}
              rx="2"
              fill={activeItem?.aisle === aisle.id ? "#D1FAE5" : "#E2E8F0"}
              stroke={activeItem?.aisle === aisle.id ? "#059669" : "#CBD5E1"}
              strokeWidth="0.5"
              className="transition-colors duration-300"
            />
            <text
              x={aisle.coordinates.x + aisle.coordinates.w / 2}
              y={aisle.coordinates.y + aisle.coordinates.h / 2}
              fontSize="3"
              fontWeight="bold"
              textAnchor="middle"
              fill="#64748B"
              className="pointer-events-none"
            >
              Aisle {aisle.id}
            </text>
          </g>
        ))}

        {/* Route Line */}
        {showRoute && (
          <path
            d={routePoints}
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 2"
            className="animate-pulse-slow"
          />
        )}

        {/* Item Dots */}
        {items.filter(i => !i.checked).map((item, idx) => (
          <g key={item.uniqueId}>
             <circle
              cx={item.coordinates.x}
              cy={item.coordinates.y}
              r={activeItem?.uniqueId === item.uniqueId ? 3 : 1.5}
              fill={activeItem?.uniqueId === item.uniqueId ? "#059669" : "#EF4444"}
              stroke="white"
              strokeWidth="0.5"
            />
            {activeItem?.uniqueId === item.uniqueId && (
               <circle
               cx={item.coordinates.x}
               cy={item.coordinates.y}
               r={6}
               fill="#10B981"
               opacity="0.3"
               className="animate-ping"
             />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
