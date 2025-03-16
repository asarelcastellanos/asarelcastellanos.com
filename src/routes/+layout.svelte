<script>
  import "../app.css";
  import Navbar from "../components/navbar.svelte";
  let { children } = $props();

  import { injectSpeedInsights } from "@vercel/speed-insights";

  injectSpeedInsights();
</script>

<div class="bg-[black] text-white">
  <Navbar />
  {@render children()}
</div>
