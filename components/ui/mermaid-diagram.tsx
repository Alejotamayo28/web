"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      sequence: {
        showSequenceNumbers: true,
        actorFontSize: 14,
        noteFontSize: 12,
        messageFontSize: 13,
      },
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError("");
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram");
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive text-sm">
        Error loading diagram
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={`mermaid-diagram overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// Mini version for card previews
interface MiniMermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MiniMermaidDiagram({ chart, className = "" }: MiniMermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      sequence: {
        showSequenceNumbers: false,
        actorFontSize: 10,
        noteFontSize: 8,
        messageFontSize: 9,
      },
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        const id = `mermaid-mini-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError("");
      } catch (err) {
        console.error("Mermaid mini render error:", err);
        setError("Failed to render");
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
        Diagram preview
      </div>
    );
  }

  return (
    <div 
      className={`mini-mermaid-diagram w-full h-full overflow-hidden ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{
          transform: 'scale(0.35)',
          transformOrigin: 'center center',
          minWidth: '285%',
          minHeight: '285%'
        }}
      />
    </div>
  );
}
