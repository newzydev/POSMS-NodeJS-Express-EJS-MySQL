exports.getSaleReportsPrintReportPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'SALE REPORT - ' + settings.text_footer;
    const your_page = 'Sale_Reports';
    const error = req.flash('error');
    const success = req.flash('success');

    const dataQuery = `
        SELECT 
            order_id, 
            cashier_id, 
            customer_id,
            total_unit, 
            total_amount, 
            member_discount, 
            net_total,
            get_money,
            change_money,
            order_time_transaction,
            order_time_payment,
            oapp_image,
            time_order
        FROM 
            Orders
        ORDER BY 
            time_order DESC
    `;

    db.query(dataQuery, (err, result) => {
        if (err) {
            res.redirect('Role/Shop_Owner/Sale_Reports');
        } else {
            res.render('Role/Shop_Owner/Print_Sale_Reports', {
                title, 
                your_page,
                error: error[0], 
                success: success[0],
                sale_reports: result
            });
        }
    });
};