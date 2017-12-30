// functionality
  //multiple types of timers
    // count up timer
    // countdown timer
    // countdown to date
  // formating
      //show milliseconds


var Timer = (function(){
  /*******************************************
                  BASIC SETUP
  *******************************************/
  // CONSTRUCTOR
  this.Timer = function()
  {
    // global variables
    this.isOn = null;
    this.time = 0;
    this.offset = null;
    this.timerInterval = null;
    this.container = null;
    this.timerElement = null;
    this.startBtn = null;
    this.stopBtn = null;
    this.resetBtn = null;
    this.timeRemaining = null;
    this.unitSpans = {};

    // default options
    var defaults = {
      timerType:'default',
      showMilliseconds:false,
      customClass:'',
      container:'',
      controls:true,
      deadline:'2019-12-31',
      timeInMinutes:10

    }
    // check if argument passed is of type object
    if (arguments[0] && typeof arguments[0] === "object")
    {
      this.options = extendDefaults(defaults, arguments[0]);
    }
    //init timer
    init.call(this);
  }

  function extendDefaults(source, properties)
  {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }
  //PRIVATE METHODS
  function update()
  {
    if(this.options.timerType == "default")
    {
      //update timer element
      this.time += delta.call(this);
      var formattedTime = timeFormatter.call(this,this.time);
      this.timerElement.textContent = formattedTime;
    }
    else if(this.options.timerType == "datetimer")
    {
      var t = getTimeRemaining.call(this,this.options.deadline);
      this.unitSpans.daysSpan.textContent = t.days;
      this.unitSpans.hoursSpan.textContent = ('0' + t.hours).slice(-2);
      this.unitSpans.minutesSpan.textContent = ('0' + t.minutes).slice(-2);
      this.unitSpans.secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    }
    else
    {

      var t = getTimeRemaining.call(this,this.options.deadline);
      this.unitSpans.minutesSpan.textContent = ('0' + t.minutes).slice(-2);
      this.unitSpans.secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    }

  }

  function timeFormatter(timeInMilliseconds)
  {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();

    if(minutes.length < 2)
    {
      minutes = "0" + minutes;
    }
    if(seconds.length < 2)
    {
      seconds = "0" + seconds;
    }
    while(milliseconds.length < 3)
    {
        milliseconds = "0" + milliseconds;
    }
    if(this.options.showMilliseconds)
    {
      return minutes + ":" + seconds + "." + milliseconds;
    }
    return minutes + ":" + seconds;
  }

  function delta()
  {
    var now = Date.now();
    var timePassed = now - this.offset;
    this.offset = now;
    return timePassed;
  }

  function buildTimer()
  {
    // check for required options
    if(!this.options)
    {
      alert('container option is required');
    }
    else
    {
      // maybe do some checks here, as container must be string and not DOM NODE
      // then set this.container to option passed
      this.container = document.getElementById(this.options.container);
      // build corisponding UI for the timerType passed
      switch(this.options.timerType.toLowerCase())
      {
          case'default':
           buildDefaultTimer.call(this);
          break;
          case'countdown':
            buildCountDownTimer.call(this,this.timeRemaining);
          break;
          case'datetimer':
            buildDateTimer.call(this, this.timeRemaining);
          break;
          default:
            alert('please specify a valid timer type');

          break;
      }
    }
  }

  function buildDefaultTimer()
  {
    //create timer element and add default and custom id's and classes
    this.timerElement = document.createElement('h1');
    this.timerElement.classList.add('timer');
    this.timerElement.setAttribute("id",createUniqueId.call(this));
    this.options.customClass ? this.timerElement.classList.add(this.options.customClass) : this.options.customClass ;

    if(this.options.showMilliseconds)
    {
      // timer with milliseconds
      this.timerElement.innerHTML = "00:00:000";
    }
    else
    {
        this.timerElement.innerHTML = "00:00";
    }
    // append docFrag to the container specified in options
    this.container.appendChild(this.timerElement);
    if(this.options.controls)
    {
     createControls.call(this);
    }
  }

  function appendElementsToContainerFromArray(con,arr)
  {
    for(var i = 0; i < arr.length; i++)
    {
      con.appendChild(arr[i]);
    }
  }

  function createControls()
  {
    //create controlls for timer
    var controlsCon = document.createElement('div');
    this.startBtn = document.createElement('button');
    this.startBtn.value = "Start";
    this.startBtn.textContent = "Start";
    this.stopBtn = document.createElement('button');
    this.stopBtn.value = "Stop";
    this.stopBtn.textContent = "Stop";
    this.resetBtn = document.createElement('button');
    this.resetBtn.value = "Reset";
    this.resetBtn.textContent = "Reset";
    appendElementsToContainerFromArray.call(this,controlsCon,[this.startBtn, this.stopBtn, this.resetBtn ]);
    this.container.appendChild(controlsCon);
  }

  function createUniqueId()
  {
    return Math.random().toString(36).substr(2, 16);
  }

  function buildDateTimer(t)
  {
    this.timerElement = document.createElement('div');
    this.container.appendChild(this.timerElement);
    var html = "";
    html += 'days: ' + '<span class="days">' + t.days + '</span> ';
    html += 'hours: ' + '<span class="hours">' + t.hours + '</span> ';
    html += 'minutes: ' + '<span class="minutes">' + t.minutes + '</span> ';
    html += 'seconds: ' + '<span class="seconds">' + t.seconds + '</span> ';
    this.timerElement.innerHTML = html;
    // add span elements to global object so they can be accessed in the update function
    this.unitSpans.daysSpan = this.timerElement.querySelector('.days');
    this.unitSpans.hoursSpan = this.timerElement.querySelector('.hours');
    this.unitSpans.minutesSpan = this.timerElement.querySelector('.minutes');
    this.unitSpans.secondsSpan = this.timerElement.querySelector('.seconds');
      if(t.total<=0)
      {
        clearInterval(this.timerInterval);
      }
  }

  function buildCountDownTimer(t)
  {
    this.timerElement = document.createElement('div');
    this.container.appendChild(this.timerElement);
    var html = "";
    html += 'minutes: ' + '<span class="minutes">' + t.minutes + '</span> ';
    html += 'seconds: ' + '<span class="seconds">' + t.seconds + '</span> ';
    this.timerElement.innerHTML = html;
    // add span elements to global object so they can be accessed in the update function
    this.unitSpans.minutesSpan = this.timerElement.querySelector('.minutes');
    this.unitSpans.secondsSpan = this.timerElement.querySelector('.seconds');
      if(t.total<=0)
      {
        clearInterval(this.timerInterval);
      }
  }

  function getTimeRemaining(endtime)
  {

    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );

   return {
     total: t,
     days: days,
     hours: hours,
     minutes: minutes,
     seconds: seconds
   };
  }

  function init()
  {

    if(this.options.timerType == "default" ) bindEvents.call(this);
    if(this.options.timerType == "countdown")
    {
      var currentTime = Date.parse(new Date());
      this.options.deadline = new Date(currentTime + this.options.timeInMinutes*60*1000);
      this.timeRemaining = getTimeRemaining.call(this,this.options.deadline);
    }
    if(this.options.timerType == 'datetimer') this.timeRemaining =  getTimeRemaining.call(this,this.options.deadline);

    buildTimer.call(this);
  }

  function bindEvents()
  {
    if(this.options.controls)
    {
      // bind controller events;
      this.startBtn.addEventListener('click',this.start.bind(this));
      this.stopBtn.addEventListener('click',this.stop.bind(this));
      this.resetBtn.addEventListener('click',this.reset.bind(this));
    }
  }
  //PUBLIC METHODS
  Timer.prototype.stop = function()
  {
    if(this.isOn)
    {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.isOn = false;
    }
  }

  Timer.prototype.start = function()
  {
    if(this.options.timerType == "default")
    {
      if(!this.isOn)
      {
        var intervalSpeed;
        // set interval speed depending on if milliseconds is true or false
        this.options.showMilliseconds ? intervalSpeed = 10 : intervalSpeed = 1000;
        this.timerInterval = setInterval(function(){
          update.call(this);
        }.bind(this),intervalSpeed);
        this.offset = Date.now();
        this.isOn = true;
      }
      else {
        console.log('timer is already running');
      }
    }
    else if(this.options.timerType == "datetimer" || this.options.timerType == "countdown")
    {
      update.call(this);
      this.timerInterval = setInterval(function(){
        update.call(this);
      }.bind(this),1000);
    }


  }

  Timer.prototype.reset = function()
  {
    this.stop();
    this.time = 0;
    if(this.options.showMilliseconds)
    {
      this.timerElement.innerHTML = "00:00:000";
    }
    else
    {
      this.timerElement.innerHTML = "00:00";
    }
  }


  //RETURN CONSTRUCTOR
  return this.Timer;


})();
