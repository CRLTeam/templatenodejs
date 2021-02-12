const Instance = require('../models/instanceModel.js');

addInstance = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'must provide instance',
        })
    }

    const instance = new Instance(body);

    if (!instance) {
        return res.status(400).json({ success: false, error: err })
    }

    instance
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: instance._id,
                message: 'instance created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'instance not created!',
            })
        })
}

getInstanceById = async (req, res) => {
    await Instance.findOne({ _id: req.params.id }, (err, instance) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!instance) {
            return res
                .status(404)
                .json({ success: false, error: `instance not found` })
        }
        return res.status(200).json({ success: true, data: instance })
    }).catch(err => console.log(err))
}

getInstance = async (req, res) => {
    await Instance.find({}, (err, instances) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!instances.length) {
            return res
                .status(404)
                .json({ success: false, error: `instances not found` })
        }
        return res.status(200).json({ success: true, data: instances })
    }).catch(err => console.log(err))
}

updateInstance = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Instance.findOne({ _id: req.params.id }, (err, instance) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'instance not found',
            })
        }
        instance.templateID = body.templateID;
        instance.context = body.context;
        instance.states = body.states;
        if(body.role){
            instance.role = body.role;
        }

        instance
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: instance._id,
                    message: 'instance updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'instance not updated',
                })
            })
    })
}

module.exports = {
    addInstance,
    getInstanceById,
    getInstance,
    updateInstance
}