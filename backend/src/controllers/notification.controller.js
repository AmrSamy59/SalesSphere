import NotificationModel from "../models/notification.model.js";


class NotificationController {
    constructor() {
        this.noticationModel = new NotificationModel();
    }

    // Please use arrow function to bind 'this' to the class

    addNotification = async (req, res) => {
        const notificationData = req.body;
        if(notificationData.recipient === undefined || notificationData.content === undefined || notificationData.title === undefined || notificationData.priority === undefined || notificationData.type === undefined) {
            return res.status(400).json({error: 'All data are required'});
        }

        if(notificationData.content.trim() === '' || notificationData.title.trim() === '') {
            return res.status(400).json({error: 'Title and content are required'});
        }

        const result = await this.noticationModel.addNotification(req.pool, notificationData);
        res.json({success: result});
    }

    getAllByEmployee = async (req, res) => {
        const notifications = await this.noticationModel.getAllByEmployee(req.pool, req.employeeId);
        res.json(notifications);
    }

    getById = async (req, res) => {
        const notification = await this.noticationModel.getById(req.pool, req.params.id);
        res.json(notification);
    }

    setSeen = async (req, res) => {
        const result = await this.noticationModel.setSeen(req.pool, req.params.id);
        res.json({success: result});
    }

    markAllAsRead = async (req, res) => {
        const result = await this.noticationModel.markAllAsRead(req.pool, req.employeeId);
        res.json({success: result});
    }

    getUnreadCount = async (req, res) => {
        const count = Number(await this.noticationModel.getUnreadCount(req.pool, req.employeeId));
        res.json(count);
    }

}


export default NotificationController;