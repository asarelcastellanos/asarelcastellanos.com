<script>
  import "../app.css";
  import Navbar from "../components/navbar.svelte";
  let { children } = $props();
</script>

<div class="bg-[black] text-white h-screen">
  <Navbar />
  {@render children()}
</div>
