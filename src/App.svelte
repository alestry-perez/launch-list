<script>
	import { onMount } from 'svelte'
	import Card from './Card.svelte';
	import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';
	import { getData } from './launchAPI.svelte'
	import { convertDate } from './DateConverter.svelte'
	
	let events =[];
	$: console.log(events);

	onMount(async()=>{
		events = await getData();
	})
	
</script>

<main>
	<NavBar/>
	<div class="grid grid-flow-col grid-rows-4 gap-2 h-3/6">
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
</main>
