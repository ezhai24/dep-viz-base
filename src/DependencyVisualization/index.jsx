import { React, useEffect, useState } from "react";

import api from "../api";

import { GraphStats } from "./GraphStats";
import { Visualization } from "./Visualization";

import "./styles.css";

export const DependencyVisualization = () => {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [currentProject, setCurrentProject] = useState({});

  const [isLoadingVis, setIsLoadingVis] = useState(false);

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
    setIsLoadingVis(true);

    const projectId = e.target.value;
    setCurrentProjectId(projectId);
  };

  const onVisLoaded = () => setIsLoadingVis(false);

  return (
    <div className="depVizContainer">
      <h1>Project</h1>
      <select onChange={selectProject} disabled={isLoadingVis}>
        <option value="" />
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <GraphStats />
      <Visualization
        isLoadingVis={isLoadingVis}
        onVisLoaded={onVisLoaded}
        currentProject={currentProject}
      />
    </div>
  );
};
