<script context="module">

  let timeFromApi;

  // Set the date we're counting down to
  const countDownDate = new Date({ timeFromApi }).getTime();

  // Update the count down every 1 second
   const CountDownTime = setInterval(function () {
    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="time"
    document.getElementById('countdownTimer').innerHTML =
      days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(CountDownTime);
      //document.getElementById('time').innerHTML = 'MISSION SUCCESSFUL!';
    }
  }, 1000);
</script>

