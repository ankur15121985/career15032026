import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CareerNode } from '../types';
import { RefreshCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GraphProps {
  data: CareerNode;
  onNodeClick: (node: CareerNode) => void;
  expandAll?: boolean;
}

const Graph: React.FC<GraphProps> = ({ data, onNodeClick, expandAll = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();

  const [regroupTrigger, setRegroupTrigger] = useState(0);

  const regroup = () => {
    setRegroupTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event: any) => {
      g.attr('transform', event.transform);
    });

    svg.call(zoom);

    const handleResize = () => {
      svg.attr('width', window.innerWidth).attr('height', window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const treeLayout = d3.tree<CareerNode>()
      .nodeSize([100, 300]); // Increased spacing for labels and branches

    const hierarchy = d3.hierarchy(data, (d) => d.children);
    
    if (!expandAll) {
      // Initially collapse all nodes
      hierarchy.descendants().forEach((d: any) => {
        if (d.children) {
          d._children = d.children;
          d.children = undefined;
        }
      });

      // Re-expand root's children to show the first level
      if ((hierarchy as any)._children) {
        hierarchy.children = (hierarchy as any)._children;
        (hierarchy as any)._children = undefined;
      }
    }

    const update = (source: any) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const nodes = hierarchy.descendants();
      const links = hierarchy.links();
      console.log("[Graph] Updating tree layout. Nodes:", nodes.length, "Links:", links.length);

      treeLayout(hierarchy);

      // Links
      const link = g.selectAll('.graph-link')
        .data(links, (d: any) => d.target.data.id);

      const linkEnter = link.enter()
        .append('path')
        .attr('class', 'graph-link')
        .attr('stroke', isDarkMode ? '#334155' : '#e2e8f0')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', d3.linkHorizontal()
          .x(() => (source as any).y0 || (source as any).y)
          .y(() => (source as any).x0 || (source as any).x) as any);

      const linkUpdate = linkEnter.merge(link as any);
      linkUpdate.transition()
        .duration(500)
        .attr('stroke', isDarkMode ? '#475569' : '#cbd5e1')
        .attr('d', d3.linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x) as any);

      link.exit().transition()
        .duration(500)
        .attr('d', d3.linkHorizontal()
          .x(() => (source as any).y)
          .y(() => (source as any).x) as any)
        .remove();

      // Nodes
      const node = g.selectAll('.graph-node')
        .data(nodes, (d: any) => d.data.id);

      const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'graph-node')
        .attr('transform', `translate(${(source as any).y0 || (source as any).y},${(source as any).x0 || (source as any).x})`)
        .style('cursor', 'pointer')
        .on('click', (event: any, d: any) => {
          // Toggle expansion for non-leaf nodes
          if (!d.data.is_leaf) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            update(d);
          }
          
          // Always open side panel on click
          onNodeClick(d.data);
          event.stopPropagation();
        });

      nodeEnter.append('circle')
        .attr('r', (d: any) => d.data.type === 'root' ? 18 : d.data.is_leaf ? 10 : 14)
        .attr('fill', (d: any) => {
          if (d.data.type === 'root') return isDarkMode ? '#818cf8' : '#6366f1';
          if (d.data.is_leaf) return '#10b981';
          const colors = isDarkMode ? ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'] : ['#4f46e5', '#7c3aed', '#9333ea', '#c026d3'];
          return colors[d.depth % colors.length];
        })
        .attr('stroke', 'none')
        .style('filter', (d: any) => d.data.is_leaf ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' : 'none');

      // Add a smaller inner circle for a "hardware" look
      nodeEnter.append('circle')
        .attr('r', (d: any) => d.data.type === 'root' ? 6 : d.data.is_leaf ? 3 : 4)
        .attr('fill', '#fff')
        .attr('opacity', 0.5);

      nodeEnter.append('text')
        .attr('dy', '0.31em')
        .attr('x', (d: any) => d.children || d._children ? -28 : 28)
        .attr('text-anchor', (d: any) => d.children || d._children ? 'end' : 'start')
        .text((d: any) => d.data.name)
        .attr('class', 'font-display text-[10px] md:text-sm font-bold tracking-tight')
        .style('fill', () => isDarkMode ? '#f8fafc' : '#0f172a')
        .style('text-shadow', isDarkMode ? '0 2px 4px rgba(0,0,0,0.5)' : '0 1px 2px rgba(255,255,255,0.8)');

      const nodeUpdate = nodeEnter.merge(node as any);

      nodeUpdate.transition()
        .duration(500)
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

      nodeUpdate.select('text')
        .attr('x', (d: any) => d.children || d._children ? -28 : 28)
        .attr('text-anchor', (d: any) => d.children || d._children ? 'end' : 'start')
        .style('fill', () => isDarkMode ? '#f8fafc' : '#0f172a');

      node.exit().transition()
        .duration(500)
        .attr('transform', () => `translate(${(source as any).y},${(source as any).x})`)
        .remove();

      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    update(hierarchy);

    // Initial center
    const initialTransform = d3.zoomIdentity.translate(150, height / 2).scale(0.9);
    svg.transition().duration(750).call(zoom.transform, initialTransform);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, regroupTrigger, theme, expandAll, onNodeClick]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      <div className="absolute top-28 right-8 flex flex-col items-end gap-4 pointer-events-auto z-[110]">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">System Status</span>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live: Career Data</span>
          </div>
        </div>

        <button 
          onClick={regroup}
          className="group relative px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold shadow-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-indigo-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="relative z-10 text-xs uppercase tracking-widest">Regroup Branches</span>
        </button>
      </div>

      <div className="absolute bottom-8 left-8 pointer-events-none">
        <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
          Career<span className="text-indigo-600 dark:text-indigo-400">Map</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-sans mt-2">
          Explore career paths starting from 10th Standard. Click nodes to expand.
        </p>
      </div>
    </div>
  );
};

export default Graph;
