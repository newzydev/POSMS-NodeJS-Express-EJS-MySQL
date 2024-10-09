function showToast(clickmessage) {
    // สร้างโครงสร้าง HTML ของ Toasts โดยใช้ JavaScript
    var toastHTML = `
        <div class="toast" id="myToast" style="width: 100%; background-color: #ffffff; color: #333333; position: fixed; bottom: 20px; right: 20px; z-index: 999999;" data-delay="8000">
            <div class="toast-header">
                <strong class="mr-auto">การแจ้งเตือน</strong>
                <small>ตอนนี้</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                <div>${clickmessage}</div>
            </div>
        </div>
    `;

    // ตรวจสอบว่ามี Toast อยู่แล้วหรือไม่ ถ้ามีให้ลบทิ้งก่อน เพื่อไม่ให้ซ้อนกัน
    var existingToast = document.getElementById('myToast');
    if (existingToast) {
        existingToast.remove();
    }

    // แทรก Toast เข้าสู่ body ของเอกสาร
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // ใช้ Bootstrap Toast API เพื่อแสดง Toast
    var toastElement = document.getElementById('myToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function showToast(message) {
    // สร้างโครงสร้าง HTML ของ Toasts โดยใช้ JavaScript
    var toastHTML = `
        <div class="toast" id="myToast" style="width: 100%; background-color: #ffffff; color: #333333; position: fixed; bottom: 20px; right: 20px; z-index: 999999;" data-delay="8000">
            <div class="toast-header">
                <strong class="mr-auto">การแจ้งเตือน</strong>
                <small>ตอนนี้</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                <div>${message}</div>
            </div>
        </div>
    `;

    // ตรวจสอบว่ามี Toast อยู่แล้วหรือไม่ ถ้ามีให้ลบทิ้งก่อน เพื่อไม่ให้ซ้อนกัน
    var existingToast = document.getElementById('myToast');
    if (existingToast) {
        existingToast.remove();
    }

    // แทรก Toast เข้าสู่ body ของเอกสาร
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // ใช้ Bootstrap Toast API เพื่อแสดง Toast
    var toastElement = document.getElementById('myToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function showToast(message1) {
    // สร้างโครงสร้าง HTML ของ Toasts โดยใช้ JavaScript
    var toastHTML = `
        <div class="toast" id="myToast" style="width: 100%; background-color: #ffffff; color: #333333; position: fixed; bottom: 20px; right: 20px; z-index: 999999;" data-delay="8000">
            <div class="toast-header">
                <strong class="mr-auto">การแจ้งเตือน</strong>
                <small>ตอนนี้</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                <div>${message1}</div>
            </div>
        </div>
    `;

    // ตรวจสอบว่ามี Toast อยู่แล้วหรือไม่ ถ้ามีให้ลบทิ้งก่อน เพื่อไม่ให้ซ้อนกัน
    var existingToast = document.getElementById('myToast');
    if (existingToast) {
        existingToast.remove();
    }

    // แทรก Toast เข้าสู่ body ของเอกสาร
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // ใช้ Bootstrap Toast API เพื่อแสดง Toast
    var toastElement = document.getElementById('myToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function showToast(message2) {
    // สร้างโครงสร้าง HTML ของ Toasts โดยใช้ JavaScript
    var toastHTML = `
        <div class="toast" id="myToast" style="width: 100%; background-color: #ffffff; color: #333333; position: fixed; bottom: 20px; right: 20px; z-index: 999999;" data-delay="8000">
            <div class="toast-header">
                <strong class="mr-auto">การแจ้งเตือน</strong>
                <small>ตอนนี้</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                <div>${message2}</div>
            </div>
        </div>
    `;

    // ตรวจสอบว่ามี Toast อยู่แล้วหรือไม่ ถ้ามีให้ลบทิ้งก่อน เพื่อไม่ให้ซ้อนกัน
    var existingToast = document.getElementById('myToast');
    if (existingToast) {
        existingToast.remove();
    }

    // แทรก Toast เข้าสู่ body ของเอกสาร
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // ใช้ Bootstrap Toast API เพื่อแสดง Toast
    var toastElement = document.getElementById('myToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function showToast(message3) {
    // สร้างโครงสร้าง HTML ของ Toasts โดยใช้ JavaScript
    var toastHTML = `
        <div class="toast" id="myToast" style="width: 100%; background-color: #ffffff; color: #333333; position: fixed; bottom: 20px; right: 20px; z-index: 999999;" data-delay="8000">
            <div class="toast-header">
                <strong class="mr-auto">การแจ้งเตือน</strong>
                <small>ตอนนี้</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                <div>${message3}</div>
            </div>
        </div>
    `;

    // ตรวจสอบว่ามี Toast อยู่แล้วหรือไม่ ถ้ามีให้ลบทิ้งก่อน เพื่อไม่ให้ซ้อนกัน
    var existingToast = document.getElementById('myToast');
    if (existingToast) {
        existingToast.remove();
    }

    // แทรก Toast เข้าสู่ body ของเอกสาร
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // ใช้ Bootstrap Toast API เพื่อแสดง Toast
    var toastElement = document.getElementById('myToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function showToast(message4) {
    // สร้างโครงสร้าง HTML ของ Toasts โดยใช้ JavaScript
    var toastHTML = `
        <div class="toast" id="myToast" style="width: 100%; background-color: #ffffff; color: #333333; position: fixed; bottom: 20px; right: 20px; z-index: 999999;" data-delay="8000">
            <div class="toast-header">
                <strong class="mr-auto">การแจ้งเตือน</strong>
                <small>ตอนนี้</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                <div>${message4}</div>
            </div>
        </div>
    `;

    // ตรวจสอบว่ามี Toast อยู่แล้วหรือไม่ ถ้ามีให้ลบทิ้งก่อน เพื่อไม่ให้ซ้อนกัน
    var existingToast = document.getElementById('myToast');
    if (existingToast) {
        existingToast.remove();
    }

    // แทรก Toast เข้าสู่ body ของเอกสาร
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // ใช้ Bootstrap Toast API เพื่อแสดง Toast
    var toastElement = document.getElementById('myToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function showToast(message5) {
    // สร้างโครงสร้าง HTML ของ Toasts โดยใช้ JavaScript
    var toastHTML = `
        <div class="toast" id="myToast" style="width: 100%; background-color: #ffffff; color: #333333; position: fixed; bottom: 20px; right: 20px; z-index: 999999;" data-delay="8000">
            <div class="toast-header">
                <strong class="mr-auto">การแจ้งเตือน</strong>
                <small>ตอนนี้</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                <div>${message5}</div>
            </div>
        </div>
    `;

    // ตรวจสอบว่ามี Toast อยู่แล้วหรือไม่ ถ้ามีให้ลบทิ้งก่อน เพื่อไม่ให้ซ้อนกัน
    var existingToast = document.getElementById('myToast');
    if (existingToast) {
        existingToast.remove();
    }

    // แทรก Toast เข้าสู่ body ของเอกสาร
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    // ใช้ Bootstrap Toast API เพื่อแสดง Toast
    var toastElement = document.getElementById('myToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
}


var clickmessage = "ระบบไม่อนุญาตให้บันทึกภาพค่ะ :)";

function disableclick(e) {
    if (document.all) {
        if (event.button == 2 || event.button == 3) {
            if (event.srcElement.tagName == "IMG") {
                showToast(clickmessage);
                return false;
            }
        }
    } else if (document.layers) {
        if (e.which == 3) {
            showToast(clickmessage);
            return false;
        }
    } else if (document.getElementById) {
        if (e.which == 3 && e.target.tagName == "IMG") {
            showToast(clickmessage);
            return false;
        }
    }
}

function associateimages() {
    for (i = 0; i < document.images.length; i++)
        document.images[i].onmousedown = disableclick;
}

if (document.all) document.onmousedown = disableclick;
else if (document.getElementById) document.onmouseup = disableclick;
else if (document.layers) associateimages();

// ----------------------------------

var message = "ระบบไม่อนุญาตให้คลิกขวาค่ะ :)";

function disableRightClick(e) {
    // ตรวจสอบว่าเป็นการคลิกขวาหรือไม่
    if (e.button == 2 || e.which == 3) {
        showToast(message);  // เรียกใช้ฟังก์ชันแสดง Toast
        return false;  // ป้องกันการแสดงเมนูคลิกขวา
    }
}

// ป้องกันการแสดงเมนูคลิกขวาและแสดง Toast เมื่อมีการคลิกขวา
document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // ป้องกันการแสดงเมนูคลิกขวา
    showToast(message);
}, false);

// ตรวจสอบการคลิกขวาและแสดง Toast ในเบราว์เซอร์ที่ไม่รองรับ contextmenu
document.addEventListener('mousedown', function (e) {
    disableRightClick(e);
}, false);


// ทริกเกอร์คีย์
document.onkeydown = function () {
    // ห้ามกด Ctrl + U
    var message1 = "ระบบไม่อนุญาตให้กดปุ่ม Ctrl + U ค่ะ :)";
    if (event.ctrlKey && window.event.keyCode == 85) {
        showToast(message1);
        return false;
    }
    // ห้ามกด F12
    var message2 = "ระบบไม่อนุญาตให้กดปุ่ม F12 ค่ะ :)";
    if (window.event && window.event.keyCode == 123) {
        showToast(message2);
        event.keyCode = 0;
        event.returnValue = false;
    }
    // ห้ามกด Ctrl + S
    var message3 = "ระบบไม่อนุญาตให้กดปุ่ม Ctrl + S ค่ะ :)";
    if (event.ctrlKey && window.event.keyCode == 83) {
        showToast(message3);
        return false;
    }
    // ห้ามกด F5
    var message4 = "ระบบไม่อนุญาตให้กดปุ่ม F5 ค่ะ :)";
    if (window.event && window.event.keyCode == 116) {
        showToast(message4);
        event.keyCode = 0;
        event.returnValue = false;
    }
};

// ฟังก์ชันสำหรับตรวจสอบข้อมูลที่ input
function validateInput(input) {
    var message5 = "ระบบปฏิเสธเครื่องหมายพิเศษที่อาจจะใช้ในการทำ SQL Injection ค่ะ :)";
    // ปฏิเสธเครื่องหมายพิเศษที่อาจจะใช้ในการทำ SQL Injection
    const regex = /['"\\;]/g;

    if (regex.test(input)) {
        showToast(message5);
        return false;
    }
    return true;
}