exports.getManageProductsPage = (req, res) => {
    const title = 'Manage Products | Point Of Sale Management System';
    const your_page = 'Manage_Products';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const countQuery = `
        SELECT COUNT(*) as total
        FROM Products
        INNER JOIN Categories ON Products.cat_id = Categories.cat_id
        WHERE (Categories.cat_name_main LIKE ? OR Categories.cat_name_sub LIKE ? OR Products.product_name LIKE ?)
    `;

    const dataQuery = `
        SELECT 
            Products.product_id, 
            Products.product_name, 
            Products.product_price,
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
            (Categories.cat_name_main LIKE ? OR Categories.cat_name_sub LIKE ? OR Products.product_name LIKE ?)
        ORDER BY 
            Categories.cat_name_main ASC, Products.time_order DESC
        LIMIT ? OFFSET ?
    `;

    const searchQuery = `%${search}%`;

    function numberFormat(number, decimals) {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    db.query(countQuery, [searchQuery, searchQuery, searchQuery], (err, countResult) => {
        if (err) {
            res.redirect('/');
        } else {
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            db.query(dataQuery, [searchQuery, searchQuery, searchQuery, limit, offset], (err, result) => {
                if (err) {
                    res.redirect('/');
                } else {
                    res.render('Role/Cashier/Manage_Products', {
                        title, 
                        your_page,
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