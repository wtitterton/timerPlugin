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
    this.timerInterval = null;
    this.units = {};
    this.container = null;
    this.timerElement = null;
    this.startBtn = null;
    this.stopBtn = null;
    this.resetBtn = null;
    this.days = 0;
    this.hours = "00";
    this.mins = "00";
    this.seconds = "00";
    this.miliseconds = "00";
    // default options
    var defaults = {
      timerType:'default',
      milliseconds:false,
      customClass:'',
      container:'',
      controls:true
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
  var update = function()
  {
    // render timer on interval
    console.log('fdfdfddf');
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
             buildCountDownTimer.call(this);
          break;
          case'datetimer':
            buildDateTimer.call(this);
          break;
          default:
            alert('please specify a valid timer type');
          break;
      }
    }
  }

  function buildDefaultTimer()
  {
    //create doc fragment to build UI with
    docFrag = document.createDocumentFragment();
    //create timer element and add default and custom id's and classes
    this.timerElement = document.createElement('div');
    this.timerElement.classList.add('timer');
    this.timerElement.setAttribute("id",createUniqueId.call(this));
    this.options.customClass ? this.timerElement.classList.add(this.options.customClass) : this.options.customClass ;
    var hoursElement = document.createElement('span');
    hoursElement.classList.add("unit","hours");
    hoursElement.textContent = this.hours + ":";
    var minsElement = document.createElement('span');
    minsElement.classList.add("unit","mins");
    minsElement.textContent = this.mins + ":";
    var secondsElement = document.createElement('span');
    secondsElement.classList.add("unit", "seconds");
    secondsElement.textContent = this.seconds;
    if(this.options.milliseconds)
    {
      var millisecondsElement = document.createElement('span');
      millisecondsElement.classList.add("unit","milli");
      millisecondsElement.textContent = this.milliseconds;
      appendElementsToContainerFromArray.call(this,this.timerElement,[hoursElement,minsElement, secondsElement, millisecondsElement ]);
      this.units.milliseconds = millisecondsElement;
    }
    appendElementsToContainerFromArray.call(this,this.timerElement,[hoursElement,minsElement, secondsElement]);
    if(this.options.controls)
    {
     createControls.call(this);
    }

    // grab unit elements so we can update values later
    this.units.hours = hoursElement;
    this.units.mins = minsElement;
    this.units.seconds = secondsElement;
    // append finished timer element to docfrag
    docFrag.appendChild(this.timerElement);
    // append docFrag to the container specified in options
    this.container.appendChild(docFrag);
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
    this.timerElement.appendChild(controlsCon);
  }

  function createUniqueId()
  {
    return Math.random().toString(36).substr(2, 16);
  }

  function buildCountDownTimer()
  {
    console.log('build countdown timer Youth');
  }

  function buildDateTimer()
  {
    console.log('build Date Timer Youth');
  }

  function init()
  {
    buildTimer.call(this);
    bindEvents.call(this);
  }

  Timer.prototype.stop = function()
  {
    clearInterval(this.timerInterval);
  }

  Timer.prototype.start = function()
  {
    this.timerInterval = setInterval(function(){
    update.call(this);
    }.bind(this),1000);

  }

  Timer.prototype.reset = function()
  {
    this.stop();
    this.hours = "00";
    this.mins = "00";
    this.seconds = "00";
    this.miliseconds = "00";
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

  //RETURN CONSTRUCTOR
  return this.Timer;


})();
