-- Drop existing tables if they exist
DROP TABLE IF EXISTS stock_data CASCADE;
DROP TABLE IF EXISTS stock_forecast CASCADE;
DROP TABLE IF EXISTS event_impact CASCADE;
DROP TABLE IF EXISTS repeating_events CASCADE;
DROP TABLE IF EXISTS event_dates CASCADE;
DROP TABLE IF EXISTS event_names CASCADE;
DROP TABLE IF EXISTS stock_companies CASCADE;
DROP TABLE IF EXISTS fashion_brands CASCADE;

-- Create a table for storing stock companies with a unique ID
CREATE TABLE stock_companies (
    id SERIAL PRIMARY KEY,
    stock_symbol VARCHAR(10) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL
);

-- Create a table for storing historical stock data
CREATE TABLE stock_data (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES stock_companies(id),
    date DATE NOT NULL,
    close_price NUMERIC NOT NULL
);

-- Create a table for storing forecasted stock data
CREATE TABLE stock_forecast (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES stock_companies(id),
    forecast_date DATE NOT NULL,
    forecast_price NUMERIC NOT NULL
);

-- Create a table for storing event impact data
CREATE TABLE event_impact (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES stock_companies(id),
    event_date DATE NOT NULL,
    event TEXT,
    pre_event_price NUMERIC,
    post_event_price NUMERIC,
    impact NUMERIC
);

-- Create the event_names table
CREATE TABLE event_names (
    id SERIAL PRIMARY KEY,
    description TEXT UNIQUE NOT NULL
);

-- Create the event_dates table
CREATE TABLE event_dates (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES event_names(id),
    event_date DATE NOT NULL
);

-- Create the repeating_events table
CREATE TABLE repeating_events (
    id SERIAL PRIMARY KEY,
    event_name_id INTEGER NOT NULL REFERENCES event_names(id),
    event_date_id INTEGER NOT NULL REFERENCES event_dates(id),
    event_date DATE NOT NULL,
    stock_id INTEGER NOT NULL REFERENCES stock_companies(id),
    stock_price NUMERIC NOT NULL
);

-- Create a table for storing fashion brands and their associated stock symbol
CREATE TABLE fashion_brands (
    id SERIAL PRIMARY KEY,
    stock_symbol VARCHAR(10) NOT NULL REFERENCES stock_companies(stock_symbol),
    brand_name VARCHAR(255) NOT NULL
);

-- Insert sample data into stock_companies
INSERT INTO stock_companies (stock_symbol, company_name) VALUES
('LVMUY', 'Louis Vuitton'),
('PPRUY', 'Kering (owns brands like Gucci)'),
('NKE', 'Nike'),
('HESAY', 'Hermès'),
('BURBY', 'Burberry'),
('PRDSY', 'Prada'),
('RL', 'Ralph Lauren'),
('CPRI', 'Capri Holdings (Michael Kors, Versace, Jimmy Choo)'),
('TPR', 'Tapestry (Coach, Kate Spade, Stuart Weitzman)');

-- Insert sample data into fashion_brands
INSERT INTO fashion_brands (stock_symbol, brand_name) VALUES
('LVMUY', 'Louis Vuitton'),
('LVMUY', 'Dior'),
('PPRUY', 'Gucci'),
('PPRUY', 'Yves Saint Laurent'),
('NKE', 'Nike'),
('HESAY', 'Hermès'),
('BURBY', 'Burberry'),
('PRDSY', 'Prada'),
('RL', 'Ralph Lauren'),
('CPRI', 'Michael Kors'),
('CPRI', 'Versace'),
('CPRI', 'Jimmy Choo'),
('TPR', 'Coach'),
('TPR', 'Kate Spade'),
('TPR', 'Stuart Weitzman');
