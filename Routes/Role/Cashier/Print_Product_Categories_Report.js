exports.getProductCategoriesPrintReportPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'PRINT PRODUCT CATEGORIES REPORT - ' + settings.text_footer;
    const your_page = 'Manage_Product_Categories';
    const error = req.flash('error');
    const success = req.flash('success');

    const dataQuery = `
        SELECT 
            cat_id, 
            cat_name_main,
            cat_name_sub
        FROM 
            Categories 
        ORDER BY 
            cat_name_main ASC,
            time_order DESC
    `;

    db.query(dataQuery, (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        } else {
            res.render('Role/Cashier/Print_Product_Categories_Report', {
                title, 
                your_page,
                error: error[0], 
                success: success[0],
                product_cats: result
            });
        }
    });
};