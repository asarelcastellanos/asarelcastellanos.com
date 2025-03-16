<script>
  import projects from "../data/past_projects.json";
  import ProjectItem from "./project_item.svelte";
</script>

<section class="flex flex-col lg:flex-row pb-20">
  <div class="lg:w-1/2 p-2.5 px-4 lg:px-8">
    <h3 class="text-2xl mb-2 flex items-center font-semibold">
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
            d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
          />
        </svg>
      </span>
      Past Projects
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
            websiteLink={project.websiteLink}
          />
        </li>
      {/each}
    </ul>
  </div>
</section>
