import { React, useEffect, useState } from "react";

import api from "../api";

import { Stats } from "./Stats";
import { Visualization } from "./Visualization";

export const DependencyVisualization = () => {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [currentProject, setCurrentProject] = useState({});

  const [isLoadingStats, setIsLoadingStats] = useState(false);
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
    setIsLoadingStats(true);
    setIsLoadingVis(true);

    const projectId = e.target.value;
    setCurrentProjectId(projectId);
  };

  const onStatsLoaded = () => setIsLoadingStats(false);
  const onVisLoaded = () => setIsLoadingVis(false);

  return (
    <>
      <h1>Project</h1>
      <select
        onChange={selectProject}
        disabled={isLoadingStats || isLoadingVis}
      >
        <option value="" />
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <Stats
        isLoadingStats={isLoadingStats}
        onStatsLoaded={onStatsLoaded}
        currentProject={currentProject}
      />
      <Visualization
        isLoadingVis={isLoadingVis}
        onVisLoaded={onVisLoaded}
        currentProject={currentProject}
      />
    </>
  );
};
