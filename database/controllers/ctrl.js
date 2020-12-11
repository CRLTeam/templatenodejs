const Template = require('../models/model.js');

addTemplate = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'must provide template',
        })
    }

    const template = new Template(body);

    if (!template) {
        return res.status(400).json({ success: false, error: err })
    }

    template
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: template._id,
                message: 'Template created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Template not created!',
            })
        })
}

getTemplateById = async (req, res) => {
    await Template.findOne({ _id: req.params.id }, (err, template) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!template) {
            return res
                .status(404)
                .json({ success: false, error: `Template not found` })
        }
        return res.status(200).json({ success: true, data: template })
    }).catch(err => console.log(err))
}

getTemplates = async (req, res) => {
    await Template.find({}, (err, templates) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!templates.length) {
            return res
                .status(404)
                .json({ success: false, error: `Templates not found` })
        }
        return res.status(200).json({ success: true, data: templates })
    }).catch(err => console.log(err))
}

updateTemplate = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Template.findOne({ _id: req.params.id }, (err, template) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Template not found',
            })
        }
        template.data = body.data
        template
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: template._id,
                    message: 'Template updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Template not updated',
                })
            })
    })
}

module.exports = {
    addTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate
}