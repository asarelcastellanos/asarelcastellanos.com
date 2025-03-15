<script>
  import Experiences from "../components/experiences.svelte";
  import CurrentProjects from "../components/current_projects.svelte";
  import PastProjects from "../components/past_projects.svelte";
  import Education from "../components/education.svelte";
  import { onMount } from "svelte";

  let roles = ["Economist", "Data Analyst", "Software Developer"];
  let currentRole = roles[0];
  let index = 0;

  onMount(() => {
    const interval = setInterval(() => {
      index = (index + 1) % roles.length;
      currentRole = roles[index];
    }, 2500);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  });
</script>

<style>
  .slide-in {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }
  section {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>

<main class="p-4 space-y-8 slide-in">
  <section class="h-screen flex flex-col justify-center items-center">
    <h2 class="text-4xl">Asarel Castellanos</h2>
    <p class="text-2xl my-4">{currentRole}</p>
  </section>
  <section>
    <Education />
  </section>
  <section>
    <Experiences />
  </section>
  <section>
    <CurrentProjects />
  </section>
  <section>
    <PastProjects />
  </section>
</main>
