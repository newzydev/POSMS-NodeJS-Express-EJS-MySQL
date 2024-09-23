// Date and Time
$(document).ready(function () {
    const now = new Date();
    const currentHour = now.getHours();
    let greeting;
    if (currentHour < 12) {
        greeting = 'สวัสดียามเช้า';
    } else {
        greeting = 'สวัสดียามเย็น';
    }

    $("#greeting").text(greeting);
});

$(document).ready(function () {
    const now = new Date();
    const copyright_year_option = {
        timeZone: 'Asia/Bangkok',
        year: 'numeric'
    };
    const formattedCopyright = now.toLocaleDateString('en-EN', copyright_year_option);
    // const formattedCopyrightTH = parseInt(formattedCopyright) + 543;

    $("[id^=copyright-year]").each(function () {
        $(this).text(formattedCopyright);
    });
});

$(document).ready(function () {
    const now = new Date();
    const options_date = {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    const options_time = {
        timeZone: 'Asia/Bangkok',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedDate = now.toLocaleDateString('th-TH', options_date);
    const formattedTime = now.toLocaleTimeString('th-TH', options_time);

    $("[id^=date-info]").each(function () {
        $(this).text(formattedDate + ' ' + formattedTime);
    });
});

$(document).ready(function () {
    const now = new Date();
    const options_date = {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
    };
    const formattedDate = now.toLocaleDateString('th-TH', options_date);

    $("[id^=date-today]").each(function () {
        $(this).text(formattedDate);
    });
});
// Date and Time End

// Copy data info
function copyDataInfo(dataInfo) {
    // Create a temporary textarea element
    var tempInput = document.createElement("input");
    // Set its value to the dataInfo
    tempInput.value = dataInfo;
    // Append the textarea to the body
    document.body.appendChild(tempInput);
    // Select the text
    tempInput.select();
    // Copy the text to the clipboard
    document.execCommand("copy");
    // Remove the textarea
    document.body.removeChild(tempInput);
    // Update the modal content with the copied data
    document.getElementById("copiedData").innerText = "ข้อมูล : " + dataInfo;
    // Show the modal after copying the data
    $('#copyModal').modal('show');
}
// Copy data info End

// Ripple Effect
document.querySelectorAll('.btn, .nav-link').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
// Ripple Effect