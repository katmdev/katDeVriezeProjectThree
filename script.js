const alarmApp = {};
/*arrays of string values for month and date for display*/
alarmApp.months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
alarmApp.weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]
/* get current time/date from new Date(), replace day of week and month with strings for better readability*/
alarmApp.getCurrentTime = () => {
    /*gets new Date() object from current time*/
    const fullDate = new Date();
    /*create object for current time-frame to facilitate looping in formatTime()*/
    alarmApp.current = [
        'current', /*time frame*/
        fullDate.getFullYear(), /*year*/
        fullDate.getMonth(), /*month*/
        alarmApp.months[fullDate.getMonth()], /*month string*/
        fullDate.getDate(), /*date*/
        alarmApp.weekDays[fullDate.getDay()], /*day of week string*/
        fullDate.getHours(), /*hour*/
        fullDate.getMinutes(), /*minute*/
        fullDate.getSeconds(), /*second*/
        fullDate.getTime() /*millisecond*/
    ];
    /*format time for display*/
    alarmApp.formatTime(alarmApp.current);
};
/*Replace single digit numbers with double digit by concatenating into string */
alarmApp.formatTime = (time) => {
    const mappedArray = time.map((timeVariable) => {
        if (typeof timeVariable === 'number' && timeVariable < 10) {
            timeVariable = "0" + timeVariable;
            return(timeVariable);
        } else {
            return(timeVariable);
        }
    });
    if (mappedArray[0] == 'countdown') {
        /*display formatted array immediately*/ 
        $('.countdown__container').empty().append('<h2>').text(`${mappedArray[1]} days, ${mappedArray[2]} hours, ${mappedArray[3]} minutes, & ${mappedArray[4]} seconds remain.`);
    } else {
        /*pass formatted array to displayTime() for more specific time formatting*/
        alarmApp.displayTime(mappedArray);
    }
};
/*creates and adds html element with proper grammatical formatting of date*/
alarmApp.displayTime = (timeArray) => {
    /*allows function to be reused in display of both current and alarm times*/
    let fontSize = " ";
    if (timeArray[0] == 'current') {
        fontSize = `<h1>`;
    } else if (timeArray[0] == 'alarm'){
        fontSize = `<p>`;
    };
    const dateString = `${timeArray[5]}, ${timeArray[3]} ${timeArray[4]}, ${timeArray[1]}`;
    const dateContent = $(`${fontSize}`).html(dateString);
    const dateElement = $('<time>').addClass(`date__container`).append(dateContent);
    const timeString = `${timeArray[6]}:${timeArray[7]}:${timeArray[8]}`;
    const timeContent = $(`${fontSize}`).html(timeString);
    const timeElement = $('<time>').addClass(`time__container`).append(timeContent);
    /*adds date/time to html*/ 
    $(`#date__${timeArray[0]}`).empty().append(dateElement, timeElement);
    if (timeArray[0] == "alarm") {
        /*add additional elements for readability and buttons*/ 
        const setString = $('<h2>').text(`Your alarm is set for:`);
        const atString = $('<p>').text(`@`);
        const countdownContainer = $('<time>').addClass(`countdown__container`);
        const resetString = $('<button>').addClass(`reset`).text('Reset');
        const closeString = $('<button>').addClass(`close`).text('Close');
        /*adds to html*/ 
        $('#date__alarm .date__container').prepend(setString).append(atString);
        $('#date__alarm').append(countdownContainer).append(resetString, closeString);
        /*runs countdown and sets interval*/ 
        alarmApp.countdownInterval = setInterval(alarmApp.getCountdown, 1000);
        alarmApp.getCountdown();
        /*displays user's alarm time and countdown*/
        $('#date__alarm').animate({height: 'toggle'}, 1500,  "linear");
    }
};
// displays form
alarmApp.displayForm = () => {
    const form = $('<form>').addClass('alarm__container').attr('action', '#');
    const setString = $('<button>').addClass(`set`).text('Set');
    const closeString = $('<button>').addClass(`close`).text('Close');
    $('#date__alarm').empty().append(form).append(setString, closeString);
    // values for form inputs
    const formInput = [
        'year',
        'month',
        'day',
        'hour',
        'minute'
    ]
    // add elements to form labels and inputs
    formInput.forEach(timePeriod => {
        let length;
        if (timePeriod == 'year') {
            length = '4';
        } else {
            length = '2';
        }
        let label = $('<label>').addClass('sr-only').attr('for', `${timePeriod}`).text(`${timePeriod}`);
        let input = $('<input>').attr({type: 'text', name: `${timePeriod}`, id: `${timePeriod}`, placeholder: `${timePeriod}`, minlength: `${length}`, maxlength: `${length}`});
        /*adds to html*/ 
        $('form').append(label, input);
    });
};
/*determines button class and calls associated function*/
alarmApp.buttonActions = (element) => {
    if (element.hasClass('set')) {
        /*gets alarm time from user-completed form*/ 
        alarmApp.getAlarmTime();
    } else if (element.hasClass('close')) {
        /*hides alarm*/ 
        $('#date__alarm').animate({height: 'toggle'}, 1500,  "linear");
        /*reveals footer after alarm is hidden*/ 
        $('footer').delay(1500).animate({height: 'toggle'}, 1000,  "linear");
    } else if (element.hasClass('reset')) {
        /*hides alarm*/ 
        $('#date__alarm').animate({height: 'toggle'}, 1500,  "linear");
        /*updates footer text after alarm is hidden*/ 
        $('footer span').delay(1500).text('set');
        /*stops countdown*/ 
        clearInterval(alarmApp.countdownInterval);
        /*adds form to html once alarm is out of sight*/ 
        setTimeout(function() {
            alarmApp.displayForm();
        }, 1500);
        /*reveals alarm once content has changed*/ 
        $('#date__alarm').animate({height: 'toggle'}, 1500,  "linear");
        /*pauses audio if audio is playing*/ 
        document.getElementById('alarmTone').pause();
    }
};
// gets alarm time from user input
alarmApp.getAlarmTime = () => {
    /*create object for alarm time-frame to facilitate looping in formatTime()*/
    alarmApp.alarm = [
        'alarm', /*[0] time frame*/
        parseInt($('input[name=year]').val()), /*[1]year*/
        parseInt($('input[name=month]').val()) - 1, /*[2]month numeric, month range from 0-11*/
        /*[N/A][3 after splice]month string goes here*/ 
        parseInt($('input[name=day]').val()), /*[3][4 after splice]date*/
        /*[N/A][5 after splice]day of the week string goes here*/ 
        parseInt($('input[name=hour]').val()), /*[4][6 after splice]hour*/
        parseInt($('input[name=minute]').val()), /*[5][7 after splice]minute*/
        "00" /*[6][8 after splice]second*/
        /*[N/A][9 after push]millisecond*/ 
    ];
    /*gets new Date() object from user input*/
    const alarmTime = new Date(alarmApp.alarm[1], alarmApp.alarm[2], alarmApp.alarm[3], alarmApp.alarm[4], alarmApp.alarm[5]);
    /*add milliseconds to end of array*/
    alarmApp.alarm.push(alarmTime.getTime());
    /*add month string*/
    alarmApp.alarm.splice(3, 0, alarmApp.months[alarmTime.getMonth()]);
    /*add day string*/
    alarmApp.alarm.splice(5, 0, alarmApp.weekDays[alarmTime.getDay()]);
    /*if alarm time is in the future*/ 
    if (alarmApp.alarm[9] > alarmApp.current[9]) {
        /*hide alarm container to change content*/ 
        $('#date__alarm').animate({height: 'toggle'}, 1500,  "linear");
        /*change footer text to show alarm is engaged*/ 
        $('footer span').text('view');
        /*hide error if it's still showing*/ 
        $('.error').hide();
        /*format time for display after alarm container is hidden*/
        setTimeout(function() {
            alarmApp.formatTime(alarmApp.alarm);
        }, 1500);
    } else {
        /*throw error if alarm time is in the future, the values aren't correct, the characters aren't recognized, etc.*/ 
        const errorString = $('<p>').text(`Please ensure all fields are filled. 4 digits are required for year, and 2 digits are required for all other options. Your alarm should also be set for a time in the future. Click to close.`);
        /*add error to page*/ 
        $('.error').html(errorString);
        /*animate error into view*/ 
        $('.error').animate({height: 'toggle'}, 500,  'linear');
        /*on click, hide error*/ 
        $('.error').on("click", "p", function() {
            $('.error').animate({height: 'toggle'}, 500, 'linear');
        });
    }
};
alarmApp.getCountdown = () => {
    /*math inspired by https://codepen.io/rtm/pen/kkXWWk*/ 
    /*subtract current time from alarm time in milliseconds, divide by 1000 to get seconds, round down to get whole number*/ 
    let difference = Math.floor((alarmApp.alarm[9] - alarmApp.current[9]) / 1000);
    /*once difference becomes negative*/ 
    if (difference < '0') {
        /*stop countdown & associated displaying function*/ 
        clearInterval(alarmApp.countdownInterval);
        /*play alarm tone*/ 
        document.getElementById('alarmTone').play(); 
    } else {
        /*divide seconds by number of seconds in time period, round down to get while number, subtract from countdown total*/
        const days =  Math.floor(difference / 86400);
        difference -= days * 86400;
        const hours = Math.floor(difference / 3600) % 24;
        difference -= hours * 3600;
        const min = Math.floor(difference / 60) % 60;
        difference -= min * 60;
        const sec = difference % 60;
        /*create array for looping*/ 
        alarmApp.countdown = [
            'countdown',
            days,
            hours,
            min,
            sec
        ]
        /*format and display time*/ 
        alarmApp.formatTime(alarmApp.countdown);
    }
};
alarmApp.init = () => {
    /*get current time on pageload*/
    alarmApp.getCurrentTime();
    /*set up form for alarm on pageload*/ 
    alarmApp.displayForm();
    /* rerun current time function ever second to update */
    setInterval(alarmApp.getCurrentTime, 1000);
    $('footer').on("click", function() {
        // hide footer
        $(this).animate({height: 'toggle'}, 1000,  "linear");
        // animation delayed so footer is hidden
        $('#date__alarm').delay(1000).animate({height: 'toggle'}, 1500,  "linear");
        // display form
        alarmApp.buttonActions($(this));
    });
    /*prevent default of all buttons on click*/
    $('body').on("click", "button", function(e) {
        e.preventDefault();
        /*pass clicked button to sorting function for class-specific action*/ 
        alarmApp.buttonActions($(this));
    });
};
$(function() {
    alarmApp.init();
});