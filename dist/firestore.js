"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDepartmentData = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount)
    throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(serviceAccount))
});
const db = firebase_admin_1.default.firestore();
const saveDepartmentData = async (collectionName, department, currentDate, workingDaysInMonth, data) => {
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`; // Format date as 'YYYY-MM-DD'
    const docRef = db.collection(collectionName).doc(dateString);
    const departmentData = { [department]: data };
    await docRef.set({
        date: dateString,
        workingDaysInMonth: workingDaysInMonth,
        departments: departmentData
    }, { merge: true });
};
exports.saveDepartmentData = saveDepartmentData;
