const cron = require('node-cron')
const { Op } = require('sequelize')
const moment = require('moment')
const { unit, user_unit, user, complaint_report } = require('../../../data/database/models')
const { getListBilling, reverseUnitParse } = require('../../billing')
const dueDateRminderTemplate = require('../middlewares/email/templates/duedate_reminder')
const complaintRequestReminderTemplate = require('../middlewares/email/templates/complaint_request_reminder')
const { sendMultipleEmail, sendSingleMailtoMultipleRecipients } = require('../middlewares/email')

const checkBillingDueDate = () => {
  const dailyBilling = process.env.CRON_BILLING_REMINDER
  console.log('Created cron job for checking billing due date') 
  cron.schedule(dailyBilling, async () => {
    const data = await getListBilling({ status: 'UNPAID' });
      if (data.Table) {
        const dataUnits = await user_unit.findAll({
          where: {
            is_approved: true,
          },
          include: [
            {
              model: unit,
              where: {
                code: data.Table.map((bill) => {
                  return bill.id.split('/RL/')[0];
                }),
              },
              attributes: ['code', 'unit_name'],
            },
            {
              model: user,
              where: { id: { [Op.ne]: null } },
              attributes: ['name', 'email'],
            },
          ],
        });
        let contentData = [];
        for (let idx = 0; idx < dataUnits.length; idx++) {
          const dataUnit = dataUnits[idx];
          const dataBillings = data.Table.filter((billing) => {
            const unitCode = billing.id.split('/RL/')[0];
            return unitCode === dataUnit.unit.code;
          });
          for (let k = 0; k < dataBillings.length; k++) {
            const dataBilling = dataBillings[k];
            contentData.push({
              name: dataUnit.user ? dataUnit.user.name : '',
              email: dataUnit.user ? dataUnit.user.email : '',
              date: new Date(dataBilling.periode),
              lotNumber: dataUnit.unit ? dataUnit.unit.code : '',
              unitName: dataUnit.unit ? dataUnit.unit.unit_name : '',
              amount: dataBilling.totalRemaining,
            });
          }
        }

        const messageDatas = contentData.map((o) => {
          const content = dueDateRminderTemplate(
            o.name,
            o.unitName,
            o.date,
            o.amount
          );
          return {
            to: o.email,
            subject: `Suvarna Sutera Billing Reminder for Unit ${o.unitName}`,
            text: content,
            html: content,
          };
        });
        await sendMultipleEmail(messageDatas);
      }
  }, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  })
}

const countComplaintRequestOlderThan24Hours = async () => {
  return await complaint_report.count({
    where: {
      complaint_status_id: '8ac7c410-16ce-40c0-8ee9-4119cc1613ac',
      created_at: {
        [Op.lte]: moment().subtract(24, 'hours').toDate() 
      }
    }
  })
}

const getAllEmailPengelola = async () => {
  return await user.findAll({
    where: {
      is_a_resident: false,
      is_activated: true
    },
    attributes: ['email']
  })
}

const cronComplaintRequestReminder = async () => {
  console.log('Created cron job for complaint request reminder')
  cron.schedule(process.env.CRON_COMPLAINT_REQUEST_REMINDER, async () => {
    const complaintCount = await countComplaintRequestOlderThan24Hours()
    if (complaintCount > 0) {
      const emailPengelolaArr = await getAllEmailPengelola()
      const content = complaintRequestReminderTemplate(complaintCount)
      sendSingleMailtoMultipleRecipients({
        to: emailPengelolaArr,
        subject: 'Complaint Request Reminder',
        text: content,
        html: content
      })
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  })
}

module.exports = {
  checkBillingDueDate,
  cronComplaintRequestReminder
}
