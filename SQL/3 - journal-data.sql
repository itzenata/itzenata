INSERT INTO
    journals (
        id,
        name,
        type,
        status,
        total_operations,
        total_value,
        last_edit_user
    )
VALUES
    (1, 'Ventes', 'Sales', 'Active', 500, 500000.00, 'System'),
    (2, 'Achats', 'Purchases', 'Active', 300, 300000.00, 'System'),
    (3, 'Trésorerie', 'Treasury', 'Active', 200, 200000.00, 'System'),
    (4, 'Paie', 'Payroll', 'Active', 100, 150000.00, 'System'),
    (5, 'Immobilisations', 'Assets', 'Active', 50, 75000.00, 'System');
