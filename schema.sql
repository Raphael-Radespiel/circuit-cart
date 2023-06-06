CREATE TABLE Products (
  ProductID int NOT NULL AUTO_INCREMENT,
  Title varchar(100) NOT NULL,
  Description text NOT NULL,
  AmountInStock int,
  ProductType varchar(20) NOT NULL,
  Price int NOT NULL, 
  ImageFile varchar(254) NOT NULL,
  PRIMARY KEY (ProductID)
);

CREATE TABLE User (
  --ID WILL BE USED TO SEE ADDRESS TABLE AND PAYMENT TABLE
  --THIS FIRST PART OF THE USER WILL BE FOR CREATING THE ACCOUNT
  ID int NOT NULL AUTO_INCREMENT,
  Email varchar(320) NOT NULL,
  Password text NOT NULL, 
  isActive boolean NOT NULL,
  VerificationToken varchar(64),
  VerificationTimeLimit bigint,
  SessionID VARCHAR(64), 
  
  PRIMARY KEY (ID)
);
