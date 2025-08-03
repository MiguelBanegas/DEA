// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAc7f4RoXzhMT1ZENfeE6Q913Xr_KsOTow",
  authDomain: "datosdeasoluciones-baa49.firebaseapp.com",
  projectId: "datosdeasoluciones-baa49",
  storageBucket: "datosdeasoluciones-baa49.firebasestorage.app",
  messagingSenderId: "446188824284",
  appId: "1:446188824284:web:48578fa9a40607198ff619",
  measurementId: "G-8WEC2PCS90"
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();