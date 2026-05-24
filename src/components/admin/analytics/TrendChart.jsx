import React from "react";

/**
 * TrendChart
 * 
 * Reusable, pure SVG interactive spark chart shell rendering trends (attendance health, fee collections)
 * with zero external dependencies for maximum compilation safety.
 */
const TrendChart = ({ 
  points = [85, 90, 88, 92, 94, 91, 95], 
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  height = 120,
  strokeColor = "#0077b6",
  fillColor = "rgba(202, 240, 248, 0.4)"
}) => {
  // Normalize points to chart viewBox space (viewBox: 0 0 500 120)
  const maxVal = 100;
  const minVal = 0;
  
  const width = 500;
  const paddingX = 40;
  const paddingY = 20;
  
  const chartHeight = height - paddingY * 2;
  const chartWidth = width - paddingX * 2;

  // Calculate coordinates
  const coords = points.map((p, index) => {
    const x = paddingX + (index / (points.length - 1)) * chartWidth;
    // Invert Y because SVG coordinates start from top
    const y = height - paddingY - ((p - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, value: p };
  });

  // Build SVG path
  let pathD = "";
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(" ");
  }

  // Build SVG area path
  let areaD = "";
  if (coords.length > 0) {
    areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;
  }

  return (
    <div className="w-full relative bg-white/50 rounded-2xl p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Grid lines */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#caf0f8" strokeDasharray="4 4" strokeWidth="0.75" />
        <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#caf0f8" strokeDasharray="4 4" strokeWidth="0.75" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#caf0f8" strokeWidth="0.75" />

        {/* Shaded Area */}
        {areaD && <path d={areaD} fill={fillColor} />}
        
        {/* Stroke Line */}
        {pathD && <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Coords dots & labels */}
        {coords.map((c, idx) => (
          <g key={idx}>
            <circle 
              cx={c.x} 
              cy={c.y} 
              r="4" 
              fill="#03045e" 
              stroke={strokeColor} 
              strokeWidth="2.5" 
              className="hover:scale-150 transition-transform cursor-pointer"
            />
            {/* Value Tooltip text */}
            <text 
              x={c.x} 
              y={c.y - 8} 
              textAnchor="middle" 
              className="text-[9px] font-black text-[#03045e]"
              fill="#03045e"
            >
              {c.value}%
            </text>
            {/* Day Label */}
            <text 
              x={c.x} 
              y={height - 4} 
              textAnchor="middle" 
              className="text-[8px] font-bold text-gray-400"
              fill="#9ca3af"
            >
              {labels[idx]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default React.memo(TrendChart);
