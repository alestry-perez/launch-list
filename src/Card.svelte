<script>
   export let launchTitle;
   export let organization;
   export let launchPadLocation;
   export let countdown;
   export let date;
   export let time;
   export let rocketStatus;
   export let rocketImage;
</script>


<!-- Start of component -->
<div>
   <div class="flex w-auto overflow-hidden bg-white rounded-lg shadow-lg h-60">
     <div class="w-1/3 bg-center bg-no-repeat bg-cover " style="background-image: url({rocketImage})">
     </div> 
     <div class="w-2/3 p-4 md:text-lg">
      <div id="body" class="flex flex-col ml-5">
         <h4 id="name" class="mb-2 font-semibold text-center text-1xl">{launchTitle}</h4>
         <div class="flex justify-center">
            <span alt="avatar" class="flex items-center justify-center w-5 h-5 m-2 text-xl text-white bg-green-500 rounded-full justify-self-center">{rocketStatus}</span>
            </div>
         <div id="launchInformation" class='mb-5'>
            <h6 class='text-center text-1xl'>{organization}</h6>
            <h6 class='text-center text-1xl'>{launchPadLocation}</h6>
         </div>
         <div id="launchTime" class='mb-5'>
            <h2 id='countdownTimer' class="mt-2 text-2xl text-center text-gray-800">{countdown}</h2>
         </div>
         <div id='date' class='mb-8'>
            <h6 class='text-center text-1xl'>{date}</h6>
            <h6 id='timer' class='text-center text-1xl'>{time}hr</h6>
         </div>
      </div>
     </div>
   </div>
 </div>
<!-- End of component -->