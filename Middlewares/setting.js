// System Setting Middlewares
const System_Settings = (req, res, next) => {
    const settings = res.locals.settings;
    const query = 'SELECT * FROM Systen_Settings';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).render('Error_Page/500', { title: 'INTERNAL SERVER ERROR - ' + settings.text_footer });
        }

        // ตั้งค่าเป็น res.locals เพื่อให้เรียกใช้ได้กับทุกหน้าและทุกใฟล์
        res.locals.settings = results.length ? results[0] : {};
        next();
    });
};

module.exports = System_Settings;