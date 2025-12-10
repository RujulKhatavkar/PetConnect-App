require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173'
);

app.use(cors());
app.use(express.json());

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, type: user.type, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

function mapPet(row) {
  if (!row) return null;
  return {
    ...row,
    goodWithKids: !!row.goodWithKids,
    goodWithPets: !!row.goodWithPets,
    traits: row.traits ? JSON.parse(row.traits) : [],
    images: row.images ? JSON.parse(row.images) : []
  };
}

// ----- Auth: email/password -----
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, type } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  const userType = type === 'shelter' ? 'shelter' : 'adopter';
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    db.run(
      'INSERT INTO users (name, email, password_hash, type) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, userType],
      function (err2) {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: 'Database error' });
        }
        const user = { id: this.lastID, name, email, type: userType };
        const token = generateToken(user);
        res.status(201).json({ user, token });
      }
    );
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password_hash === 'google-oauth') {
      return res.status(400).json({ message: 'Use Google sign-in for this account' });
    }

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, type: user.type };
    const token = generateToken(safeUser);
    res.json({ user: safeUser, token });
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, type FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ user });
  });
});

// ----- Auth: Google OAuth code flow -----
app.post('/api/auth/google', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Missing authorization code' });
  }
  try {
    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || (email && email.split('@')[0]) || 'Google User';
    if (!email) {
      return res.status(400).json({ message: 'No email returned from Google' });
    }
    db.get('SELECT id, name, email, type FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      const defaultType = 'adopter';
      if (!user) {
        db.run(
          'INSERT INTO users (name, email, password_hash, type) VALUES (?, ?, ?, ?)',
          [name, email, 'google-oauth', defaultType],
          function (err2) {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ message: 'Database error' });
            }
            const newUser = { id: this.lastID, name, email, type: defaultType };
            const token = generateToken(newUser);
            return res.status(201).json({ user: newUser, token });
          }
        );
      } else {
        const safeUser = { id: user.id, name: user.name, email: user.email, type: user.type };
        const token = generateToken(safeUser);
        return res.json({ user: safeUser, token });
      }
    });
  } catch (err) {
    console.error('Google auth error', err);
    return res.status(500).json({ message: 'Google authentication failed' });
  }
});

// ----- Pets -----
app.get('/api/pets', (req, res) => {
  const { species, size, energy, location } = req.query;
  let query = 'SELECT * FROM pets WHERE 1=1';
  const params = [];
  if (species) {
    query += ' AND species = ?';
    params.push(species);
  }
  if (size) {
    query += ' AND size = ?';
    params.push(size);
  }
  if (energy) {
    query += ' AND energy = ?';
    params.push(energy);
  }
  if (location) {
    query += ' AND LOWER(location) LIKE ?';
    params.push(`%${String(location).toLowerCase()}%`);
  }
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(rows.map(mapPet));
  });
});

app.get('/api/pets/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('SELECT * FROM pets WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row) return res.status(404).json({ message: 'Pet not found' });
    res.json(mapPet(row));
  });
});

app.post('/api/pets', authenticateToken, (req, res) => {
  if (req.user.type !== 'shelter') {
    return res.status(403).json({ message: 'Only shelters can create pets' });
  }
  const {
    name, species, breed, age, size, gender, color, energy,
    goodWithKids, goodWithPets, description, traits, location,
    shelter, image, images
  } = req.body;
  if (!name || !species) {
    return res.status(400).json({ message: 'Name and species are required' });
  }
  const traitsJson = JSON.stringify(traits || []);
  const imagesJson = JSON.stringify(images || []);
  const stmt = `INSERT INTO pets (
    name, species, breed, age, size, gender, color, energy,
    goodWithKids, goodWithPets, description, traits, location,
    shelter, shelterId, image, images
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    name, species, breed || null, age || null, size || null, gender || null,
    color || null, energy || null,
    goodWithKids ? 1 : 0,
    goodWithPets ? 1 : 0,
    description || null,
    traitsJson,
    location || null,
    shelter || req.user.name,
    req.user.id,
    image || null,
    imagesJson
  ];
  db.run(stmt, params, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    db.get('SELECT * FROM pets WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json(mapPet(row));
    });
  });
});

// ----- Applications -----
app.post('/api/applications', authenticateToken, (req, res) => {
  if (req.user.type !== 'adopter') {
    return res.status(403).json({ message: 'Only adopters can submit applications' });
  }
  const {
    petId,
    applicantName,
    applicantEmail,
    applicantPhone,
    homeType,
    hasYard,
    hasPets,
    experience,
    reason,
    shelterId
  } = req.body;
  if (!petId) {
    return res.status(400).json({ message: 'petId is required' });
  }
  const submittedDate = new Date().toISOString();
  const status = 'pending';
  const stmt = `INSERT INTO applications (
    petId, applicantId, applicantName, applicantEmail, applicantPhone,
    homeType, hasYard, hasPets, experience, reason, status,
    submittedDate, shelterId
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    petId,
    req.user.id,
    applicantName || req.user.name,
    applicantEmail || req.user.email,
    applicantPhone || null,
    homeType || null,
    hasYard ? 1 : 0,
    hasPets ? 1 : 0,
    experience || null,
    reason || null,
    status,
    submittedDate,
    shelterId || null
  ];
  db.run(stmt, params, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    db.get('SELECT * FROM applications WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json(row);
    });
  });
});

app.get('/api/applications', authenticateToken, (req, res) => {
  const user = req.user;
  let query;
  let params;
  if (user.type === 'adopter') {
    query = `
      SELECT
        a.*,
        p.name  AS petName,
        p.image AS petImage
      FROM applications a
      JOIN pets p ON p.id = a.petId
      WHERE a.applicantId = ?
      ORDER BY a.submittedDate DESC
    `;
    params = [user.id];
  } else {
    // shelter: see all applications for their pets
    query = `
      SELECT
        a.*,
        p.name  AS petName,
        p.image AS petImage
      FROM applications a
      JOIN pets p ON p.id = a.petId
      WHERE a.shelterId = ?
      ORDER BY a.submittedDate DESC
    `;
    params = [user.id];
  }
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(rows);
  });
});

app.patch('/api/applications/:id/status', authenticateToken, (req, res) => {
  if (req.user.type !== 'shelter') {
    return res.status(403).json({ message: 'Only shelters can update status' });
  }
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  db.run(
    'UPDATE applications SET status = ? WHERE id = ? AND shelterId = ?',
    [status, id, req.user.id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Application not found or not owned by this shelter' });
      }
      db.get('SELECT * FROM applications WHERE id = ?', [id], (err2, row) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: 'Database error' });
        }
        res.json(row);
      });
    }
  );
});

// ----- Favorites -----
app.get('/api/favorites', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT p.*
    FROM favorites f
    JOIN pets p ON p.id = f.petId
    WHERE f.userId = ?
  `;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(rows.map(mapPet));
  });
});

app.post('/api/favorites', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { petId } = req.body;
  if (!petId) {
    return res.status(400).json({ message: 'petId is required' });
  }
  db.run(
    'INSERT OR IGNORE INTO favorites (userId, petId) VALUES (?, ?)',
    [userId, petId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ ok: true });
    }
  );
});

app.delete('/api/favorites/:petId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const petId = Number(req.params.petId);
  db.run(
    'DELETE FROM favorites WHERE userId = ? AND petId = ?',
    [userId, petId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ ok: true });
    }
  );
});

app.get('/', (_req, res) => {
  res.send('PetConnect backend with SQLite + auth + Google OAuth is running');
});

app.listen(PORT, () => {
  console.log(`PetConnect backend listening on http://localhost:${PORT}`);
});
