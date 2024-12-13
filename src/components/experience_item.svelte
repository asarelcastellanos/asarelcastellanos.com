<script>
    let { company, title, from, to } = $props()
</script>

<div class="block md:flex justify-between w-full p-2.5">
  <div>
    <h4 class="text-xl text-[yellows]">{company}</h4>
    <p class="text-md italic">{title}</p>
  </div>
  <div>
    <p class="text-md">{from} - {to}</p>
  </div>
</div>
