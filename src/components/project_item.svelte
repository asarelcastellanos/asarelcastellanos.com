<script>
  export let projectName;
  export let startDate;
  export let endDate;
  export let description;
  export let gitHubLink;
  export let websiteLink;
</script>

<div class="block lg:flex justify-between w-full p-2.5 px-4 lg:px-8">
    <div class="flex-1 mr-4">
        <h4 class="text-xl font-semibold">{projectName}</h4>
        <p class="text-sm font-thin">{description}</p>
    </div>
    <div class="flex-none mt-2 lg:mt-0 space-y-2 text-center">
        <p class="text-lg">{startDate} - {endDate}</p>
        {#if gitHubLink}
            <a
            href={gitHubLink}
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:underline cursor-pointer break-words block"
            >View Project</a
            >
        {/if}
        {#if websiteLink}
            <a
            href={websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:underline cursor-pointer break-words block"
            >Visit Site</a
            >
        {/if}
    </div>
</div>
