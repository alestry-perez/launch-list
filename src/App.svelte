<script>
	import { onMount } from 'svelte';

	import Card from './Card.svelte';
	import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';

	import { getData } from './launchAPI.svelte';
	import { convertDate, convertTime} from './DateConverter.svelte';
	
	let events =[];

	onMount(async()=>{
		events = await getData();
	})

	//Math.ceil((timeEnd.getTime() - (new Date()).getTime())/1000)
	//$: console.log(convertTime);

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
		countdown='T? --:--:--:--'
		date={convertDate(net)}
		time={convertTime(net)}
		/>
	{ /each }
	<Card
		rocketImage='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.2Xm3rl9hHe15FCosDQb1JwHaMC%26pid%3DApi&f=1'
		launchTitle='Launch Title'
		rocketStatus='Go'
		organization='SpaceX'
		launchPadLocation='39A'
		countdown='T? --:--:--:--'
		date='01/01/2021'
		time='13:00'
		/>
</div>
<Footer/>


