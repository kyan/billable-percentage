import admin from 'firebase-admin';
import { DepartmentData } from './types';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount) throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const db = admin.firestore();

export const saveDepartmentData = async (
  collectionName: string,
  department: string,
  currentDate: Date,
  workingDaysInMonth: number,
  data: DepartmentData
) => {
  const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`; // Format date as 'YYYY-MM-DD'

  const docRef = db.collection(collectionName).doc(dateString);
  const departmentData = { [department]: data };
  await docRef.set({
    date: dateString,
    workingDaysInMonth: workingDaysInMonth,
    departments: departmentData
  }, { merge: true });
};
