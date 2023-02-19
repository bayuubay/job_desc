const jwt = require('jsonwebtoken')
const { token, user } = require('../../../data/database/models')

module.exports = {
  parseForgotToken: (token) => {
    const secret = process.env.ACCESS_TOKEN_SECRET
    const data = jwt.verify(token, secret) || null

    return data
  },
  getAdminFcmTokens: async () => {
    const adminIds = (await user.findAll({ where: { is_a_resident: false } })).map(({ id }) => id)
    const tokens = (await token.findAll({ where: { type: 'fcm', user_id: adminIds } }))

    return [adminIds, tokens]
  },
  getAdminDashboardFcmTokens: async () => {
    const adminIds = (await user.findAll({ where: { is_a_resident: false } })).map(({ id }) => id)
    const tokens = (await token.findAll({
      where: {
        type: 'fcm',
        user_id: adminIds,
        is_from_mobile_platform: false
      }
    }))

    return [adminIds, tokens]
  },
  getAdminMobileFcmTokens: async () => {
    const adminIds = (await user.findAll({ where: { is_a_resident: false } })).map(({ id }) => id)
    const tokens = (await token.findAll({
      where: {
        type: 'fcm',
        user_id: adminIds,
        is_from_mobile_platform: true
      }
    }))

    return [adminIds, tokens]
  },
  getSpecificUserFcmToken: async (user_id) => {
    const userId = (await user.findByPk(user_id)).id
    const userToken = await token.findAll({ where: { type: 'fcm', user_id: userId } })

    return [userId ? [userId] : [], userToken]
  },
  getSpecificUserFcmTokens: async (user_ids) => {
    // const user_ids = (await user.findAll({ where: { is_a_resident: false, is_receive_emergency: true } })).map(({ id }) => id)
    const tokens = (await token.findAll({ where: { type: 'fcm', user_id: user_ids } }))
  
    return [user_ids, tokens]
  },
  getUserFcmTokens: async () => {
    const userIds = (await user.findAll({ where: { is_a_resident: true }, attributes: ['id'] })).map(({ id }) => id)
    const tokens = await token.findAll({ where: { type: 'fcm', user_id: userIds } })

    return [userIds, tokens]
  },
  getAdminEmergencyFcmTokens: async () => {
    try {
      const adminIds = (await user.findAll({ where: { is_a_resident: false, is_receive_emergency: true } })).map(({ id }) => id)
      const tokens = (await token.findAll({ where: { type: 'fcm', user_id: adminIds } }))
  
      return [adminIds, tokens]
    } catch (error) {
      throw error
    }
  },
  getSpecificAdminTokens: async (user_ids) => {
    try {
      const adminIds = (await user.findAll({ where: { is_a_resident: false, id: user_ids } })).map(({ id }) => id)
      const tokens = (await token.findAll({ where: { type: 'fcm', user_id: adminIds } }))
      return [adminIds, tokens]
    } catch (error) {
      throw error
    }
  }
}
