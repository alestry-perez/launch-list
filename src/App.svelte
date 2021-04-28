<script>
	import Card from './Card.svelte';
	import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';
</script>

<main class='bg-gray-200 select-auto'>
	<NavBar/>
	<div class="flex flex-col items-center justify-center">
		<Card 
		launchTitle='Launch Title' 
		organization='Organization Name' 
		launchPadLocation='Pad Location' 
		countdown='T 00:00:00'
		date='01/01/2021'
		time='13:45'
		status='GO'
		image='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.aeEolVHwf2538OOA_uWvUgHaPN%26pid%3DApi&f=1'
		/>
	</div>
	<Footer/>
</main>
