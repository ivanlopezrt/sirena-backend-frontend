const { Op, Sequelize } = require('sequelize');
const { PatientDiagnosis, Diagnosis, User, Specialty } = require('../models');

/**
 * Service for retrieving and organizing patient diagnosis statistics.
 * @class ChartService
 */
class ChartService {

  constructor() {

  }

  /**
   * Retrieves the top diagnoses history for a specified user.
   * @async
   * @param {number} userId - The ID of the user.
   * @param {number} [limit=20] - The maximum number of top diagnoses to return.
   * @returns {Promise<Array<Object>>} - List of top diagnoses with diagnosis code and count.
   */
  async getTopsHistory(userId, limit = 20) {
    try {

      const diagnoses = await PatientDiagnosis.findAll({
        attributes: [
          [Sequelize.col('diagnosis.code'), 'code'],
          [Sequelize.fn('COUNT', Sequelize.col('diagnosis_id')), 'total'],
        ],
        where: {
          user_id: userId
        },
        include: [
          {
            model: Diagnosis,
            attributes: []
          }
        ],
        group: [
          Sequelize.col('diagnosis.code')
        ],
        order: [
          ['total', 'DESC']
        ],
        limit: limit,
        raw: true
      });

      return diagnoses;
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      throw error;
    }
  }

