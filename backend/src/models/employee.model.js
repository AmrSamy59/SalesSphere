
class EmployeeModel {
    constructor({id, email, hashed_password, first_name, last_name, phone_number, address, birth_date, role, business_id}) {
        this.id = id;
        this.email = email;
        this.hashed_password = hashed_password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.address = address;
        this.birth_date = birth_date;
        this.role = role;
        this.business_id = business_id;
    }
    async getAll(pool) {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                ORDER BY e.id;
            `);

            const results = result.rows.map(row => {
                // clean up the result object
                if(row['hashed_password']) {
                    delete row['hashed_password'];
                }

                if(row['employee_id']) {
                    delete row['employee_id'];
                }

                return row;
            });

            return results;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    async getById(pool, id) {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    async register(pool) {
        try {
            // INSERT INTO EMPLOYEE (role, hashed_password)
            // then insert into EMPLOYEE_PROFILE (first_name, last_name, email)
            await pool.query('BEGIN');
            const result = await pool.query(`
                INSERT INTO employee (role, hashed_password, business_id)
                VALUES ($1, $2, $3)
                RETURNING id;
            `, [this.role, this.hashed_password, this.business_id]);
            
            const employeeId = result.rows[0].id;

            await pool.query(`
                INSERT INTO employee_profile (employee_id, first_name, last_name, email, phone_number, address, birth_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `, [employeeId, this.first_name, this.last_name, this.email, this.phone_number, this.address, this.birth_date]);

            this.id = employeeId;
            await pool.query('COMMIT');

            return {employeeId: employeeId};
        }
        catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database query error:', error);
            return -1;
        }
    }
}


export default EmployeeModel;