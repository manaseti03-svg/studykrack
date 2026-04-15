const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

/**
 * Task 2: Server-Side Fuel Validation
 * Circuit Breaker endpoint to protect Gemini API calls.
 * Checks user Fuel balance in Firestore, decrements atomically by 1,
 * and only then issues a temporary JWT/execution token for Gemini processing.
 */
exports.verifyAndConsumeFuel = functions.https.onCall(async (data, context) => {
  // 1. Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Request blocked. User must be authenticated."
    );
  }

  const uid = context.auth.uid;
  const db = admin.firestore();
  const userRef = db.collection("users").doc(uid);

  try {
    // 2. Perform transaction to safely check and decrement fuel
    const executionToken = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(userRef);
      
      if (!doc.exists) {
        throw new functions.https.HttpsError("not-found", "User document not found.");
      }

      const userData = doc.data();
      const currentFuel = userData.fuel_balance || 0;

      // 3. Strict Boundary Validation (Zero-Trust)
      if (currentFuel <= 0) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "Zero-Trust Block: Out of Fuel. Please upgrade to the ₹19 Fuel Plan to continue using Gemini Deep Research."
        );
      }

      // 4. Atomically decrement fuel balance
      transaction.update(userRef, {
        fuel_balance: admin.firestore.FieldValue.increment(-1),
        last_fuel_consumption: admin.firestore.FieldValue.serverTimestamp()
      });

      // 5. Generate Temporary Execution Token (valid for backend processing)
      // This token will be securely verified by the backend API before allowing access to Gemini
      const tokenPayload = `${uid}-${Date.now()}-${crypto.randomBytes(16).toString("hex")}`;
      const signedToken = crypto.createHmac('sha256', functions.config().gemini.secret_key || 'fallback_secret_key_development_only')
                               .update(tokenPayload)
                               .digest('hex');

      return {
        token: signedToken,
        timestamp: Date.now(),
        payload: tokenPayload,
        remaining_fuel: currentFuel - 1
      };
    });

    return {
      status: "success",
      message: "Fuel successfully consumed. Gemini execution authorized.",
      execution_ticket: executionToken
    };

  } catch (error) {
    console.error(`[Zero-Trust Error] UID ${uid}:`, error);
    // Re-throw generic http errors directly
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError("internal", "System fault during fuel validation.");
  }
});
