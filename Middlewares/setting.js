// System Setting Middlewares
const System_Settings = (req, res, next) => {
    const query = 'SELECT * FROM System_Settings'; // Corrected the typo

    global.db.query(query, (err, results) => {
        if (err) {
            return next(err); // Pass the error to the next middleware
        }

        // Set settings in res.locals for global access
        res.locals.settings = results.length ? results[0] : {};
        next();
    });
};

module.exports = System_Settings;
