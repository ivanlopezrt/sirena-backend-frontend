const ChartService = require('../services/chartService');

exports.loadLastDays = async (req, res) => {
    try {
        const data = await new ChartService().getGroupedDiagnisticsLastDays(req.user.id,30)
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.topMonth = async (req, res) => {
    try {
        const data = await new ChartService().getDiagnosesByUserForMonth(req.user.id,new Date().getMonth() +1 ,new Date().getFullYear())
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.topsEver = async (req, res) => {
    try {
        const data = await new ChartService().getTopsHistory(req.user.id,20)
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.codeEvolution = async (req, res) => {
    try {
        let {year, code} = req.query;

        if(!year || year == undefined){
            year = new Date().getFullYear();
        }

        if(!code)  {
            res.status(400).json({message: "Falta código de diagnostico(code)"});
        }

        const data = await new ChartService().getDiagnosesForYear(req.user.id,code,year)
        
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.topsSpeciality = async (req, res) => {
    try {

        const data = await new ChartService().getTopDiagnosisBySpecialty()
        
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};