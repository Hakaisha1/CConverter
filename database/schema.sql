
-- FOR DEV ONLY DELETE ON PROD!!!!!!!!!!!!!!!!!!
DROP TABLE IF EXISTS conversions;
DROP TABLE IF EXISTS exchange_rates;


CREATE TABLE conversions (
  id SERIAL PRIMARY KEY,
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  result DECIMAL(15,2) NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_amount_positive CHECK (amount > 0),
  CONSTRAINT check_result_positive CHECK (result >= 0),
  CONSTRAINT check_rate_positive CHECK (rate > 0)
);

CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  base_currency VARCHAR(3) NOT NULL,
  target_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_rate_cache_positive CHECK (rate > 0),
  CONSTRAINT unique_currency_pair UNIQUE (base_currency, target_currency)
);

CREATE INDEX idx_conversions_date ON conversions(created_at DESC);
CREATE INDEX idx_conversions_currencies ON conversions(from_currency, to_currency);
CREATE INDEX idx_rates_pair ON exchange_rates(base_currency, target_currency);
CREATE INDEX idx_rates_updated ON exchange_rates(updated_at);

COMMENT ON TABLE conversions IS 'Stores all currency conversion transactions';
COMMENT ON TABLE exchange_rates IS 'Caches exchange rates from external API to reduce API calls';

COMMENT ON COLUMN conversions.amount IS 'Original amount to convert';
COMMENT ON COLUMN conversions.result IS 'Converted amount';
COMMENT ON COLUMN conversions.rate IS 'Exchange rate used for this conversion';

COMMENT ON COLUMN exchange_rates.rate IS 'Current exchange rate';
COMMENT ON COLUMN exchange_rates.updated_at IS 'Last time this rate was fetched from API';

-- Sample Data Insertion 
/*
INSERT INTO exchange_rates (base_currency, target_currency, rate) VALUES
('USD', 'EUR', 0.85),
('USD', 'GBP', 0.73),
('USD', 'IDR', 15700.00),
('EUR', 'USD', 1.18),
('EUR', 'IDR', 18500.00);

INSERT INTO conversions (from_currency, to_currency, amount, result, rate) VALUES
('USD', 'IDR', 100.00, 1570000.00, 15700.00),
('EUR', 'USD', 50.00, 59.00, 1.18),
('USD', 'EUR', 200.00, 170.00, 0.85);
*/

-- Verify 
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

