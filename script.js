const alarmApp = {};
/*arrays of string values for month and date*/
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
    /*use newly formatted time for display*/
    alarmApp.displayTime(mappedArray);
};
/*creates and adds html element with proper grammatical formatting of date*/
alarmApp.displayTime = (timeArray) => {
    /*allows function to be reused in display of both current and alarm times*/
    let fontSize = " ";
    if (timeArray[0] == 'current') {
        fontSize = `<h1>`;
    } else {
        fontSize = `<h2>`;
    };
    const dateString = `${timeArray[5]}, ${timeArray[3]} ${timeArray[4]}, ${timeArray[1]}`;
    const dateContent = $(`${fontSize}`).html(dateString);
    const dateElement = $('<time>').addClass(`date__container`).append(dateContent);
    const timeString = `${timeArray[6]}:${timeArray[7]}:${timeArray[8]}`;
    const timeContent = $(`${fontSize}`).html(timeString);
    const timeElement = $('<time>').addClass(`time__container`).append(timeContent);
    $(`#date__${timeArray[0]}`).empty().append(dateElement, timeElement);
};
/*determines button class and calls associated function*/
alarmApp.buttonActions = (element) => {
    if (element.hasClass('set')) {
        /*gets alarm time from user-completed form*/ 
        alarmApp.getAlarmTime();
    } else if (element.hasClass('close')) {
        console.log("close");
        $('footer').animate({height: 'toggle'}, 1000,  "linear");
        $('#date__alarm').animate({height: 'toggle'}, 1000,  "linear");
        $('#date__current').toggleClass('together apart');
    } else if (element.hasClass('reset')) {
        console.log("reset");
    }
};
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
    console.log(alarmApp.alarm[9]);
    console.log(alarmApp.current[9]);
    if (alarmApp.alarm[9] > alarmApp.current[9]) {
        /*format time for display*/
        alarmApp.formatTime(alarmApp.alarm);
        // alarmApp.alarmCountDown(alarmApp.alarm[9])
        console.log("hello");
    } else {
        // error message
    }
};

alarmApp.init = () => {
    /*runs function immediately on load, and then on one second intervals, as setInterval will cause one second delay*/
    alarmApp.getCurrentTime();
    setInterval(alarmApp.getCurrentTime, 1000);
    $('footer').on("click", function() {
        $(this).animate({height: 'toggle'}, 1000,  "linear");
        $('#date__alarm').animate({height: 'toggle'}, 1000, 'linear');
        $('#date__current').toggleClass('together apart');
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