exports.getManagePaymentMethodsPage = (req, res) => {
    const title = 'Manage Payment Methods | Point Of Sale Management System';
    const your_page = 'Manage_Payment_Methods';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const countQuery = `
        SELECT COUNT(*) as total
        FROM Payment_Options
        WHERE (pay_bank_name LIKE ? OR pay_bank_account_name LIKE ?)
    `;

    const dataQuery = `
        SELECT 
            pay_id, 
            pay_cat_name, 
            pay_bank_name, 
            pay_bank_account_name, 
            pay_bank_number, 
            pay_status
        FROM 
            Payment_Options 
        WHERE
            (pay_bank_name LIKE ? OR pay_bank_account_name LIKE ?)
        ORDER BY 
            pay_cat_name ASC, time_order DESC
        LIMIT ${limit} OFFSET ${offset}
    `;

    const searchQuery = `%${search}%`;

    db.query(countQuery, [searchQuery, searchQuery], (err, countResult) => {
        if (err) {
            res.redirect('/');
        } else {
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            db.query(dataQuery, [searchQuery, searchQuery], (err, result) => {
                if (err) {
                    res.redirect('/');
                } else {
                    res.render('Role/Shop_Owner/Manage_Payment_Methods', {
                        title, 
                        your_page,
                        pay_methods: result,
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