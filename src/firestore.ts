import admin from 'firebase-admin';
import { DepartmentData } from './types';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount) throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const db = admin.firestore();

export const saveDepartmentData = async (department: string, date: Date, data: DepartmentData) => {
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`; // Format date as 'YYYY-MM-DD'

  const docRef = db.collection('billablePercentage').doc(dateString).collection('departments').doc(department);
  await docRef.set(data);
};
