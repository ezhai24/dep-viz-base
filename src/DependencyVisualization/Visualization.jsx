import Dagre from "@dagrejs/dagre";
import PropTypes from "prop-types";
import { React, useEffect, useState } from "react";
import ReactFlow, { MarkerType, Position } from "reactflow";

import "reactflow/dist/style.css";

const getLayoutedElements = (tasks, deps) => {
  if (!tasks?.length || !deps?.length) {
    return {
      nodes: [],
      edges: [],
    };
  }

  const g = new Dagre.graphlib.Graph()
    .setDefaultEdgeLabel(() => ({}))
    .setGraph({ rankdir: "LR", nodesep: 100, ranksep: 200 });

  tasks.forEach((task) => g.setNode(task.id, task));
  deps.forEach((dep) => g.setEdge(dep.predecessor_id, dep.successor_id));

  Dagre.layout(g);

  return {
    nodes: tasks.map((task) => {
      const { x, y } = g.node(task.id);
      return {
        ...task,
        data: { label: task.name },
        position: { x, y },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    }),
    edges: g.edges().map(({ v, w }) => ({
      id: `${v}->${w}`,
      source: v,
      target: w,
      markerEnd: {
        type: MarkerType.Arrow,
      },
    })),
  };
};

export const Visualization = (props) => {
  const { isLoadingVis, onVisLoaded, currentProject } = props;
  const { tasks, deps } = currentProject;

  const [layouted, setLayouted] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const layoutedElements = getLayoutedElements(tasks, deps);
    setLayouted(layoutedElements);
    onVisLoaded();
  }, [tasks, deps]);

  if (isLoadingVis) {
    return <></>;
  }

  return (
    <div style={{ height: "500px" }}>
      <ReactFlow
        nodes={layouted.nodes}
        edges={layouted.edges}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        fitView
      />
    </div>
  );
};

Visualization.propTypes = {
  isLoadingVis: PropTypes.bool,
  onVisLoaded: PropTypes.func,
  currentProject: PropTypes.shape({
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    deps: PropTypes.arrayOf(
      PropTypes.shape({
        predecessor_id: PropTypes.string.isRequired,
        successor_id: PropTypes.string.isRequired,
      })
    ),
  }),
};