  /**
   * Retrieves the top diagnoses for a specified month and year.
   * @async
   * @param {number} userId - The ID of the user.
   * @param {number} [month=current month] - The target month.
   * @param {number} [year=current year] - The target year.
   * @param {number} [limit=10] - The maximum number of top diagnoses to return.
   * @returns {Promise<Array<Object>>} - List of top diagnoses with diagnosis code and count.
   */
  async getTopByMonth(userId, month = new Date().getMonth() + 1, year = new Date().getFullYear(), limit = 10) {
    try {

      const diagnoses = await PatientDiagnosis.findAll({
        attributes: [
          [Sequelize.col('diagnosis.code'), 'code'],
          [Sequelize.fn('COUNT', Sequelize.col('diagnosis_id')), 'total'],
        ],
        where: {
          user_id: userId,
          date: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),
            ]
          }
        },
        include: [
          {
            model: Diagnosis,
            attributes: []
          }
        ],
        group: [
          Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%m/%Y'),
          Sequelize.col('diagnosis.code')
        ],
        order: [
          ['total', 'DESC']
        ],
        limit: limit,
        raw: true
      });

      return diagnoses;
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      throw error;
    }
  }

  /**
   * Retrieves diagnoses by user for a specific month, filtered by a list of diagnosis codes.
   * @async
   * @param {number} userId - The ID of the user.
   * @param {number} [month=current month] - The target month.
   * @param {number} [year=current year] - The target year.
   * @param {Array<string>} [diagnosisCodes=[]] - List of diagnosis codes to filter.
   * @param {number} [limit=10] - Maximum number of top diagnoses to fetch.
   * @returns {Promise<Object>} - Object with `tops` (top codes) and `diagnoses` for the user.
   */
  async getDiagnosesByUserForMonth(userId, month = new Date().getMonth() +1, year = new Date().getFullYear(), diagnosisCodes = [], limit = 10) {
    try {

      if (diagnosisCodes.length == 0) {
        const topCodes = await this.getTopByMonth(userId, month, year, limit);
        diagnosisCodes = topCodes.map(tc => tc.code);
      }

      const diagnoses = await PatientDiagnosis.findAll({
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%d/%m/%Y'), 'day'],
          [Sequelize.col('diagnosis.code'), 'code'],
          [Sequelize.fn('COUNT', Sequelize.col('diagnosis_id')), 'total'],
        ],
        where: {
          user_id: userId,
          date: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),
            ]
          }
        },
        include: [
          {
            model: Diagnosis,
            attributes: [],
            where: {
              code: {
                [Op.in]: diagnosisCodes
              }
            }
          }
        ],
        group: [
          Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%d/%m/%Y'),
          Sequelize.col('diagnosis.code')
        ],
        order: [
          ['total', 'DESC']
        ],
        raw: true
      });

      return { tops: diagnosisCodes, diagnoses: diagnoses };
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      throw error;
    }
  }


  /**
   * Retrieves diagnoses grouped by the last specified number of days.
   * @async
   * @param {number} userId - The ID of the user.
   * @param {number} daysBack - The number of past days to include.
   * @returns {Promise<Array<Object>>} - Grouped diagnosis counts by code.
   */
  async getGroupedDiagnisticsLastDays(user_id, daysBack) {

    const diagnosticsGroup = await PatientDiagnosis.findAll({
      where: {
        user_id: user_id,
        date: {
          [Op.lte]: new Date(),
          [Op.gt]: new Date(new Date() - daysBack * 24 * 60 * 60 * 1000)
        }
        ,
      },
      order: [
        ['count', 'DESC']  // Ordenar por nombre en orden ascendente (de la A a la Z)
      ],
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('patient_diagnosis.diagnosis_id')), 'count'],
        [Sequelize.fn('', Sequelize.col('diagnosis.code')), 'code']
      ],
      include: [{
        model: Diagnosis,
        attributes: []
      }],
      group: ['diagnosis.id'],
      raw: true,
    })

    return diagnosticsGroup;

  }

  /**
   * Retrieves a specific diagnosis code's occurrences over the year.
   * @async
   * @param {number} userId - The ID of the user.
   * @param {string} diagnosisCode - The specific diagnosis code.
   * @param {number} [year=current year] - The target year.
   * @returns {Promise<Array<Object>>} - List of diagnosis occurrences by day.
   */
  async getDiagnosesForYear(userId, diagnosisCode, year = new Date().getFullYear(),) {

    try {

      const diagnoses = await PatientDiagnosis.findAll({
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%d/%m/%Y'), 'day'],
          [Sequelize.col('diagnosis.code'), 'code'],
          [Sequelize.fn('COUNT', Sequelize.col('diagnosis_id')), 'total'],
        ],
        where: {
          user_id: userId,
          date: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),
            ]
          }
        },
        include: [
          {
            model: Diagnosis,
            attributes: [],
            where: {
              code: diagnosisCode
            }
          }
        ],
        group: [
          Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%d/%m/%Y'),
          Sequelize.col('diagnosis.code')
        ],
        order: [
          ['day', 'ASC']
        ],
        raw: true
      });

      return diagnoses;
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      throw error;
    }
  }

  /**
   * Retrieves the top diagnoses per specialty.
   * @async
   * @returns {Promise<Array<Object>>} - List of specialties with top diagnosis codes.
   */
  async getTopDiagnosisBySpecialty() {
    const results = await PatientDiagnosis.findAll({
      attributes: [
        [Sequelize.col('user->specialty.name'), 'specialty_name'],
        [Sequelize.col('diagnosis.code'), 'diagnosis_code'],
        [Sequelize.fn('COUNT', Sequelize.col('diagnosis.code')), 'total']
      ],
      include: [
        {
          model: User,
          include: [
            {
              model: Specialty,
              attributes: ['name']
            }
          ],
          attributes: []
        },
        {
          model: Diagnosis,
          attributes: ['code']
        }
      ],
      group: ['user->specialty.name', 'diagnosis.code'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('diagnosis.code')), 'DESC']],
    });

    const groupedResults = {};

    results.forEach(result => {
      const specialtyName = result.get('specialty_name');
      const diagnosisCode = result.get('diagnosis_code');
      const total = result.get('total');

      if (!groupedResults[specialtyName]) {
        groupedResults[specialtyName] = [];
      }

      groupedResults[specialtyName].push({ code: diagnosisCode, total: total });
    });

    const formattedResults = Object.keys(groupedResults).map(specialty => ({
      specialty,
      codes: groupedResults[specialty]
    }));

    return formattedResults;
  }

}

module.exports = ChartService
