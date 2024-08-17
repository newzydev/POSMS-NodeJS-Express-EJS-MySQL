exports.getDeleteEmployeePage = (req, res) => {
    const member_id = req.params.member_id;
    const query = 'DELETE FROM Users WHERE member_id = ?';
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users');
        } else {
            req.flash('success', 'ลบข้อมูลบัญชีพนักงานสำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users');
        }
    });
};