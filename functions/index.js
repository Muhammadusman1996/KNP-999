
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();

const db = getFirestore();

const ADMIN_EMAIL = (process.env.KNP_ADMIN_EMAIL || '').trim().toLowerCase();

const ALLOWED_GAMES = [
  'dragon-tiger',
  'aviator',
  'mines',
  'big-piggy-bank',
  'roulette',
  'fortune-rabbit',
  'zoo-roulette',
  'candy-party'
];

function requireUser(req) {
  if (!req.auth) {
    throw new HttpsError('unauthenticated', 'Please login first.');
  }
  return req.auth.uid;
}

function requireAdmin(req) {
  const uid = requireUser(req);
  const email = String(req.auth.token.email || '').toLowerCase();

  if (!ADMIN_EMAIL || email !== ADMIN_EMAIL) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }

  return uid;
}

function validateGame(value) {
  const game = String(value || '');

  if (!ALLOWED_GAMES.includes(game)) {
    throw new HttpsError('invalid-argument', 'Invalid game.');
  }

  return game;
}

function validateAmount(value) {
  const amount = Number(value);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new HttpsError(
      'invalid-argument',
      'Amount must be a positive whole number.'
    );
  }

  return amount;
}

// Create player profile and grant welcome coins once.
exports.createPlayerProfile = onCall(async (req) => {
  const uid = requireUser(req);
  const { name, phone } = req.data || {};

  if (typeof name !== 'string' || name.trim().length < 2) {
    throw new HttpsError('invalid-argument', 'Valid user name required.');
  }

  if (typeof phone !== 'string') {
    throw new HttpsError('invalid-argument', 'Mobile number required.');
  }

  const digits = phone.replace(/\D/g, '');
  let cleanPhone = digits;

  if (digits.startsWith('92') && digits.length === 12) {
    cleanPhone = '0' + digits.slice(2);
  }

  if (!/^03\d{9}$/.test(cleanPhone)) {
    throw new HttpsError('invalid-argument', 'Valid Pakistan mobile number required.');
  }

  const userRef = db.doc(`users/${uid}`);
  const phoneRef = db.doc(`phoneIndex/${cleanPhone}`);

  await db.runTransaction(async (tx) => {
    const [userSnap, phoneSnap] = await Promise.all([
      tx.get(userRef),
      tx.get(phoneRef)
    ]);

    if (userSnap.exists) {
      throw new HttpsError('already-exists', 'Player profile already exists.');
    }

    if (phoneSnap.exists) {
      throw new HttpsError('already-exists', 'Mobile number already registered.');
    }

    tx.create(userRef, {
      uid,
      name: name.trim(),
      phone: cleanPhone,
      coins: 50,
      bonusWelcomeGranted: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    tx.create(phoneRef, {
      uid,
      createdAt: FieldValue.serverTimestamp()
    });
  });

  return { ok: true, coins: 50 };
});

// Get the current shared wallet.
exports.getWallet = onCall(async (req) => {
  const uid = requireUser(req);
  const snap = await db.doc(`users/${uid}`).get();

  if (!snap.exists) {
    throw new HttpsError('not-found', 'Player profile not found.');
  }

  return {
    coins: Number(snap.get('coins') || 0)
  };
});

// Deduct a bet exactly once using a unique requestId.
exports.placeBet = onCall(async (req) => {
  const uid = requireUser(req);
  const amount = validateAmount(req.data?.amount);
  const game = validateGame(req.data?.game);
  const requestId = String(req.data?.requestId || '');

  if (!/^[A-Za-z0-9_-]{8,100}$/.test(requestId)) {
    throw new HttpsError('invalid-argument', 'A valid unique requestId is required.');
  }

  const userRef = db.doc(`users/${uid}`);
  const betRef = db.doc(`walletBets/${uid}_${requestId}`);

  let newBalance = 0;

  await db.runTransaction(async (tx) => {
    const [userSnap, betSnap] = await Promise.all([
      tx.get(userRef),
      tx.get(betRef)
    ]);

    if (betSnap.exists) {
      throw new HttpsError('already-exists', 'This bet request was already processed.');
    }

    if (!userSnap.exists) {
      throw new HttpsError('not-found', 'Player profile not found.');
    }

    const coins = Number(userSnap.get('coins') || 0);

    if (coins < amount) {
      throw new HttpsError('failed-precondition', 'Insufficient coins.');
    }

    newBalance = coins - amount;

    tx.update(userRef, {
      coins: newBalance,
      updatedAt: FieldValue.serverTimestamp()
    });

    tx.create(betRef, {
      uid,
      game,
      amount,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp()
    });

    tx.create(db.collection('walletTransactions').doc(), {
      uid,
      game,
      type: 'bet',
      amount,
      balanceAfter: newBalance,
      requestId,
      createdAt: FieldValue.serverTimestamp()
    });
  });

  return { coins: newBalance };
});

// Win settlement is disabled until game outcomes are verified server-side.
// Never accept a client-provided win amount as proof of a win.
exports.settleWin = onCall(async () => {
  throw new HttpsError(
    'failed-precondition',
    'Win settlement is disabled until server-side game result verification is implemented.'
  );
});

// Admin-only coin top-up.
exports.adminAddCoins = onCall(async (req) => {
  const adminUid = requireAdmin(req);
  const uid = String(req.data?.uid || '');
  const amount = validateAmount(req.data?.amount);

  if (!uid) {
    throw new HttpsError('invalid-argument', 'User ID is required.');
  }

  const userRef = db.doc(`users/${uid}`);
  let newBalance = 0;

  await db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);

    if (!userSnap.exists) {
      throw new HttpsError('not-found', 'User not found.');
    }

    const currentCoins = Number(userSnap.get('coins') || 0);
    newBalance = currentCoins + amount;

    tx.update(userRef, {
      coins: newBalance,
      updatedAt: FieldValue.serverTimestamp()
    });

    tx.create(db.collection('walletTransactions').doc(), {
      uid,
      game: 'admin',
      type: 'admin_credit',
      amount,
      balanceAfter: newBalance,
      adminUid,
      createdAt: FieldValue.serverTimestamp()
    });
  });

  return { coins: newBalance };
});
