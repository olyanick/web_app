if NOT exists(select TABLE_NAME from INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'type_w')
BEGIN

CREATE table user			(
								id int(10) PRIMARY KEY,
								name varchar(20) NOT NULL,
								password varchar(20) NOT NULL,
								email varchar(20) NOT NULL,
								description varchar(20) NOT NULL,
								online varchar(20) NOT NULL,
								role varchar(20) NOT NULL,
								status varchar(20) NOT NULL,
								avatar varchar(20) NOT NULL,
								createdAt date,
								updatedAt date
							) 



CREATE table contact		(
								id int(10) PRIMARY KEY,
								sender int(11) FOREIGN KEY user(id),
								receiver int(11) FOREIGN KEY user(id),
								status varchar(20) NOT NULL,
								createdAt date,
								updatedAt date
							)


CREATE table dialog			(	
								creator int(11) FOREIGN KEY user(id),
								type varchar(255) NOT NULL,
								contact int(11) FOREIGN KEY contact(id),
								name varchar(255) NOT NULL,
								avatar longtext,
								id int(11) int PRIMARY KEY,
								createdAt date,
								updatedAt date
							)


CREATE table dialogmember	(	
								dialog int(11) FOREIGN KEY dialog(id),
								user int(11) FOREIGN KEY user(id),
								id int(10) PRIMARY KEY,
								createdAt date,
								updatedAt date
							)


CREATE table message		(	
								text varchar(255) NOT NULL,
								sender int(11) FOREIGN KEY user(id),
								dialog int(11) FOREIGN KEY dialog(id),
								id int(10) PRIMARY KEY,
								createdAt date,
								updatedAt date
							)

CREATE table group			(	
								name varchar(255) NOT NULL,
								user int(11) FOREIGN KEY user(id),
								id int(10) PRIMARY KEY,
								createdAt date,
								updatedAt date
							)

CREATE table groupmember	(	
								name varchar(255) NOT NULL,
								user int(11) FOREIGN KEY user(id),
								id int(10) PRIMARY KEY,
								createdAt date,
								updatedAt date
							)

CREATE table files			(	
								user int(11) FOREIGN KEY user(id),
								parent int(11) FOREIGN KEY files(id),
								name varchar(255) NOT NULL,
								type varchar(255) NOT NULL,
								access varchar(255) NOT NULL,
								download_link varchar(255) NOT NULL,
								size varchar(255) NOT NULL,
								id int(10) PRIMARY KEY,
								createdAt date,
								updatedAt date

							)

CREATE table fileaccess		(	
								file int(11) FOREIGN KEY files(id),
								group int(11) FOREIGN KEY group(id),
								id int(10) PRIMARY KEY,
								createdAt date,
								updatedAt date
							)

CREATE table user_schedule	(	
								user int(11) FOREIGN KEY user(id),
								text varchar(255) NOT NULL,
								details varchar(255) NOT NULL,
								complete tinyint(1),
								start_date varchar(255) NOT NULL,,
								end_date varchar(255) NOT NULL,,
								id int(10) PRIMARY KEY,
								createdAt date,
								updatedAt date
							)

END

ELSE

BEGIN

DROP TABLE user1 
DROP TABLE contact
DROP TABLE dialog
DROP TABLE dialogmember
DROP TABLE mesage
DROP TABLE group1
DROP TABLE groupmember
DROP TABLE files
DROP TABLE fileaccess
DROP TABLE user_schedule


END
