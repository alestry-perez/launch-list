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
     <div class="w-2/3 p-2 md:text-lg">
      <div id="body" class="flex flex-col ml-5">
         <h4 id="name" class="font-semibold text-center text-1xl">{launchTitle}</h4>
         <div class="flex justify-center">
            <span alt="Rocket Status" class="flex items-center justify-center h-6 p-2 text-xl text-white bg-green-500 rounded-full justify-self-center">{rocketStatus}</span>
         </div>
         <div id="launchInformation" class='mb-1'>
            <h6 class='text-base text-center'>{organization}</h6>
            <h6 class='text-base text-center'>{launchPadLocation}</h6>
         </div>
         <div id="launchTime">
            <h2 id='countdownTimer' class="text-2xl text-center text-gray-800">{countdown}
            </h2>
            <!-- <div class='flex flex-row justify-center space-x-4'>
               <p class='text-sm text-center'> T- </p>
               <p class='text-sm text-center'></p>
               <span> : </span>
               <p class='text-sm text-center'></p>
               <span> : </span>
               <p class='text-sm text-center'></p>
               <span> : </span>
               <p class='text-sm text-center'></p>
            </div> -->
            <div class='flex flex-row justify-center space-x-4'>
               <p class='text-sm text-center'>Days</p>
               <p class='text-sm text-center'>Hours</p>
               <p class='text-sm text-center'>Minutes</p>
               <p class='text-sm text-center'>Seconds</p>
            </div>
            
         </div>
         <div id='date' class='mb-2'>
            <h6 class='text-base text-center'>{date}</h6>
            <h6 id='timer' class='text-base text-center'>{time}hr</h6>
         </div>
      </div>
     </div>
   </div>
 </div>
<!-- End of component -->