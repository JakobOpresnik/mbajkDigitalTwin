const bikePathModel = require('../models/bikePathModel.js');
var BikepathModel = require('../models/bikePathModel.js');

module.exports = {

    /**
     * bikePathController.list()
     * @returns returns all bike paths
     */
    list: function (req, res) {
        BikepathModel.find(function (err, bikePaths) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting bikePath.',
                    error: err
                });
            }

            return res.json({success: true, "BikePaths": bikePaths});
        });
    },

    /**
     * bikePathController.show()
     * @returns returns bike path based on ID
     */
    show: function (req, res) {
        var id = req.params.id;

        BikepathModel.findOne({_id: id}, function (err, bikePath) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting bikePath.',
                    error: err
                });
            }

            if (!bikePath) {
                return res.status(404).json({
                    success: false,
                    message: 'No such bikePath'
                });
            }

            return res.json({"BikePath": bikePath});
        });
    },

    /**
     * bikePathController.create()
     * inserts new bike path into the database
     */
    create: function (req, res) {
        var objGeometry = {
            type: 'LineString', 
            coordinates: req.body.coordinates
        }

        var bikePath = new BikepathModel({
            geometry: objGeometry
        });

        bikePath.save(function (err, bikePath) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when creating bikePath',
                    error: err
                });
            }

            return res.status(201).json({success: true, "BikePath": bikePath});
        });
    },

    /**
     * bikePathController.removeAll()
     * deletes all bike paths from the database
     */
    removeAll: function (req, res) {
        bikePathModel.remove({}, function (err, BikePaths) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when deleting bikePaths.',
                    error: err
                });
            }

            return res.status(204).json({success: true});
        });
    }
};
