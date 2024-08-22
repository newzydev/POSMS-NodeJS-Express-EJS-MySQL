const System_Settings = (req, res, next) => {
    const query = 'SELECT * FROM Systen_Settings';

    db.query(query, (err, results) => {
        if (err) {
            return next(err); // Pass the error to the next middleware
        }

        // Store the settings in res.locals to make them available to all views
        res.locals.settings = results.length ? results[0] : {};

        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = System_Settings;