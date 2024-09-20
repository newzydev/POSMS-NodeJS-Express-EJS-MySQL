// System Setting Middlewares
const System_Settings = (req, res, next) => {
    const query = 'SELECT * FROM Systen_Settings';

    db.query(query, (err, results) => {
        if (err) {
            return next(err); // Pass the error to the next middleware
        }

        // ตั้งค่าเป็น res.locals เพื่อให้เรียกใช้ได้กับทุกหน้าและทุกใฟล์
        res.locals.settings = results.length ? results[0] : {};

        next();
    });
};

module.exports = System_Settings;