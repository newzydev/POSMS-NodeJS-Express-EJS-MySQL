exports.getManageProductsPage = (req, res) => {
    const title = 'Manage Products | Point Of Sale Management System';
    const your_page = 'Manage_Products';
    const error = req.flash('error');
    const success = req.flash('success');
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM Products
        INNER JOIN Categories ON Products.cat_id = Categories.cat_id
        WHERE 
            Products.product_id LIKE ? 
            OR Products.product_name LIKE ? 
            OR Categories.cat_name_main LIKE ? 
            OR Categories.cat_name_sub LIKE ?;
    `;

    const dataQuery = `
        SELECT 
            Products.product_id, 
            Products.product_name, 
            Products.product_price,
            Products.product_unit_number,
            Categories.cat_id, 
            Categories.cat_name_main, 
            Categories.cat_name_sub 
        FROM 
            Products 
        INNER JOIN 
            Categories 
        ON 
            Products.cat_id = Categories.cat_id 
        WHERE
            Products.product_id LIKE ? 
            OR Products.product_name LIKE ? 
            OR Categories.cat_name_main LIKE ? 
            OR Categories.cat_name_sub LIKE ?
        ORDER BY 
            Categories.cat_name_main ASC, 
            Products.time_order DESC
        LIMIT ? OFFSET ?;
    `;

    const searchQuery = `%${search}%`;

    db.query(countQuery, [searchQuery, searchQuery, searchQuery, searchQuery], (err, countResult) => {
        if (err) {
            console.error('Count Query Error:', err);
            res.redirect('/');
        } else {
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            db.query(dataQuery, [searchQuery, searchQuery, searchQuery, searchQuery, limit, offset], (err, result) => {
                if (err) {
                    console.error('Data Query Error:', err);
                    res.redirect('/');
                } else {
                    res.render('Role/Cashier/Manage_Products', {
                        title, 
                        your_page,
                        error: error[0], 
                        success: success[0],
                        products: result,
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