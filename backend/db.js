const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, 'petconnect.db');

const db = new sqlite3.Database(DB_PATH);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('adopter','shelter'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      age TEXT,
      size TEXT,
      gender TEXT,
      color TEXT,
      energy TEXT,
      goodWithKids INTEGER,
      goodWithPets INTEGER,
      description TEXT,
      traits TEXT,
      location TEXT,
      shelter TEXT,
      shelterId INTEGER,
      image TEXT,
      images TEXT,
      FOREIGN KEY (shelterId) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      petId INTEGER,
      applicantId INTEGER,
      applicantName TEXT,
      applicantEmail TEXT,
      applicantPhone TEXT,
      homeType TEXT,
      hasYard INTEGER,
      hasPets INTEGER,
      experience TEXT,
      reason TEXT,
      status TEXT,
      submittedDate TEXT,
      shelterId INTEGER,
      FOREIGN KEY (petId) REFERENCES pets(id),
      FOREIGN KEY (applicantId) REFERENCES users(id),
      FOREIGN KEY (shelterId) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS favorites (
      userId INTEGER,
      petId INTEGER,
      PRIMARY KEY (userId, petId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (petId) REFERENCES pets(id)
    )`);

    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        console.error('Error counting users', err);
        return;
      }
      if (row.count === 0) {
        console.log('Seeding initial users and pets...');
        const passwordHash = bcrypt.hashSync('password123', 10);

        db.run(
          'INSERT INTO users (name, email, password_hash, type) VALUES (?, ?, ?, ?)',
          ['Alice Adopter', 'alice@example.com', passwordHash, 'adopter']
        );
        db.run(
          'INSERT INTO users (name, email, password_hash, type) VALUES (?, ?, ?, ?)',
          ['SF Shelter', 'shelter@example.com', passwordHash, 'shelter'],
          function (err) {
            if (err) {
              console.error('Error inserting shelter user', err);
              return;
            }
            const shelterId = this.lastID;

            const insertPet = db.prepare(
              `INSERT INTO pets (
                name, species, breed, age, size, gender, color, energy,
                goodWithKids, goodWithPets, description, traits, location,
                shelter, shelterId, image, images
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            );

            insertPet.run(
              'Luna', 'Dog', 'Labrador Retriever', '2 years', 'Large', 'Female', 'Yellow', 'High',
              1, 1,
              'Friendly and playful lab who loves long walks and fetch.',
              JSON.stringify(['Playful', 'Friendly', 'House-trained']),
              'San Francisco, CA',
              'Golden Gate Rescue',
              shelterId,
              'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
              JSON.stringify([])
            );

            insertPet.run(
              'Milo', 'Cat', 'Domestic Short Hair', '1 year', 'Small', 'Male', 'Orange', 'Medium',
              1, 0,
              'Curious orange tabby who loves windowsills and naps.',
              JSON.stringify(['Curious', 'Affectionate']),
              'San Jose, CA',
              'Silicon Valley Humane',
              shelterId,
              'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
              JSON.stringify([])
            );

            insertPet.run(
              'Bella', 'Dog', 'Beagle', '3 years', 'Medium', 'Female', 'Tricolor', 'Medium',
              1, 1,
              'Sweet beagle who loves sniff walks and cuddles.',
              JSON.stringify(['Gentle', 'Calm']),
              'Oakland, CA',
              'East Bay Paws',
              shelterId,
              'https://images.pexels.com/photos/46024/pexels-photo-46024.jpeg',
              JSON.stringify([])
            );

            insertPet.finalize();
          }
        );
      }
    });
  });
}

init();

module.exports = db;
