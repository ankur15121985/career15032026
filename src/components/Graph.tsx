import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CareerNode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GraphProps {
  data: CareerNode;
  onNodeClick: (node: CareerNode) => void;
  expandAll?: boolean;
}

const Graph: React.FC<GraphProps> = ({ data, onNodeClick, expandAll = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [root, setRoot] = useState<d3.HierarchyNode<CareerNode> | null>(null);
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

    const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

    svg.call(zoom);

    const handleResize = () => {
      svg.attr('width', window.innerWidth).attr('height', window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const treeLayout = d3.tree<CareerNode>()
      .nodeSize([80, 250]); // Increased spacing for labels

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

    setRoot(hierarchy);

    const update = (source: any) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const nodes = hierarchy.descendants();
      const links = hierarchy.links();

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
          .x((d: any) => source.y0 || source.y)
          .y((d: any) => source.x0 || source.x) as any);

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
          .x((d: any) => source.y)
          .y((d: any) => source.x) as any)
        .remove();

      // Nodes
      const node = g.selectAll('.graph-node')
        .data(nodes, (d: any) => d.data.id);

      const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'graph-node')
        .attr('transform', `translate(${source.y0 || source.y},${source.x0 || source.x})`)
        .style('cursor', 'pointer')
        .on('click', (event, d: any) => {
          if (d.data.is_leaf) {
            onNodeClick(d.data);
          } else {
            if (d.children) {
              d._children = d.children;
              d.children = undefined;
            } else {
              d.children = d._children;
              d._children = undefined;
            }
            update(d);
          }
        });

      nodeEnter.append('circle')
        .attr('r', (d: any) => d.data.type === 'root' ? 16 : d.data.is_leaf ? 8 : 12)
        .attr('fill', (d: any) => {
          if (d.data.type === 'root') return isDarkMode ? '#818cf8' : '#1e293b';
          if (d.data.is_leaf) return '#10b981';
          const colors = isDarkMode ? ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'] : ['#4f46e5', '#7c3aed', '#9333ea', '#c026d3'];
          return colors[d.depth % colors.length];
        })
        .attr('stroke', isDarkMode ? '#0f172a' : '#fff')
        .attr('stroke-width', 3);

      nodeEnter.append('text')
        .attr('dy', '0.31em')
        .attr('x', (d: any) => d.children || d._children ? -24 : 24)
        .attr('text-anchor', (d: any) => d.children || d._children ? 'end' : 'start')
        .text((d: any) => d.data.name)
        .attr('class', 'font-display text-sm font-bold tracking-tight')
        .style('fill', (d: any) => isDarkMode ? '#f8fafc' : '#0f172a');

      const nodeUpdate = nodeEnter.merge(node as any);

      nodeUpdate.transition()
        .duration(500)
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

      nodeUpdate.select('text')
        .attr('x', (d: any) => d.children || d._children ? -24 : 24)
        .attr('text-anchor', (d: any) => d.children || d._children ? 'end' : 'start')
        .style('fill', (d: any) => isDarkMode ? '#f8fafc' : '#0f172a');

      node.exit().transition()
        .duration(500)
        .attr('transform', `translate(${source.y},${source.x})`)
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
  }, [data, regroupTrigger, theme]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      <div className="absolute top-28 right-8 flex gap-4 pointer-events-auto z-[110]">
        <button 
          onClick={regroup}
          className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-bold shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Regroup Branches
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
