


--Q1. Display all details about employees that work in a certain department.  ONE JOIN
SET STATISTICS IO, TIME ON;
GO

SELECT e.Id, e.FullName, e.Address
FROM Employees e INNER JOIN Departments d on e.DepartmentId = d.Id
WHERE d.Name = 'Executive'

SET STATISTICS IO, TIME OFF;
GO

--Q2. Display all details about employees that work in a certain department at a named project  THREE JOINS
SET STATISTICS IO, TIME ON;
GO

SELECT e.Id, e.FullName, e.Address, p.Name
FROM Employees e INNER JOIN
	 Departments d on e.DepartmentId = d.Id INNER JOIN
	 WorksOn wo on e.Id = wo.EmployeeId INNER JOIN
	 Projects p on p.Id = wo.ProjectId
Where d.Name = 'IT' AND p.Name = 'Project78'

SET STATISTICS IO, TIME OFF;
GO

--Q3. Display all details about the projects where an employee is working   TWO JOINS
SET STATISTICS IO, TIME ON;
GO

SELECT p.Name, p.Description, p.Duration, p.DepartmentId
FROM Projects p INNER JOIN WorksOn wo on p.Id = wo.ProjectId
				INNER JOIN Employees e on wo.EmployeeId = e.Id
Where e.Id = 201

SET STATISTICS IO, TIME OFF;
GO

--Q4. Display all details about the projects that run in a named department
SET STATISTICS IO, TIME ON;
GO

SELECT p.Name, p.Description, p.Duration
FROM Projects p INNER JOIN Departments d on p.DepartmentId = d.Id
Where d.Name = 'Finance'

SET STATISTICS IO, TIME OFF;
GO


--Q5. Display all details of employees who have a certain number of children
SET STATISTICS IO, TIME ON;
GO

SELECT e.Id, e.FullName, e.Address
FROM Employees e INNER JOIN Children c on e.Id = c.EmployeeId
GROUP BY e.Id,  e.FullName, e.Address
HAVING Count(*) = 1

SET STATISTICS IO, TIME OFF;
GO