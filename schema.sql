CREATE TABLE Products (
  ProductID int NOT NULL AUTO_INCREMENT,
  Title varchar(100) NOT NULL,
  Description text NOT NULL,
  AmountInStock int,
  ProductTag varchar(20) NOT NULL,
  ProductTypes int NOT NULL, --I'll have to create an interface for the resistances and other variable values for the components
  Price int NOT NULL, 
  ImageFile varchar(254) NOT NULL,
  PRIMARY KEY (ProductID)
);

CREATE TABLE Orders (
  OrderID int NOT NULL,
  ID int NOT NULL AUTO_INCREMENT,
  Product int NOT NULL,
  ProductType varchar(100) NOT NULL,
  Amount int NOT NULL,
  Price int NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE UserToOrderInterface (
  ID int NOT NULL AUTO_INCREMENT,
  UserID int NOT NULL,
  OrderID int NOT NULL,
  OrderDate date NOT NULL, 
  PaymentDate date,
  isPayed boolean NOT NULL,
  --Include Payment Boleto numbers and other means of payment 
  ArivalDate date,
  PRIMARY KEY (ID)
);

CREATE TABLE ProductTypeInterface (
  ID int NOT NULL,
  ProductID int NOT NULL,
  Type varchar(100) NOT NULL, 
  PRIMARY KEY (ID)
);
