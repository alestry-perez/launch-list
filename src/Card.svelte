<script>
   export let launchTitle;
   export let organization;
   export let launchPadLocation;
   export let countdown;
   export let date;
   export let time;
   export let status;
   export let image;
</script>


<!-- Start of component -->
<div class="w-6/12 p-3 ">
   <div class="flex overflow-hidden bg-white rounded-lg shadow-lg">
     <div class="w-1/3 bg-no-repeat bg-cover " style="background-image: url('{image}')">
     </div> 
     <div class="w-2/3 p-4">
      <div id="body" class="flex flex-col ml-5">
         <h4 id="name" class="mb-2 text-5xl font-semibold text-center">{launchTitle}</h4>
         <div class="flex justify-center">
            <span alt="avatar" class="flex items-center justify-center px-3 py-3 m-2 text-white bg-green-500 rounded-full justify-self-center">{status}</span>
            </div>
         <div id="launchInformation" class='mb-5'>
            <h6 class='text-4xl text-center'>{organization}</h6>
            <h6 class='text-2xl text-center'>{launchPadLocation}</h6>
         </div>
         <div id="launchTime" class='mb-5'>
            <h2 class="mt-2 text-center text-gray-800 text-7xl">{countdown}</h2>
         </div>
         <div id='date' class='mb-8'>
            <h6 class='text-2xl text-center'>{date}</h6>
            <h6 class='text-2xl text-center'>{time}hr</h6>
         </div>
      </div>
     </div>
   </div>
 </div>
<!-- End of component -->