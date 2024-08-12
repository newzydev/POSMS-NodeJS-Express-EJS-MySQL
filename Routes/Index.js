exports.getHomePage = (req, res) => {
    const title = 'Point Of Sale Management System';
    res.render('Index', { title });
};