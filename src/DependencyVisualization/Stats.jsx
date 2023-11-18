import PropTypes from "prop-types";
import { React, useEffect, useState } from "react";

const buildAdjacencyList = (tasks, deps) => {
  if (!tasks?.length || !deps?.length) {
    return new Map();
  }

  const adjacencyList = new Map();
  tasks.forEach((task) => adjacencyList.set(task.id, []));
  deps.forEach((dep) =>
    adjacencyList.get(dep.predecessor_id).push(dep.successor_id),
  );
  return adjacencyList;
};

const getRootNodes = (tasks, deps) => {
  if (!tasks?.length || !deps?.length) {
    return new Set();
  }

  const rootNodes = new Set();
  tasks.forEach((task) => rootNodes.add(task.id));
  deps.forEach((dep) => rootNodes.delete(dep.successor_id));
  return rootNodes;
};

const getMaxDepth = (adjacencyList, root) => {
  if (!adjacencyList.get(root).length) return 1;
  return (
    1 +
    Math.max(
      ...adjacencyList.get(root).map((dep) => getMaxDepth(adjacencyList, dep)),
    )
  );
};

export const Stats = (props) => {
  const { isLoadingStats, onStatsLoaded, currentProject, className } = props;
  const { tasks, deps } = currentProject;

  const [adjacencyList, setAdjacencyList] = useState(new Map());
  const [rootNodes, setRootNodes] = useState(new Set());
  const [maxDepth, setMaxDepth] = useState(0);

  useEffect(() => {
    if (!tasks?.length || !deps?.length) {
      return;
    }

    setAdjacencyList(buildAdjacencyList(tasks, deps));

    const roots = getRootNodes(tasks, deps);
    setRootNodes(roots);
    rootNodes.forEach((root) => {
      const depth = getMaxDepth(adjacencyList, root);
      if (depth > maxDepth) {
        setMaxDepth(depth);
      }
    });

    onStatsLoaded();
  }, [tasks, deps]);

  return (
    <div
      className={`${className} border-slate-4300 z-10 w-fit rounded border-2 border-solid bg-white p-4`}
    >
      <h2 className="font-bold">Graph Stats</h2>
      <table>
        <tbody>
          <tr>
            <td>Task Count</td>
            <td className="pl-10">
              {isLoadingStats ? "-" : tasks?.length || 0}
            </td>
          </tr>
          <tr>
            <td>Dependency Count</td>
            <td className="pl-10">
              {isLoadingStats ? "-" : deps?.length || 0}
            </td>
          </tr>
          <tr>
            <td>Root Count</td>
            <td className="pl-10">{isLoadingStats ? "-" : rootNodes.size}</td>
          </tr>
          <tr>
            <td>Max Depth</td>
            <td className="pl-10">{isLoadingStats ? "-" : maxDepth}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Stats.propTypes = {
  isLoadingStats: PropTypes.bool,
  onStatsLoaded: PropTypes.func,
  currentProject: PropTypes.shape({
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    deps: PropTypes.arrayOf(
      PropTypes.shape({
        predecessor_id: PropTypes.string.isRequired,
        successor_id: PropTypes.string.isRequired,
      }),
    ),
  }),
  className: PropTypes.string,
};
