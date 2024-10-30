const hospitalService = require("../services/hospitalService");

exports.getHospitals = async (req, res) => {
    try {
        const {page} = req.query
        const hospitals = await hospitalService.getHospitals(page);
        res.status(200).json(hospitals);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};