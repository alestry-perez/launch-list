<script>
	import { onMount } from 'svelte'
	import Card from './Card.svelte';
	import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';
	import { getData } from './launchAPI.js'
	
	let events =[];
	$: console.log(events);

	onMount(async()=>{
		events = await getData();
	})
</script>

<main class='bg-gray-200 select-auto'>
	<NavBar/>
	<div class="flex flex-col items-center justify-center">
		{ #each events as {name, date} }
			<Card />
		{ /each }
	</div>
	<Footer/>
</main>
