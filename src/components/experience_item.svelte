<script>
    export let companyName;
    export let jobTitle;
    export let startDate;
    export let endDate;
</script>

<div class="block lg:flex justify-between w-full p-2.5 px-4 lg:px-8">
  <div>
    <h4 class="text-xl font-semibold">{companyName}</h4>
    <p class="text-lg italic font-thin">{jobTitle}</p>
  </div>
  <div>
    <p class="text-lg">{startDate} - {endDate}</p>
  </div>
</div>
