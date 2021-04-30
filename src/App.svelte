<script>
	import { onMount } from 'svelte'
	import Card from './Card.svelte';
	import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';
	import { getData } from './launchAPI.svelte'
	import { convertDate } from './DateConverter.svelte'
	
	
	let events =[];
	//$: console.log(events);

	onMount(async()=>{
		events = await getData();
	})
	
</script>

<NavBar/>
<div class="grid h-auto grid-cols-3 gap-2 pt-5 pb-5">
	{ #each events as {name, image, pad, net, launch_service_provider, status} }
		<Card
		rocketImage={image}
		launchTitle={name}
		rocketStatus={status.abbrev}
		organization={launch_service_provider.name}
		launchPadLocation={pad.name} 
		countdown='T? --:--:--'
		date={convertDate(net)}
		time='#'
		/>
	{ /each }
</div>
<Footer/>


