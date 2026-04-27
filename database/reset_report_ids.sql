-- Reset Report IDs to start from 1 and renumber sequentially
USE PipeDamageMonitoringSystem;

-- First, disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Get all reports ordered by their current ID
-- Create a temporary table to hold the data
CREATE TEMPORARY TABLE temp_reports AS
SELECT Report_ID, Reporter_Name, Photo, Description, DateTime, Location, Current_Status, Resident_ID, Water_Work_Staff_ID
FROM DAMAGEREPORT
ORDER BY Report_ID;

-- Delete all reports
DELETE FROM DAMAGEREPORT;

-- Reset the auto-increment counter to 1
ALTER TABLE DAMAGEREPORT AUTO_INCREMENT = 1;

-- Re-insert the reports with new sequential IDs
INSERT INTO DAMAGEREPORT (Reporter_Name, Photo, Description, DateTime, Location, Current_Status, Resident_ID, Water_Work_Staff_ID)
SELECT Reporter_Name, Photo, Description, DateTime, Location, Current_Status, Resident_ID, Water_Work_Staff_ID
FROM temp_reports
ORDER BY Report_ID;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify the results
SELECT * FROM DAMAGEREPORT;

-- Drop temporary table
DROP TEMPORARY TABLE temp_reports;

-- Display the final state
SELECT COUNT(*) as Total_Reports FROM DAMAGEREPORT;
