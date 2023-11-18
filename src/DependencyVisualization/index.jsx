import { React, useEffect, useState } from "react";

import api from "../api";

import { GraphStats } from "./GraphStats";
import { GraphViz } from "./GraphViz";

import "./styles.css";

export const DependencyVisualization = () => {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [currentProject, setCurrentProject] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await api.fetchProjects();
      setProjects(res);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!currentProjectId) {
      setCurrentProject({});
      return;
    }

    const fetchProject = async () => {
      const tasks = await api.fetchTasks(currentProjectId);
      const deps = await api.fetchDependencies(currentProjectId);
      setCurrentProject({ tasks, deps });
    };
    fetchProject();
  }, [currentProjectId]);

  const selectProject = (e) => {
    const projectId = e.target.value;
    setCurrentProjectId(projectId);
  };

  return (
    <div className="depVizContainer">
      <h1>Project</h1>
      <select onChange={selectProject}>
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
