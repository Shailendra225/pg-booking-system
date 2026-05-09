import { auth, provider, db } from "./firebase.js";

import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= GOOGLE LOGIN =================
const googleLogin = document.getElementById("googleLogin");

if (googleLogin) {

  googleLogin.addEventListener("click", async () => {

    try {

      await signInWithPopup(auth, provider);

      // Redirect after login
      window.location.href = "dashboard.html";

    } catch (err) {

      console.error(err);
      alert("Login Failed: " + err.message);

    }

  });

}


// ================= CHECK USER LOGIN =================
onAuthStateChanged(auth, (user) => {

  // If user is not logged in and trying to access dashboard
  if (!user && window.location.pathname.includes("dashboard.html")) {

    window.location.href = "login.html";

  }

  // Optional: Show user name
  const userName = document.getElementById("userName");

  if (user && userName) {

    userName.innerText = `Welcome, ${user.displayName}`;

  }

});


// ================= LOGOUT =================
// const logoutBtn = document.getElementById("logoutBtn");

// if (logoutBtn) {

//   logoutBtn.addEventListener("click", async () => {

//     try {

//       await signOut(auth);

//       window.location.href = "login.html";

//     } catch (err) {

//       console.error(err);
//       alert("Logout Failed");

//     }

//   });

// }


// // ================= BOOK ROOM =================
// window.bookRoom = async function (roomType) {

//   const user = auth.currentUser;

//   if (!user) {

//     alert("Please Login First");
//     return;

//   }

//   try {

//     await addDoc(collection(db, "bookings"), {

//       userName: user.displayName,
//       roomType: roomType,
//       phone: "1234567890", // Placeholder, ideally should be collected from user input
//       bookingDate: serverTimestamp()

//     });

//     alert("✅ Room Booked Successfully!");

//   } catch (err) {

//     console.error(err);

//     alert(err.message);

//   }

// };

window.bookRoom = async function(roomType){

  const user = auth.currentUser;

  if(!user){
    alert("Please Login First");
    return;
  }

  try{

    // CREATE ORDER FROM BACKEND
    const res = await fetch("https://pg-booking-system.onrender.com",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      }
    });

    const order = await res.json();

    // RAZORPAY OPTIONS
    const options = {

      key: "YOUR_RAZORPAY_KEY_ID",

      amount: order.amount,

      currency: "INR",

      order_id: order.id,

      name: "Baba Mahakaal PG",

      description: roomType + " Booking",

      handler: async function(response){

        // VERIFY PAYMENT
        const verifyRes = await fetch("https://pg-booking-system.onrender.com"/verify-payment",{

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body: JSON.stringify({

            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature

          })

        });

        const data = await verifyRes.json();

        if(data.success){

          // SAVE BOOKING IN FIREBASE
          await addDoc(collection(db,"bookings"),{

            userName:user.displayName,

            email:user.email,

            roomType:roomType,

            paymentStatus:"Paid",

            paymentId:response.razorpay_payment_id,

            bookingAmount:2000,

            bookingDate:new Date()

          });

          alert("✅ Booking Confirmed!");

        }else{

          alert("Payment Verification Failed");

        }

      },

      prefill:{
        name:user.displayName,
        email:user.email
      },

      theme:{
        color:"#2563eb"
      }

    };

    const rzp = new Razorpay(options);

    rzp.open();

  }catch(err){

    console.log(err);

    alert("Payment Failed");

  }

}
