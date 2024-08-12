exports.getViewOrderRecieptPage = (req, res) => {
    const title = 'Order Reciept | Point Of Sale Management System';
    const your_page = 'Sale_Reports';
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
            Orders.order_time_payment
        FROM 
            Orders
        INNER JOIN 
            Payment_Options ON Orders.pay_id = Payment_Options.pay_id
        WHERE
            Orders.order_id = ?
    `;

    const dataQueryProductList = `
        SELECT 
            order_id, 
            product_name, 
            cart_product_qty, 
            product_price
        FROM 
            Order_Product_Lists
        WHERE
            order_id = ?
    `;

    db.query(dataQueryProductList, [order_id], (err1, OrderProductListResult) => {
        if (err1) {
            console.error('Error fetching product list:', err1);
            return res.redirect('/Role/Shop_Owner/Page/Sale_Reports');
        }

        db.query(dataQuery, [order_id], (err2, OrderReceiptResult) => {
            if (err2) {
                console.error('Error fetching payment details:', err2);
                return res.redirect('/Role/Shop_Owner/Page/Sale_Reports');
            }

            if (OrderReceiptResult.length === 0) {
                console.log('No order payment results found');
                return res.redirect('/Role/Shop_Owner/Page/Sale_Reports');
            }

            res.render('Role/Shop_Owner/View_Order_Receipt', { 
                title, 
                your_page,
                OrderProductLists: OrderProductListResult,
                OrderReceipt: OrderReceiptResult
            });
        });
    });
};