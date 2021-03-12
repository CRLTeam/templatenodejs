const Context = require('../models/contextModel.js');

addContext = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'must provide Context',
        })
    }

    const context = new Context(body);

    if (!context) {
        return res.status(400).json({ success: false, error: err })
    }

    context
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: context._id,
                message: 'Context created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Context not created',
            })
        })
}

getContextById = async (req, res) => {
    await Context.findOne({ _id: req.params.id }, (err, context) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!context) {
            return res
                .status(404)
                .json({ success: false, error: `Context not found` })
        }
        return res.status(200).json({ success: true, data: context })
    }).catch(err => console.log(err))
}

getContext = async (req, res) => {
    await Context.find({}, (err, contexts) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!contexts.length) {
            return res
                .status(404)
                .json({ success: false, error: `Contexts not found` })
        }
        return res.status(200).json({ success: true, data: contexts })
    }).catch(err => console.log(err))
}

updateContext = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Context.findOne({ _id: req.params.id }, (err, context) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Context not found',
            })
        }
        context.templateID = body.templateID;
        context.languages = body.languages;

        context
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: context._id,
                    message: 'Context updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Context not updated',
                })
            })
    })
}

module.exports = {
    addContext,
    getContextById,
    getContext,
    updateContext
}