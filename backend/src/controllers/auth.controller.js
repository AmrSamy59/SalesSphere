import EmployeeModel from "../models/employee.model.js";
import bcypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

class AuthController {
    constructor() {
        this.employeeModel = new EmployeeModel({});
    }

    login = async (req, res) => {
        const empData = req.body;

        if(!empData.email || !empData.password) {
            return res.status(400).json({error: 'Email and password are required'});
        }

        const emp = await this.employeeModel.getByEmailForAuth(req.pool, empData.email);
        if(emp && emp.hashed_password) {
            const match = await bcypt.compare(empData.password, emp.hashed_password);
            if(match) {
                const token = jwt.sign({id: emp.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
                return res.json({token});
            }
        }
        res.status(400).json({error: 'Invalid email or password'});
    }

    verifyToken = async (req, res, next) => {
        const token = req.headers['authorization'];
        if(!token) {
            return res.status(401).json({error: 'Not authorized', 'session_end': false});
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.employeeId = decoded.id;
            next();
        } catch (error) {
            res.status(401).json({error: 'Not authorized', 'session_end': true});
        }
    }
    hello = async (req, res) => {
        res.json({message: 'Hello!', id: req.employeeId});
    }
}


export default AuthController;