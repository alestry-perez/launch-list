<script>
   import Countdown from 'svelte-countdown';

   import { onMount } from 'svelte';
   import { getData } from './launchAPI.svelte';

   export let launchTitle;
   export let organization;
   export let launchPadLocation;
   export let date;
   export let time;
   export let rocketStatus;
   export let rocketImage;

   let events = [];

	onMount(async()=>{
		events = await getData();
	})
   
   //$: console.log(jsonResponse.net);
</script>

<!-- Start of component -->

   <div class="flex w-auto overflow-hidden bg-white rounded-lg shadow-lg h-60">
     <div class="w-1/3 bg-center bg-no-repeat bg-cover " style="background-image: url({rocketImage})">
     </div> 
     <div class="w-2/3 p-2 md:text-lg">
      <div id="body" class="flex flex-col ml-5">
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
            from=''
            dateFormat="YYYY-MM-DD HH:mm:ss" 
            let:remaining>
               <div id='countdownTimer' class="flex flex-row justify-center space-x-3 text-3xl text-center text-gray-800">
                  {#if remaining.done === false}
                  <h5>T-</h5>
                  <span>{remaining.days}</span>
                  <span> : </span>
                  <span>{remaining.hours}</span>
                  <span> : </span>
                  <span>{remaining.minutes}</span>
                  <span> : </span>
                  <span>{remaining.seconds}</span>
                  {:else}
                  <!-- <h2>LAUNCHED!</h2> -->
                  {/if}
              </div>
            </Countdown>
            <div class='flex flex-row justify-center space-x-2 pl-11'>
               <p class='text-xs text-center'>Days</p>
               <span> </span>
               <p class='text-xs text-center'>Hours</p>
               <span> </span>
               <p class='text-xs text-center'>Mins</p>
               <span> </span>
               <p class='text-xs text-center'>Secs</p>
            </div>  
         </div>
         <div id='date' class='mt-2 mb-2'>
            <h6 class='text-base text-center'>{date}</h6>
            <h6 id='timer' class='text-base text-center'>{time}hr</h6>
         </div>
      </div>
     </div>
   </div>
 
<!-- End of component -->