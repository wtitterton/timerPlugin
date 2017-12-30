console.log(window);
var test = new Timer({
  container:"timerContainer",
  customClass:"my-timer",
  showMilliseconds:true,
  controls:true,
  timerType:'datetimer'
});

test.start();
