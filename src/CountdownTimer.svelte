<script context='module'>
  import {onMount, onDestroy} from "svelte";

  export const timeLeft = -1;
  export const onEnd = () => {
  };

  export const displayDays = true;
  export const displayHours = true;
  export const displayMinutes = true;
  export const displaySeconds = true;

  let timer;

  function formater(tl) {
      days = ~~(tl / 86400);
      if (displayDays) tl -= days * 86400;
      hours = ~~(tl / 3600);
      if (displayHours) tl -= hours * 3600;
      minutes = ~~(tl / 60);
      if (displayMinutes) tl -= minutes * 60;
      seconds = tl;

      if(!displaySeconds && seconds > 0) {
          minutes++;
          if(minutes==60) {
              minutes = 0; hours++;
          }
          if(hours==24 && displayDays) {
              hours = 0;
              days++;
          }
      }

      if(displayDays)
          strDays = (days < 10 ? '0' : '') + days + ':';
      if(displayHours)
          strHours = (hours < 10 ? '0' : '') + hours + ':';
      if(displayMinutes)
          strMinutes = (minutes < 10 ? '0' : '') + minutes + (displaySeconds?':':'');
      if(displaySeconds)
          strSeconds = (seconds < 10 ? '0' : '') + seconds;
  }
  onMount(() => {
      timer = setInterval(() => {
          if (timeLeft > 0) {
              --timeLeft;
          } else {
              clearInterval(timer);
              onEnd();
          }
      }, 1000);
  });
  onDestroy(() => {
      clearInterval(timer);
  });
  formater(timeLeft);

  let days = 0, hours = 0, minutes = 0, seconds = 0;
  let strDays = '', strHours = '', strMinutes = '', strSeconds = '';

</script>

<span>
  {strDays}{strHours}{strMinutes}{strSeconds}
</span>

