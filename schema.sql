-- GreenChain MVP Database Schema
-- Run this file to create all tables in the correct order

-- 1. Organisations
CREATE TABLE organisations (
    organisation_id VARCHAR PRIMARY KEY,
    name            VARCHAR NOT NULL
);

-- 2. Users
CREATE TABLE users (
    user_id         VARCHAR PRIMARY KEY,
    email           VARCHAR NOT NULL UNIQUE,
    password_hash   VARCHAR NOT NULL,
    role            VARCHAR NOT NULL CHECK (role IN ('UPLOADER', 'AUDITOR', 'VIEWER')),
    organisation_id VARCHAR NOT NULL REFERENCES organisations(organisation_id)
);

-- 3. Buildings
CREATE TABLE buildings (
    building_id     VARCHAR PRIMARY KEY,
    name            VARCHAR NOT NULL,
    organisation_id VARCHAR NOT NULL REFERENCES organisations(organisation_id)
);

-- 4. Submissions
CREATE TABLE submissions (
    submission_id   VARCHAR PRIMARY KEY,
    building_id     VARCHAR NOT NULL REFERENCES buildings(building_id),
    organisation_id VARCHAR NOT NULL REFERENCES organisations(organisation_id),
    uploader_id     VARCHAR NOT NULL REFERENCES users(user_id),
    reporting_period VARCHAR NOT NULL,
    original_filename VARCHAR NOT NULL,
    status          VARCHAR NOT NULL DEFAULT 'UNREVIEWED' CHECK (status IN ('UNREVIEWED', 'APPROVED', 'REJECTED')),
    storage_key     VARCHAR NOT NULL,
    sha256          VARCHAR NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. Metrics
CREATE TABLE metrics (
    metric_id       VARCHAR PRIMARY KEY,
    submission_id   VARCHAR NOT NULL REFERENCES submissions(submission_id),
    metric_name     VARCHAR NOT NULL,
    value           NUMERIC NOT NULL,
    unit            VARCHAR NOT NULL,
    reporting_period VARCHAR NOT NULL
);

-- 6. Reviews
CREATE TABLE reviews (
    review_id       VARCHAR PRIMARY KEY,
    submission_id   VARCHAR NOT NULL REFERENCES submissions(submission_id),
    auditor_id      VARCHAR NOT NULL REFERENCES users(user_id),
    decision        VARCHAR NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED')),
    reason          VARCHAR,
    notes           VARCHAR,
    reviewed_at     TIMESTAMP NOT NULL DEFAULT NOW()
);