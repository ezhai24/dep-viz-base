import { React } from "react";

import { GraphStats } from "./GraphStats";
import { GraphViz } from "./GraphViz";

import "./styles.css";
// import api from './api';

export const DependencyVisualization = () => {
  return (
    <div className="depVizContainer">
      <h1>Project</h1>
      <select>
        <option />
        <option value="pid1">Placeholder Project Name 1</option>
        <option value="pid2">Placeholder Project Name 2</option>
      </select>

      <GraphStats />
      <GraphViz />
    </div>
  );
};
