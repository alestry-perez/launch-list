<script>
    import { onMount } from "svelte";
  
    export const apiURL = `https://ll.thespacedevs.com/2.0.0/launch/${launchId}`;
    export let data = [];

    onMount(async function() {
        const reponse = await fetch(apiURL);
        data = await reponse.json();
    });
    
  </script>


