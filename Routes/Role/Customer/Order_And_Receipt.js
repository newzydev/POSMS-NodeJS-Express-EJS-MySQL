exports.getOrderAndRecieptPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'ORDER AND RECEIPT - ' + settings.text_footer;
    const your_page = 'Order_And_Receipt';
    const error = req.flash('error');
    const success = req.flash('success');
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const user = res.locals.user;

    if (!user || !user.member_id) {
        console.error('User not authenticated or user ID not found');
        return res.redirect('/Login');
    }

    const customerId = user.member_id;

    const countQuery = `
        SELECT COUNT(*) as total
        FROM Orders
        INNER JOIN Payment_Options ON Orders.pay_id = Payment_Options.pay_id
        WHERE Orders.customer_id = ? AND Orders.order_id LIKE ?
    `;

    const dataQuery = `
        SELECT 
            Orders.order_id,
            Orders.net_total,
            Orders.order_time_transaction,
            Orders.order_time_payment,
            Orders.time_order
        FROM 
            Orders
        INNER JOIN 
            Payment_Options ON Orders.pay_id = Payment_Options.pay_id
        WHERE
            Orders.customer_id = ? AND Orders.order_id LIKE ?
        ORDER BY 
            time_order DESC
        LIMIT ${limit} OFFSET ${offset}
    `;

    const searchQuery = `%${search}%`;

    db.query(countQuery, [customerId, searchQuery], (err, countResult) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        } 

        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        db.query(dataQuery, [customerId, searchQuery], (err, result) => {
            if (err) {
                console.error(err);
                return res.redirect('/');
            } 

            res.render('Role/Customer/Order_And_Receipt', {
                title, 
                your_page,
                error: error[0],
                success: success[0],
                orders: result,
                currentPage: page,
                totalRecords,
                totalPages,
                search
            });
        });
    });
};
