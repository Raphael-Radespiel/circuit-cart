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

INSERT INTO Products (Title, Description, AmountInStock, ProductType, Price, ImageFile)
VALUES ('Resistor 1/4W ‑ 1,0 Ohm', 'A resistor is a passive two-terminal electrical component that implements electrical resistance as a circuit element. In electronic circuits, resistors are used to reduce current flow, adjust signal levels, to divide voltages, bias active elements, and terminate transmission lines, among other uses.', 5000, 'component', 2, 'resistor.jpg'),
('NPN Transistor 65 components', 'A transistor is a semiconductor device used to amplify or switch electrical signals and power. It is one of the basic building blocks of modern electronics. It is composed of semiconductor material, usually with at least three terminals for connection to an electronic circuit. A voltage or current applied to one pair of the transistor''s terminals controls the current through another pair of terminals.', 10238, 'component', 40, 'transistor.jpg'),
('Diode 100 components', 'A diode is a two-terminal electronic component that conducts current primarily in one direction (asymmetric conductance); it has low (ideally zero) resistance in one direction, and high (ideally infinite) resistance in the other.', 548, 'component', 1, 'diode.jpg');
