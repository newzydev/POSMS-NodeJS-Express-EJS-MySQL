exports.getManageProductCategoriesMainPage = (req, res) => {
    const title = 'Manage Product Categories Main | Point Of Sale Management System';
    const your_page = 'Manage_Product_Categories';
    const error = req.flash('error');
    const success = req.flash('success');
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const countQuery = `
        SELECT COUNT(*) as total
        FROM Categories_Main
        WHERE 
            cat_main_id LIKE ? 
            OR cat_main_name LIKE ?
    `;

    const dataQuery = `
        SELECT 
            cat_main_id, 
            cat_main_name
        FROM 
            Categories_Main 
        WHERE
            cat_main_id LIKE ?
            OR cat_main_name LIKE ?
        ORDER BY 
            time_order DESC
        LIMIT ? OFFSET ?
    `;

    const searchQuery = `%${search}%`;

    db.query(countQuery, [searchQuery, searchQuery], (err, countResult) => {
        if (err) {
            console.error('Error executing data query:', err);
            res.redirect('/');
            return;
        } else {
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            db.query(dataQuery, [searchQuery, searchQuery, limit, offset], (err, result) => {
                if (err) {
                    res.redirect('/');
                } else {
                    res.render('Role/Cashier/Manage_Product_Categories_Main', {
                        title, 
                        your_page,
                        error: error[0], 
                        success: success[0],
                        product_cats_main: result,
                        currentPage: page,
                        totalRecords,
                        totalPages,
                        search
                    });
                }
            });
        }
    });
};