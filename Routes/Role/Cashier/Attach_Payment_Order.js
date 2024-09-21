exports.getAttachPaymentOrderPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'ATTACH PAYMENT ORDER - ' + settings.text_footer;
    const your_page = 'Attach_Proof_of_Payment';
    const error = req.flash('error');
    const success = req.flash('success');
    const order_id = req.params.order_id;

    // SQL Queries
    const dataQuery = `
        SELECT 
            Orders.order_id, 
            Orders.cashier_id, 
            Orders.customer_id,
            Payment_Options.pay_id,
            Payment_Options.pay_cat_name,
            Payment_Options.pay_bank_name,
            Payment_Options.pay_bank_account_name,
            Payment_Options.pay_bank_number,
            Orders.total_unit, 
            Orders.total_amount, 
            Orders.member_discount, 
            Orders.net_total,
            Orders.get_money,
            Orders.change_money,
            Orders.order_time_transaction,
            Orders.order_time_payment,
            Orders.oapp_image
        FROM 
            Orders
        INNER JOIN 
            Payment_Options ON Orders.pay_id = Payment_Options.pay_id
        WHERE
            Orders.order_id = ?
    `;

    db.query(dataQuery, [order_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Attach_Proof_of_Payment');
        } else {
            res.render('Role/Cashier/Attach_Payment_Order', { 
                title, 
                your_page,
                error: error[0],
                success: success[0],
                order_attach: result[0]
            });
        }
    });
};