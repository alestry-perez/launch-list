<script>
   import Countdown from 'svelte-countdown';

   export let launchTitle;
   export let organization;
   export let launchPadLocation;
   export let date;
   export let time;
   export let rocketStatus;
   export let rocketImage;
   export let eventTime;
   
</script>

<!-- Start of component -->

   <div class="flex w-auto overflow-hidden bg-white rounded-lg shadow-lg h-60">
     <div class="w-1/3 bg-center bg-no-repeat bg-cover " style="background-image: url({rocketImage})">
     </div> 
     <div class="w-2/3 p-2 md:text-lg">
      <div id="body" class="grid justify-center grid-cols-1">
         <h4 id="name" class="font-semibold text-center text-1xl">{launchTitle}</h4>
         <div class="flex justify-center">
            <span alt="Rocket Status" class="flex items-center justify-center h-6 p-1 text-base text-white bg-green-500 rounded-full justify-self-center">{rocketStatus}</span>
         </div>
         <div id="launchInformation" class='mb-1'>
            <h6 class='text-base text-center'>{organization}</h6>
            <h6 class='text-base text-center'>{launchPadLocation}</h6>
         </div>
         <div id="launchTime">
            <Countdown 
            from={eventTime}
            dateFormat="YYYY-MM-DDTHH:mm:ssZ" 
            zone="Europe/Stockholm"
            let:remaining>
               <div id='countdownTimer' class="grid justify-center grid-cols-8 text-3xl text-center text-gray-800 grid-row-2">
                  {#if remaining.done === false}
                  <h5>T-</h5>
                  <span>{remaining.days}</span>
                  <p class='col-start-2 row-start-2 text-xs text-center'>Days</p>
                  <span> : </span>
                  <span>{remaining.hours}</span>
                  <p class='col-start-4 row-start-2 text-xs text-center'>Hours</p>
                  <span> : </span>
                  <span>{remaining.minutes}</span>
                  <p class='col-start-6 row-start-2 text-xs text-center'>Mins</p>
                  <span> : </span>
                  <span>{remaining.seconds}</span>
                  <p class='col-start-8 row-start-2 text-xs text-center'>Secs</p>
                  {:else}
                  <h2 class='col-start-3 text-center'>LAUNCHED!</h2>
                  {/if}
              </div>
            </Countdown>
         </div>
         <div id='date' class='grid justify-center grid-cols-2 grid-rows-1 mt-3 mx-14 w-52'>
            <h6 class='text-base text-center'>{date}</h6>
            <h6 id='timer' class='text-base text-center'>{time}hr</h6>
         </div>
      </div>
     </div>
   </div>
 
<!-- End of component -->