<script>
  import projects from "../data/current_projects.json";
  import ProjectItem from "./project_item.svelte";
</script>

<section class="flex flex-col lg:flex-row pb-20">
  <div class="lg:w-1/2 p-2.5 px-4 lg:px-8">
    <h3 class="text-2xl mb-2 flex items-center">
      <span class="mr-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
          />
        </svg>
      </span>
      Current Projects
    </h3>
  </div>
  <div class="lg:w-1/2">
    <ul>
      {#each projects as project}
        <li>
          <ProjectItem
            projectName={project.projectName}
            startDate={project.startDate}
            endDate={project.endDate}
            description={project.description}
            gitHubLink={project.gitHubLink}
          />
        </li>
      {/each}
    </ul>
  </div>
</section>
