<script>
    export let projectName;
    export let startDate;
    export let endDate;
    export let description;
    export let gitHubLink;
</script>

<div class="block lg:flex justify-between w-full p-2.5 px-4 lg:px-8">
    <div class="flex-1 mr-4">
        <h4 class="text-xl">{projectName}</h4>
        <p class="text-sm">{description}</p>
    </div>
    <div class="flex-none mt-2 lg:mt-0">
        <p class="text-lg">{startDate} - {endDate}</p>
        <a href={gitHubLink} class="text-white hover:underline cursor-pointer break-words">View Project</a>
    </div>
</div>