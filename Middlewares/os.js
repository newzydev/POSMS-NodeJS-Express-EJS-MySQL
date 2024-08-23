const os = require('os');

// ฟังก์ชันเพื่อดึง IP Address ของเครื่องเซิร์ฟเวอร์
function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (let name of Object.keys(interfaces)) {
        for (let net of interfaces[name]) {
            // ข้ามที่ไม่ใช่ IPv4 และที่เป็น internal (เช่น 127.0.0.1)
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'N/A';
}

// ฟังก์ชันเพื่อดึง IP Address ของผู้ใช้งานที่เข้าถึงเว็บไซต์
function getClientIp(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    // แปลง IPv6-mapped IPv4 เป็น IPv4 ปกติ เช่น จาก ::ffff:192.168.1.103 เป็น 192.168.1.103
    if (ip && ip.includes('::ffff:')) {
        ip = ip.split('::ffff:')[1];
    }

    // แปลง ::1 (IPv6 loopback) เป็น 127.0.0.1 (IPv4 loopback)
    if (ip === '::1') {
        ip = '127.0.0.1';
    }

    return ip ? ip : 'N/A';
}

// Middleware เพื่อดึงข้อมูลระบบ
module.exports = (req, res, next) => {
    res.locals.clientIp = getClientIp(req); // IP Address ของผู้ใช้งาน
    res.locals.ipAddress = getIPAddress(); // IP Address ของเครื่องเซิร์ฟเวอร์
    res.locals.hostname = os.hostname() || 'N/A'; // Hostname: ชื่อเครื่องของเซิร์ฟเวอร์
    res.locals.platform = os.platform() || 'N/A'; // Platform: แพลตฟอร์มของระบบปฏิบัติการ
    res.locals.architecture = os.arch() || 'N/A'; // Architecture: สถาปัตยกรรมของระบบปฏิบัติการ
    res.locals.release = os.release() || 'N/A'; // Release: เวอร์ชันของระบบปฏิบัติการ
    res.locals.type = os.type() || 'N/A'; // System Type: ชนิดของระบบปฏิบัติการ
    res.locals.version = os.version() || 'N/A'; // Version: ชื่อและเวอร์ชันของระบบปฏิบัติการ
    
    next(); // เรียกใช้งาน middleware ถัดไป
};
