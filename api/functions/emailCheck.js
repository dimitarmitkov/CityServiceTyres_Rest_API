function emailCheck(newCustomer, connection) {
    return new Promise((resolve, reject) => {
        let sql = 'select email from users where email= ?';

        connection.query(sql, [`${newCustomer.email}`],
            (err, data) => {
                if (err) {
                    console.log("error", err);
                    return err;
                } else {
                    console.log("data", data);
                    return data;
                }
            });
    })
}