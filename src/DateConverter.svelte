<script context="module">
    export const convertDate = (dateString) =>{
		let newDate = new Date(dateString);
		//console.log(newDate);
		let readableDate = newDate.toLocaleDateString({ 
			year: 'numeric', 
			month:'numeric', 
			day: 'numeric' 
		})
		return readableDate;
	}

	export const convertTime = (timeString) => {
		let newTime = new Date(timeString);
		console.log(newTime);
		let readableTime = newTime.toLocaleTimeString("en-IN", { 
			hour12: false, 
			hour: '2-digit', 
			minute: '2-digit', 
			second: '2-digit'  
		})
		return readableTime;
	}
</script>