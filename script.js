const alarmApp = {};

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

alarmApp.getCurrentTime = () => {
    const fullDate = new Date();
    alarmApp.current = {
        time: 'current',
        year: fullDate.getFullYear(),
        month: alarmApp.months[fullDate.getMonth()],
        day: fullDate.getDate(),
        weekday: alarmApp.weekDays[fullDate.getDay()],
        hour: fullDate.getHours(),
        minute: fullDate.getMinutes(),
        second: fullDate.getSeconds()
    };
    alarmApp.formatTime(alarmApp.current);
    alarmApp.displayTime(alarmApp.current);
};
alarmApp.formatTime = (time) => {
    for (let value in time) {
        if (typeof time[value] === 'number' && time[value] < 10)
        time[value] = "0" + time[value];
    };
};
alarmApp.displayTime = (timeObject) => {
    let fontSize = " ";
    if (timeObject.time == "current") {
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
alarmApp.buttonActions = (element) => {
    if (element.hasClass('set')) {
        alarmApp.getAlarmTime();
    } else if (element.hasClass('close')) {
        console.log("close");
    } else if (element.hasClass('reset')) {
        console.log("reset");
    }
};
alarmApp.getAlarmTime = () => {
    alarmApp.alarm = {
        time: 'alarm',
        year: $('input[name=year]').val(),
        month: $('input[name=month]').val(),
        day: $('input[name=day]').val(),
        hour: $('input[name=hour]').val(),
        minute: $('input[name=minute]').val(),
    }
    setInterval(alarmApp.alarmCountDown, 1000);
};
alarmApp.alarmCountDown = () => {
    
};

alarmApp.init = () => {
    alarmApp.getCurrentTime();
    setInterval(alarmApp.getCurrentTime, 1000);
    $('.alarm').on("click", "button", function(e) {
        e.preventDefault();
        alarmApp.buttonActions($(this));
    });
};

$(function() {
    alarmApp.init();
});