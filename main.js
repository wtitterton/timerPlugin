console.log(window);
var test = new Timer({
  container:"timerContainer",
  customClass:"my-timer",
  showMilliseconds:true,
  controls:true,
  timerType:'countdown'
});

window.onload = function()
{
  test.start();
}
