import { React, useEffect, useState } from "react";

import api from "../api";

import { GraphStats } from "./GraphStats";
import { GraphViz } from "./GraphViz";

import "./styles.css";

export const DependencyVisualization = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await api.fetchProjects();
      setProjects(res);
    };
    fetchProjects();
  }, []);

  return (
    <div className="depVizContainer">
      <h1>Project</h1>
      <select>
        <option value="" />
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <GraphStats />
      <GraphViz />
    </div>
  );
};
