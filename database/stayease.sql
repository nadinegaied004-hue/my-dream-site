-- =====================================================
-- SCHEMA BASE DE DONNEES STAYEASE - Version 1.0
-- =====================================================

-- =====================================================
-- 1. UTILISATEURS (Client et Propriétaire)
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('client', 'proprietaire', 'admin')) DEFAULT 'client',
    telephone VARCHAR(20),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. LOGEMENTS
-- =====================================================
CREATE TABLE logements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    motivation TEXT,
    categorie VARCHAR(50) CHECK (categorie IN ('Hôtel', 'Maison', 'Maison d\'hôtes', 'Ferme')),
    ville VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    id_proprietaire INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. IMAGES LOGEMENT
-- =====================================================
CREATE TABLE images_logement (
    id SERIAL PRIMARY KEY,
    id_logement INTEGER REFERENCES logements(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. AVIS CLIENTS
-- =====================================================
CREATE TABLE avis_client (
    id SERIAL PRIMARY KEY,
    id_logement INTEGER REFERENCES logements(id) ON DELETE CASCADE,
    id_client INTEGER REFERENCES users(id),
    note INTEGER CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. EVENEMENTS
-- =====================================================
CREATE TABLE evenements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    lieu VARCHAR(255),
    date_debut DATE,
    date_fin DATE,
    prix VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('Culturel', 'Sportif')),
    images TEXT[],  -- tableau d'URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. ATTRACTIONS
-- =====================================================
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    adresse VARCHAR(255),
    horaires VARCHAR(100),
    images TEXT[],  -- tableau d'URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. SAISONS
-- =====================================================
CREATE TABLE saisons (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) CHECK (nom IN ('Printemps', 'Été', 'Automne', 'Hiver')),
    id_logement INTEGER REFERENCES logements(id) ON DELETE CASCADE
);

-- =====================================================
-- 8. LOGEMENT EVENEMENTS (N:N)
-- =====================================================
CREATE TABLE logement_evenement (
    id_logement INTEGER REFERENCES logements(id) ON DELETE CASCADE,
    id_evenement INTEGER REFERENCES evenements(id) ON DELETE CASCADE,
    distance_km DECIMAL(5, 2),
    PRIMARY KEY (id_logement, id_evenement)
);

-- =====================================================
-- 9. LOGEMENT ATTRACTIONS (N:N)
-- =====================================================
CREATE TABLE logement_attraction (
    id_logement INTEGER REFERENCES logements(id) ON DELETE CASCADE,
    id_attraction INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
    distance_km DECIMAL(5, 2),
    PRIMARY KEY (id_logement, id_attraction)
);

-- =====================================================
-- 10. DISPONIBILITES
-- =====================================================
CREATE TABLE disponibilites (
    id SERIAL PRIMARY KEY,
    id_logement INTEGER REFERENCES logements(id) ON DELETE CASCADE,
    date_disponible DATE NOT NULL,
    is_evenement BOOLEAN DEFAULT false,
    UNIQUE(id_logement, date_disponible)
);

-- =====================================================
-- 11. RECOMMANDATIONS
-- =====================================================
CREATE TABLE recommandations (
    id SERIAL PRIMARY KEY,
    id_logement INTEGER REFERENCES logements(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('attraction', 'evenement')),
    nom_recommande VARCHAR(255),
    details TEXT
);

-- =====================================================
-- 12. TRADUCTIONS
-- =====================================================
CREATE TABLE traductions (
    id SERIAL PRIMARY KEY,
    langue VARCHAR(10) CHECK (langue IN ('fr', 'en', 'ar')),
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT NOT NULL,
    UNIQUE(langue, cle)
);

-- =====================================================
-- INDEX POUR PERFORMANCES
-- =====================================================
CREATE INDEX idx_logements_ville ON logements(ville);
CREATE INDEX idx_logements_categorie ON logementS(categorie);
CREATE INDEX idx_logements_proprietaire ON logements(id_proprietaire);
CREATE INDEX idx_avis_logement ON avis_client(id_logement);
CREATE INDEX idx_avis_client ON avis_client(id_client);
CREATE INDEX idx_disponibilites_date ON disponibilites(date_disponible);

-- =====================================================
-- DONNEES DE TEST (SAMPLE DATA)
-- =====================================================

-- Utilisateurs test
INSERT INTO users (email, password, nom, role) VALUES 
('client@test.com', '$2a$10$abcdefghijklmnopqrstuv', 'Ahmed Ben Ali', 'client'),
('proprio@test.com', '$2a$10$abcdefghijklmnopqrstuv', 'Sami Bouzid', 'proprietaire');

-- Logement example
INSERT INTO logements (nom, description, motivation, categorie, ville, latitude, longitude, id_proprietaire)
VALUES ('Hôtel El Mouradi Hammamet', 'Hôtel 5 étoiles avec vue sur mer...', 'Proximité de la plage...', 'Hôtel', 'Hammamet', 36.4000, 10.6167, 2);