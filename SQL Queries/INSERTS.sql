---Create temporary seed tables with data from local system
USE VgitaDis2019 
GO

DROP TABLE IF EXISTS #NamesTemp
Create table #NamesTemp(year int,name varchar(50),percents varchar(10),sex varchar(10))

bulk insert  #NamesTemp
from 'D:\Dis\names.csv'
with (FIRSTROW = 2, fieldterminator = ',', rowterminator = '\n')
go

--SELECT * FROM #NamesTemp

DROP TABLE IF EXISTS #AddressesTemp
Create table #AddressesTemp(street varchar(50),city varchar(30),zip varchar(30),long varchar(20),lat varchar(20),quality varchar(50),match varchar(30),success varchar(30),error varchar(30))

bulk insert  #AddressesTemp
from 'D:\Dis\addresses.csv'
with (FIRSTROW = 2, fieldterminator = ',', rowterminator = '\n')
go

--SELECT * FROM #AddressesTemp


--Departments table
DELETE FROM Departments

DECLARE @DepNames varchar(500)
SET @DepNames = 'Executive,Marketing,Finance,Management,IT,Sales,Production,Human Resources'

WHILE len(@DepNames) > 0
BEGIN
	INSERT INTO Departments(Name) VALUES (left(@DepNames, charindex(',', @DepNames+',')-1))
	--print left(@DepNames, charindex(',', @DepNames+',')-1)
	SET @DepNames = stuff(@DepNames, 1, charindex(',', @DepNames+','), '')
END



--Employees table
DELETE FROM Employees

DECLARE @Cursor int
SET @Cursor = 500;
WHILE (@Cursor > 0)
BEGIN
	DECLARE @FullName varchar(30)
	SELECT @FullName =  STRING_AGG(x.name, ' ')
	FROM (SELECT TOP 2 name FROM #NamesTemp TABLESAMPLE(1 PERCENT) order by NEWID()) as x

	DECLARE @FullAddress varchar(200)
	SELECT @FullAddress = STRING_AGG('City: ' + x.city + ', Street: '+ x.street+ ', Zip Code: '+ x.zip, ' ')
	FROM (SELECT TOP 1 * FROM 
	#AddressesTemp TABLESAMPLE(1 PERCENT) order by NEWID()) as x

	declare @EmpDeptId int
	SET @EmpDeptId = (SELECT TOP 1 Id FROM Departments order by NEWID())

	INSERT INTO Employees(FullName, Address, DepartmentId) VALUES 
	(@FullName, @FullAddress, @EmpDeptId)
	 
	SET @Cursor = @Cursor - 1;
END
go

--Children Table
DECLARE @Cursor int
--SET @Cursor = 50
SET @Cursor = 500
print @Cursor
WHILE(@Cursor >0)
BEGIN
	DECLARE @RandomChildrenNumber int;
	--between 3 and 0
	SET @RandomChildrenNumber = ROUND(((3 - 1) * RAND()), 0)

	DECLARE @EmployeeId int
	SET @EmployeeId = (SELECT TOP 1 Id FROM Employees order by NEWID())

	WHILE(@RandomChildrenNumber > 0)
	BEGIN
		DECLARE @FullName varchar(30)
		SELECT @FullName =  STRING_AGG(x.name, ' ')
		FROM (SELECT TOP 2 name FROM #NamesTemp TABLESAMPLE(1 PERCENT) order by NEWID()) as x

		INSERT INTO Children(FullName, EmployeeId) VALUES (@FullName, @EmployeeId)
		SET @RandomChildrenNumber = @RandomChildrenNumber - 1;
	END

	SET @Cursor = @Cursor - 1;
END
go

--Projects Table
DECLARE @Cursor int
SET @Cursor = 1000
WHILE(@Cursor > 0)
BEGIN
	DECLARE @RandomProjectDuration int
	-- a project can be between 1 and 24 months
	SET @RandomProjectDuration =  ROUND(((24 - 1) * RAND() + 1), 0);

	DECLARE @DepartmentId int
	SET @DepartmentId = (SELECT TOP 1 Id FROM Departments order by NEWID())
	
	INSERT INTO Projects (Name, Description, Duration, DepartmentId) VALUES ('Project'+ CONVERT(varchar(2), @Cursor), 'Description'+ CONVERT(varchar(2), @Cursor),@RandomProjectDuration,@DepartmentId )

	SET @Cursor = @Cursor - 1;
END
go


--WorksOn table
-- CAN be employees that are not assigned to projects and projects that are not started
DECLARE @ProjectId int

DECLARE MY_CURSOR CURSOR
	LOCAL STATIC READ_ONLY FORWARD_ONLY
FOR
SELECT DISTINCT Id
FROM (SELECT TOP 98 PERCENT * FROM Projects ORDER BY Duration DESC) as prjs

OPEN MY_CURSOR
FETCH NEXT FROM MY_CURSOR INTO @ProjectId
WHILE @@FETCH_STATUS = 0
BEGIN
	DECLARE @RandomWorkingPersonsCount int;
	-- 8-0 persons can work at a project
	SET @RandomWorkingPersonsCount = ROUND(((7 - 1) * RAND()), 0)

	WHILE(@RandomWorkingPersonsCount > 0)
	BEGIN
	
		DECLARE @EmployeeId int
		SET @EmployeeId = (SELECT TOP 1 Id FROM Employees order by NEWID())

		DECLARE @RandomWorkingHours int
		SET @RandomWorkingHours =  ROUND(((8 - 1) * RAND() + 1), 0);

		INSERT INTO WorksOn VALUES (@EmployeeId, @ProjectId, @RandomWorkingHours)

		SET @RandomWorkingPersonsCount = @RandomWorkingPersonsCount - 1;
	END

	FETCH NEXT FROM MY_CURSOR INTO @ProjectId
END
CLOSE MY_CURSOR
DEALLOCATE MY_CURSOR