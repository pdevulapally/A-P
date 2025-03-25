import * as functions from 'firebase-functions/v2'
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'

admin.initializeApp()

interface AdminRoleData {
  email: string;
}

exports.addAdminRole = functions.https.onCall(
  async (data: CallableRequest<AdminRoleData>) => {
    // Check if request is made by an admin
    if (!data.auth?.token.admin) {
      throw new HttpsError('permission-denied', 'Only admins can add other admins')
    }

    try {
      const user = await admin.auth().getUserByEmail(data.data.email)
      await admin.auth().setCustomUserClaims(user.uid, { admin: true })
      return { message: `Success! ${data.data.email} has been made an admin.` }
    } catch (error) {
      throw new HttpsError('internal', 'Error adding admin role')
    }
  }
) 