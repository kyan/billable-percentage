import admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount) throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const db = admin.firestore();

export const saveDepartmentData = async (departmentId: string, data: { [key: string]: number }) => {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; // Format date as 'YYYY-MM-DD'
  const docRef = db.collection('departments').doc(departmentId).collection('dailyData').doc(dateString);
  await docRef.set(data);
};
