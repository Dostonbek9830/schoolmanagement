-- School Management Database Schema
-- Run this script in SQL Server Management Studio to create the Students table

USE SchoolDB;
GO

-- Create Students table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Students' AND xtype='U')
BEGIN
    CREATE TABLE Students (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        grade NVARCHAR(50) NOT NULL,
        age INT,
        phone NVARCHAR(20),
        address NVARCHAR(255),
        paymentStatus NVARCHAR(20) DEFAULT 'Unpaid',
        createdAt DATETIME DEFAULT GETDATE()
    );
    
    PRINT 'Students table created successfully';
END
ELSE
BEGIN
    PRINT 'Students table already exists';
END
GO

-- Create index on paymentStatus for faster filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_PaymentStatus' AND object_id = OBJECT_ID('Students'))
BEGIN
    CREATE INDEX IX_Students_PaymentStatus ON Students(paymentStatus);
    PRINT 'Index on paymentStatus created';
END
GO

-- Create index on grade for faster filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_Grade' AND object_id = OBJECT_ID('Students'))
BEGIN
    CREATE INDEX IX_Students_Grade ON Students(grade);
    PRINT 'Index on grade created';
END
GO

-- Insert sample data (optional - remove if you don't want sample data)
IF NOT EXISTS (SELECT * FROM Students)
BEGIN
    INSERT INTO Students (name, grade, age, phone, address, paymentStatus) VALUES
    ('John Doe', '10th Grade', 16, '123-456-7890', '123 Main St', 'Paid'),
    ('Jane Smith', '9th Grade', 15, '234-567-8901', '456 Oak Ave', 'Unpaid'),
    ('Mike Johnson', '11th Grade', 17, '345-678-9012', '789 Pine Rd', 'Paid');
    
    PRINT 'Sample data inserted';
END
GO

PRINT 'Database setup complete!';
