<?php
// migrate.php - run the SQL in schema.sql using PDO
require_once __DIR__ . '/db.php';

$sql = file_get_contents(__DIR__ . '/schema.sql');
try {
    $pdo->exec($sql);
    echo "Migration completed.\n";
} catch (\PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
