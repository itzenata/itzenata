------------------------------------------------------ SQL FOR COMPTES --------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------
-- Creation de accounts table : 
CREATE TABLE
    accounts (
        id SERIAL PRIMARY KEY,
        -- Unique account identifier (auto-incrementing)
        code VARCHAR(255) NOT NULL ,
        -- Account code
        libelle VARCHAR(255) NOT NULL,
        -- Description of the account
        class VARCHAR(255) NOT NULL,
        CONSTRAINT unique_code UNIQUE (code) 
    );

  

------------------------------------------------------
-- SQL FOR COMPANIES
------------------------------------------------------
-- Creation of the company table
CREATE TABLE
  company (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    capital DECIMAL(15, 2),
    employees INT NOT NULL,
    founded_on DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activity VARCHAR(255),
    legal_form VARCHAR(10) CHECK (
      legal_form IN ('SARL', 'SA', 'SNC', 'SCS', 'Autres')
    ),
    comment TEXT,
    address VARCHAR(255),
    additional_info VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    vat_identifier INT,
    if_id INT,
    ice INT,
    rc INT,
    cnss INT,
    declaration_regime VARCHAR(20) CHECK (declaration_regime IN ('Trimistiel', 'Monsieul')),
    payment_mode VARCHAR(20) CHECK (payment_mode IN ('Encaissement', 'Debut')),
    debut_encaissement VARCHAR(20) CHECK (debut_encaissement IN ('immediate', 'deferred'))
  );

------------------------------------------------------
-- SQL FOR JOURNALS
------------------------------------------------------
-- Creation of the journals table
CREATE TABLE
  journals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_operations INTEGER DEFAULT 0,
    last_edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_edit_user VARCHAR(255),
    status VARCHAR(50),
    total_value NUMERIC(15, 2) DEFAULT 0.0,
    type VARCHAR(100)
  );

------------------------------------------------------
-- SQL FOR TRANSACTIONS
------------------------------------------------------
-- Creation of the transactions table
CREATE TABLE
  transactions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES company (id) ON DELETE CASCADE,
    montant_debit_total NUMERIC(15, 2),
    montant_credit_total NUMERIC(15, 2),
    libelle VARCHAR(255),
    transaction_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    journal_id INTEGER REFERENCES journals (id) ON DELETE CASCADE
  );

------------------------------------------------------
-- SQL FOR TRANSACTION_COMPTES (Many-to-Many Relationship)
------------------------------------------------------
-- Creation of the transaction_accounts table for many-to-many relationship
CREATE TABLE
  transaction_accounts (
    transaction_id INTEGER NOT NULL REFERENCES transactions (id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    montant_debit NUMERIC(15, 2),
    montant_credit NUMERIC(15, 2),
    PRIMARY KEY (transaction_id, account_id)
  );

  ------------------------------------------------------
-- SQL FOR TIERS
------------------------------------------------------
-- Creation of tiers table
CREATE TABLE tiers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    libelle VARCHAR(255) NOT NULL,
    class VARCHAR(255) NOT NULL,
    compte_collectif varchar(255), 
    CONSTRAINT fk_compte_collectif FOREIGN KEY (compte_collectif) REFERENCES accounts(code) ON DELETE SET NULL
);
