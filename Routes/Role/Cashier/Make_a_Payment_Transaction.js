exports.getMakeaPaymentTransactionPage = (req, res) => {
    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
};

const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const fs = require('fs');

exports.getMakeaPaymentTransactionOrder = (req, res) => {
    const title = 'Make a Payment Transaction | Point Of Sale Management System';
    const your_page = 'Make_a_Payment_Transaction';
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
            req.flash('error', 'เกิดข้อผิดพลาดในการดึงรายการสินค้า');
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        db.query(dataQuery, [order_id], (err2, OrderPaymentResult) => {
            if (err2) {
                console.error('Error fetching payment details:', err2);
                req.flash('error', 'เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน');
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            }

            if (OrderPaymentResult.length === 0) {
                console.log('No order payment results found');
                req.flash('error', 'ไม่พบผลลัพธ์การชำระเงินของคำสั่งซื้อ');
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            }

            // Extract data for QR code
            const orderPayment = OrderPaymentResult[0];
            const mobileNumber = orderPayment.pay_bank_number;
            const amount = orderPayment.net_total;

            // Generate QR code payload
            const payload = generatePayload(mobileNumber, { amount });
            // console.log('Generated payload:', payload);

            // Convert to SVG QR Code
            const options = { type: 'svg', color: { dark: '#333333', light: '#ffffff' } };
            qrcode.toString(payload, options, (err, svg) => {
                if (err) {
                    console.error('Error generating QR code:', err);
                    req.flash('error', 'เกิดข้อผิดพลาดในการสร้าง QR code');
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                }
                fs.writeFileSync('./public/qr-prompt-pay-gen/qr-prompt-pay-gen.svg', svg);
                // console.log('QR code saved');
                req.flash('success', 'สร้าง QR code สำเร็จ');

                res.render('Role/Cashier/Make_a_Payment_Transaction', { 
                    title, 
                    your_page,
                    error: error[0],
                    success: success[0],
                    OrderProductLists: OrderProductListResult,
                    OrderPayment: OrderPaymentResult
                });
            });
        });
    });
};

exports.postMakeaPaymentTransactionOrder = (req, res) => {
    const order_id = req.params.order_id;
    const { net_money_mush, get_money } = req.body;
    const change_money = get_money - net_money_mush;

    // Set Date and Time Order
    const now = new Date();
    const options_date = {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    const options_time = {
        timeZone: 'Asia/Bangkok',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedDate = now.toLocaleDateString('th-TH', options_date);
    const formattedTime = now.toLocaleTimeString('th-TH', options_time);
    const order_time_payment = formattedDate + ' ' + formattedTime;

    const query = 'UPDATE Orders SET get_money = ?, change_money = ?, order_time_payment = ? WHERE order_id = ?';
    
    db.query(query, [get_money, change_money, order_time_payment, order_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการอัปเดตคำสั่งซื้อ');
            res.redirect('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/' + order_id);
        } else {
            req.flash('success', 'ทำรายการชำระเงินสำเร็จ');
            res.redirect('/Role/Cashier/Page/Electronic_Reciept/Order/' + order_id);
        }
    });
};