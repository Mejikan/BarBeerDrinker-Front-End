SELECT * FROM BarBeerDrinker.transaction t
WHERE t.trans_id = 2
LIMIT 20;

SELECT * FROM BarBeerDrinker.transaction t
WHERE t.drinker = 'Catherine Faulkner'
ORDER BY t.bar, t.time;
# group by does a have compression

SELECT * FROM BarBeerDrinker.transaction t
WHERE t.drinker = 'Catherine Faulkner';

SELECT bc.item, COUNT(*) as amount
FROM BarBeerDrinker.billContains bc
WHERE bc.trans_id IN
(SELECT t.trans_id FROM BarBeerDrinker.transaction t
WHERE t.drinker = 'Catherine Faulkner')
GROUP BY bc.item
ORDER BY amount DESC;

# Find all items bought by a drinker ordered by most bought LEFT JOIN with type
SELECT item, item_type, amount FROM
(SELECT bc.item, COUNT(*) as amount
FROM BarBeerDrinker.billContains bc
WHERE bc.trans_id IN
(SELECT t.trans_id FROM BarBeerDrinker.transaction t
WHERE t.drinker = 'Catherine Faulkner')
GROUP BY bc.item
ORDER BY amount DESC) i1
LEFT JOIN BarBeerDrinker.items i2 ON i2.item_name = i1.item;

# spending at different bars on different days
SELECT *, SUM(t.total) as total_paid
FROM BarBeerDrinker.transaction t
WHERE t.drinker = 'Catherine Faulkner' AND t.day = 5
GROUP BY t.bar;