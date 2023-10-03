
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- update his account type

UPDATE account SET account_type = 'Admin'
WHERE account_id = 1;

-- Remove his record

DELETE
FROM account
WHERE account_firstname = 'Tony';

-- Update Hummer description

UPDATE
    inventory
SET
    inv_description = REPLACE(
        inv_description, 'the small interiors', 'a huge interior'
    )
WHERE
    inv_id = 10;

-- Inner Join 

SELECT inv_make, inv_model, classification_name
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_id = 2;

-- Added '/vehicles'

UPDATE
    inventory
SET
    inv_image = REPLACE(
        inv_image, 'images/', 'images/vehicles/'
    ),
    inv_thumbnail = REPLACE(
        inv_thumbnail, 'images/', 'images/vehicles/'
    );