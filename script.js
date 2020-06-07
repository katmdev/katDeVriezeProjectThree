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
    /*should this be out here or should it be global, we will find out!!*/
    const fullDate = new Date();
    /*create object for current time-frame to facilitate looping in formatTime()*/
    alarmApp.current = {
        time: 'current',
        year: fullDate.getFullYear(),
        month: alarmApp.months[fullDate.getMonth()],
        day: fullDate.getDate(),
        weekday: alarmApp.weekDays[fullDate.getDay()],
        hour: fullDate.getHours(),
        minute: fullDate.getMinutes(),
        second: fullDate.getSeconds(),
        millisecond: fullDate.getTime(),
    };
    /*format time for display*/
    alarmApp.formatTime(alarmApp.current);
};
/*Replace single digit numbers with double digit by concatenating into string */
alarmApp.formatTime = (time) => {
    for (let value in time) {
        if (typeof time[value] === 'number' && time[value] < 10)
        time[value] = "0" + time[value];
    };
    /*use newly formatted time for display*/
    alarmApp.displayTime(time);
};
/*creates and adds html element with proper grammatical formatting of date*/
alarmApp.displayTime = (timeObject) => {
    /*allows function to be reused in display of both current and alarm times*/
    let fontSize = " ";
    if (timeObject.time == 'current') {
        fontSize = `<h1>`;
    } else {
        fontSize = `<h2>`;
    };
    const dateString = `${timeObject.weekday}, ${timeObject.month} ${timeObject.day}, ${timeObject.year}`;
    const dateContent = $(`${fontSize}`).html(dateString);
    const dateElement = $('<time>').addClass(`date__container`).append(dateContent);
    const timeString = `${timeObject.hour}:${timeObject.minute}:${timeObject.second}`;
    const timeContent = $(`${fontSize}`).html(timeString);
    const timeElement = $('<time>').addClass(`time__container`).append(timeContent);
    $(`#date__${timeObject.time}`).empty().append(dateElement, timeElement);
};
/*determines button class and calls associated function*/
alarmApp.buttonActions = (element) => {
    if (element.hasClass('set')) {
        /*gets alarm time from user-completed form*/ 
        alarmApp.getAlarmTime();
    } else if (element.hasClass('close')) {
        console.log("close");
    } else if (element.hasClass('reset')) {
        console.log("reset");
    }
};
alarmApp.getAlarmTime = () => {
    /*create object for alarm time-frame to facilitate looping in formatTime()*/
    alarmApp.alarm = {
        time: 'alarm',
        year: parseInt($('input[name=year]').val()),
        /*months range from 0-11 in JavaScript*/
        month: parseInt($('input[name=month]').val()) - 1,
        day: parseInt($('input[name=day]').val()),
        hour: parseInt($('input[name=hour]').val()),
        minute: parseInt($('input[name=minute]').val()),
    }
    const alarmTime = new Date(alarmApp.alarm.year, alarmApp.alarm.month, alarmApp.alarm.day, alarmApp.alarm.hour, alarmApp.alarm.minute);
    alarmApp.alarm.milliseconds = alarmTime.getTime();
    console.log(alarmApp.alarm);
    console.log(alarmTime);
    setInterval(alarmApp.alarmCountDown, 1000);
};
alarmApp.alarmCountDown = () => {
    
};

alarmApp.init = () => {
    /*runs function immediately on load, and then on one second intervals, as setInterval will cause one second delay*/
    alarmApp.getCurrentTime();
    setInterval(alarmApp.getCurrentTime, 1000);
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