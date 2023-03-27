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

CREATE TABLE Orders (
  OrderID int NOT NULL,
  ID int NOT NULL AUTO_INCREMENT,
  Product int NOT NULL,
  ProductType varchar(100) NOT NULL,
  Amount int NOT NULL,
  Price int NOT NULL,
  PRIMARY KEY (ID)
);
