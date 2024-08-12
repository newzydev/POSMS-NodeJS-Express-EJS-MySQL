exports.getSaleReportsPage = (req, res) => {
    const title = 'Sale Reports | Point Of Sale Management System';
    const your_page = 'Sale_Reports';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const countQuery = `
        SELECT COUNT(*) as total
        FROM Orders
        INNER JOIN Payment_Options ON Orders.pay_id = Payment_Options.pay_id
        WHERE (Orders.order_id LIKE ?)
    `;

    const dataQuery = `
        SELECT 
            Orders.order_id, 
            Orders.cashier_id, 
            Orders.customer_id,
            Payment_Options.pay_id,
            Payment_Options.pay_cat_name,
            Payment_Options.pay_bank_name,
            Orders.total_unit, 
            Orders.total_amount, 
            Orders.member_discount, 
            Orders.net_total,
            Orders.get_money,
            Orders.change_money,
            Orders.order_time_transaction,
            Orders.order_time_payment,
            Orders.time_order
        FROM 
            Orders
        INNER JOIN 
            Payment_Options ON Orders.pay_id = Payment_Options.pay_id
        WHERE
            (Orders.order_id LIKE ?)
        ORDER BY 
            time_order DESC
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
                    console.log(err);
                    res.redirect('/');
                } else {
                    res.render('Role/Shop_Owner/Sale_Reports', {
                        title, 
                        your_page,
                        orders: result,
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