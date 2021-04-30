<script context="module">
    export const convertDate = (dateString) =>{
		let newDate = new Date(dateString);
		//console.log(newDate);
		let readableDate = newDate.toLocaleDateString( {year: 'numeric', month:'numeric', day: 'numeric'})
		return readableDate;
	}
</script>