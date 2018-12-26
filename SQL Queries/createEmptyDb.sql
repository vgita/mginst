 USE master
 GO

 --Create a database
 IF EXISTS(SELECT name FROM sys.databases
     WHERE name = 'VgitaDis2019') begin
	 ALTER DATABASE VgitaDis2019
	 SET SINGLE_USER WITH ROLLBACK IMMEDIATE
     DROP DATABASE VgitaDis2019 
	 end
 GO

 CREATE DATABASE VgitaDis2019
 GO

 use VgitaDis2019

DROP TABLE IF EXISTS WorksOn;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Children;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Departments;

CREATE TABLE Departments(
	Id int identity primary key,
	Name varchar(50)
)

CREATE TABLE Employees(
	Id int identity primary key,
	FullName varchar(100),
	Address varchar(200),
	DepartmentId int FOREIGN KEY (DepartmentId) REFERENCES Departments(Id) on DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Children(
	Id int identity primary key,
	FullName varchar(100),
	EmployeeId int not null FOREIGN KEY (EmployeeId) REFERENCES Employees(id) on DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Projects(
	Id int identity primary key,
	Name varchar(100),
	Description varchar(500),
	Duration int,
	DepartmentId int FOREIGN KEY (DepartmentId) REFERENCES Departments(Id) on DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE WorksOn(
	EmployeeId int not null,
	ProjectId int not null,
	Hours int not null,
	PRIMARY KEY (EmployeeId, ProjectId),
	FOREIGN KEY (EmployeeId) REFERENCES Employees ,
	FOREIGN KEY (ProjectId) REFERENCES Projects 
);