-- Insert into company
INSERT INTO
    company (
        id,
        name,
        image_url,
        status,
        capital,
        employees,
        founded_on,
        activity,
        legal_form,
        comment,
        address,
        additional_info,
        phone,
        email,
        website,
        vat_identifier,
        if_id,
        ice,
        rc,
        cnss,
        declaration_regime,
        payment_mode,
        debut_encaissement
    )
VALUES
    (1, 'Google', 'https://logo.clearbit.com/google.com', 'active', 1500000.00, 10000, '1998-09-04', 'Technology', 'SA', 'Global leader in search & advertising.', '1600 Amphitheatre Parkway, Mountain View, CA', 'Known for Android & Google Cloud.', '800-123-4567', 'contact@google.com', 'https://www.google.com', 123456789, 123456, 789123, 456789, 12345, 'Trimistiel', 'Encaissement', 'immediate'),
    (2, 'Microsoft', 'https://logo.clearbit.com/microsoft.com', 'active', 2000000.00, 200000, '1975-04-04', 'Software & Technology', 'SA', 'Global software company known for Windows and Azure.', '1 Microsoft Way, Redmond, WA', 'Leader in enterprise cloud services.', '800-555-1234', 'contact@microsoft.com', 'https://www.microsoft.com', 987654321, 654321, 123456, 987654, 67890, 'Monsieul', 'Debut', 'deferred'),
    (3, 'Apple', 'https://logo.clearbit.com/apple.com', 'active', 2500000.00, 150000, '1976-04-01', 'Consumer Electronics', 'SARL', 'Innovative tech company known for iPhones.', '1 Infinite Loop, Cupertino, CA', 'Pioneers in consumer devices.', '800-234-5678', 'contact@apple.com', 'https://www.apple.com', 123456782, 321654, 987321, 654987, 54321, 'Trimistiel', 'Encaissement', 'immediate');

