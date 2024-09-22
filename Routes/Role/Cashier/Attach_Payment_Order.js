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
            oapp_image
        FROM 
            Orders
        WHERE
            order_id = ?
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

const path = require('path');
const fs = require('fs');

exports.postAttachPaymentOrder = (req, res) => {
    const order_id = req.params.order_id;

    // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดมาหรือไม่
    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash('error', 'กรุณาเลือกรูปภาพ');
        return res.redirect('/Role/Cashier/Page/Attach_Proof_of_Payment/Attach/' + order_id);
    }

    // ดึงข้อมูลไฟล์จาก req.files
    const file = req.files.oapp_image;
    const fileExtension = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    // ตรวจสอบนามสกุลไฟล์
    if (!allowedExtensions.includes(fileExtension)) {
        req.flash('error', 'นามสกุลไฟล์ต้องเป็น .png, .jpg, .jpeg, หรือ .gif');
        return res.redirect('/Role/Cashier/Page/Attach_Proof_of_Payment/Attach/' + order_id);
    }

    // ตั้งชื่อไฟล์ให้ตรงกับ order_id
    const fileName = `${order_id}${fileExtension}`;
    const uploadPath = path.join(__dirname, '../../../Public/assets/images/attach', fileName);

    // ย้ายไฟล์ไปยังโฟลเดอร์ที่กำหนด
    file.mv(uploadPath, (err) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
            return res.redirect('/Role/Cashier/Page/Attach_Proof_of_Payment/Attach/' + order_id);
        }

        // อัปเดตฐานข้อมูล
        const updateQuery = `
            UPDATE Orders
            SET oapp_image = ?
            WHERE order_id = ?
        `;

        db.query(updateQuery, [fileName, order_id], (err, result) => {
            if (err) {
                req.flash('error', 'เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล');
                return res.redirect('/Role/Cashier/Page/Attach_Proof_of_Payment/Attach/' + order_id);
            }

            req.flash('success', 'อัปโหลดไฟล์และอัปเดตข้อมูลสำเร็จ');
            res.redirect('/Role/Cashier/Page/Attach_Proof_of_Payment');
        });
    });
};
