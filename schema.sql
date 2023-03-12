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
