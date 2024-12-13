<script>
  import work_experience from "../data/work_experience.json";
  import ExperienceItem from "./experience_item.svelte";
</script>

<section>
  <h3 class="text-3xl mb-5">Work Experiences</h3>
  <ul>
    {#each work_experience as experience}
      <li>
        <ExperienceItem company={experience.company} title={experience.title} from={experience.from} to={experience.to}/>
      </li>
    {/each}
  </ul>
</section>
