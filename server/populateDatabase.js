const dotenv = require("dotenv").config().parsed;

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: dotenv.DB_HOST,
  user: dotenv.DB_USER,
  password: dotenv.DB_PASSWORD,
  database: dotenv.DB_NAME
});

connection.connect((err) => {
  try{
    if(err){
      throw err;
    }

    console.log("MySQL connected");

    // SET SCHEMA
    setDatabaseSchema();
    console.log("SETTING DATABASE SCHEMA COMPLETE!");

    // POPULATE SCHEMA
    populateDatabase();
    console.log("POPULATING DATABASE COMPLETE!");
  }
  catch(err){
    console.log(err);
  }

  connection.end();
});

function setDatabaseSchema(){
  setProductsSchema();   
  setUserSchema();
}

function setProductsSchema(){
  const queryString = `
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
  `;

  connection.query(queryString, (err) => {
    if(err) throw err;
  });
  console.log("Product Schema Set!");
}

function setUserSchema(){
  const queryString = `
    CREATE TABLE User (
      ID int NOT NULL AUTO_INCREMENT,
      Email varchar(320) NOT NULL,
      Password text NOT NULL, 
      isActive boolean NOT NULL,
      VerificationToken varchar(64),
      VerificationTimeLimit bigint,
      SessionID VARCHAR(64), 
      PRIMARY KEY (ID)
    );
  `;

  connection.query(queryString, (err) => {
    if(err) throw err;
  });
  console.log("User Schema Set!");
}

function populateDatabase(){
  populateProducts();
}

// TODO:
// CHANGE AMOUNTINSTOCK AS AMOUNT PER PRICE
function populateProducts(){
  const queryString = `
    INSERT INTO Products 

    (Title, Description, AmountInStock, ProductType, Price, ImageFile)

    VALUES 

    ('Resistor set', 'This comprehensive set includes a wide range of resistors with different resistance values and wattages, making it perfect for building electronic circuits and experimenting with different resistance values.', 500, 'component', 15, 'resistor.jpg'),

    ('Transistor Assortment', 'This collection of transistors includes both NPN and PNP types, making it suitable for amplifiers, switching circuits, and other electronic applications where transistors are required.', 150, 'component', 10, 'transistor.jpg'),

    ('Diode Set', 'This set of diodes includes commonly used types such as rectifier diodes, Zener diodes, and Schottky diodes, making it suitable for a wide range of circuit designs and applications.', 200, 'component', 8, 'diode.jpg'),

    ('Capacitor Assortment', 'This assortment of capacitors features various capacitance values and types, including ceramic, electrolytic, and tantalum capacitors, providing versatility for different circuit applications.', 300, 'component', 12, 'capacitor.jpg'),

    ('Toggle Switches', 'A diode is a two-terminal electronic component that conducts current primarily in one direction (asymmetric conductance); it has low (ideally zero) resistance in one direction, and high (ideally infinite) resistance in the other.', 548, 'component', 1, 'toggle-switch.jpg'),

    ('Batteries', 'A diode is a two-terminal electronic component that conducts current primarily in one direction (asymmetric conductance); it has low (ideally zero) resistance in one direction, and high (ideally infinite) resistance in the other.', 548, 'component', 1, 'batteries.jpg'),

    ('LED Assortment', 'This assortment of LEDs features different colors, sizes, and brightness levels, providing options for lighting and display applications in electronic projects.', 100, 'component', 6, 'led-assortment.png'),

    ('Integrated Circuit (IC) Collection', 'This collection includes commonly used ICs such as operational amplifiers, timers, and voltage regulators, providing versatility for a variety of circuit designs and functions.', 50, 'component', 20, 'ic-collection.png'),

    ('Inductor Set', 'This set of inductors includes different inductance values and types, such as axial and radial inductors, making it suitable for use in RF circuits, filters, and other electronic applications.', 50, 'component', 8, 'inductor-set.png'),

    ('Potentiometer Collection', 'This collection of potentiometers includes linear and logarithmic taper types, providing options for adjusting resistance in electronic circuits for volume control, brightness control, or other applications.', 10, 'component', 10, 'potentiometer-collection.png'),

    ('Connector Assortment', 'This assortment of connectors includes headers, terminals, and sockets, making it useful for making reliable connections in electronic circuits or interfacing with other components for data or power transfer.', 100, 'component', 6, 'connector-assortment.png'),

    ('Fuse Assortment', 'This collection of fuses includes different current ratings and types, such as glass and blade fuses, providing protection for electronic circuits from overcurrent and ensuring safe operation.', 50, 'component', 5, 'fuse-assortment.png'),

    ('Crystal Oscillator Set', 'This set of crystal oscillators includes different frequencies and packages, making it suitable for use in clock circuits, microcontrollers, and other timing applications where precise frequency control is required.', 20, 'component', 8, 'crystal-oscillator-set.png'),

    ('ESD-Safe Storage Containers', 'These containers are designed to store electronic components safely, protecting them from static electricity and environmental damage.', 1, 'accessory', 15, 'esd-container.png'),

    ('ESD-Safe Mat', 'This mat helps to prevent static electricity from damaging electronic components and provides a safe work surface for assembling and testing circuits.', 1, 'accessory', 15, 'esd-mat.png'),

    ('Heat Shrink Tubing Assortment', 'This assortment includes heat shrink tubing of various sizes and colors, ideal for insulating and protecting wires and connections in electronic circuits.', 160, 'accessory', 20, 'heat-shrink-tube.png'),

    ('Helping Hands', 'These adjustable alligator clip stands with magnifying glass and LED light are perfect for holding components in place while soldering or working on intricate electronic projects.', 1, 'accessory', 12, 'helping-hands.png'),

    ('ESD Anti-Static Wrist Strap', 'This wrist strap helps protect sensitive electronic components from electrostatic discharge (ESD), ensuring safe handling during assembly, testing, and repair tasks.', 1, 'accessory', 8, 'esd-strap.png'),

    ('Component Storage Box', 'This organizer box with multiple compartments is perfect for storing and sorting small electronic components such as resistors, capacitors, and diodes, keeping them organized and easily accessible.', 1, 'accessory', 13, 'storage-box.png'),

    ('Soldering Flux', 'This flux facilitates soldering by improving solder flow and reducing oxidation, making it essential for achieving high-quality solder joints in electronic assemblies.', 1, 'accessory', 6, 'soldering-flux.png'),

    ('Battery Holder', 'This holder is designed to securely hold batteries of various sizes, providing a reliable power source for electronic circuits or DIY projects.', 1, 'accessory', 3, 'battery-holder.png'),

    ('Breadboard', 'This classic prototyping tool allows for quick and easy circuit assembly without soldering, making it ideal for experimenting and testing electronic circuits.', 1, 'prototyping', 6, 'breadboard.png'),

    ('Jumper Wires', 'This set of male-to-male, female-to-female, and male-to-female jumper wires provides flexibility for making connections on breadboards or PCBs, facilitating circuit building and testing.', 120, 'prototyping', 5, 'jumper-wires.png'),
    
    ('Perfboard', 'This versatile prototyping board features a grid of holes for soldering components, making it suitable for creating custom circuit layouts and prototypes.', 1, 'prototyping', 3, 'perfboard.png'),
    
    ('Prototyping Shield for Arduino', 'This shield fits on top of an Arduino board, providing a convenient prototyping area with soldering pads and headers for adding custom circuits and components.', 1, 'prototyping', 10, 'arduino-shield.png'),
    
    ('IC Socket Assortment', 'This assortment includes various sizes of IC sockets, providing a convenient way to easily insert, remove, and replace integrated circuits during prototyping or testing.', 1, 'prototyping', 7, 'ic-socket.png'),
    
    ('Prototype Enclosure', 'This enclosure provides a protective and organized housing for a custom prototype circuit, allowing for easy testing and development.', 1, 'prototyping', 13, 'enclosure.png'),

    ('Desoldering Pump', 'This tool allows for easy removal of solder from circuit boards and components, making it essential for repair and rework tasks.', 1, 'tool', 6, 'desoldering-pump.png'),

    ('Multimeter', 'This versatile tool measures voltage, current, resistance, and other electrical parameters, making it essential for troubleshooting, testing, and debugging electronic circuits.', 1, 'tool', 12, 'multimeter.png'),

    ('Wire Stripper', 'This tool is used for removing the insulation from wires, making it easier to solder and connect components.', 1, 'tool', 7, 'wire-stripper.png'),

    ('Tweezers Set', 'This set includes various types of tweezers, such as straight, curved, and pointed tips, which are useful for handling small electronic components.', 1, 'tool', 6, 'tweezer-set.png'),

    ('Flush Cutter', 'This tool is used for cleanly cutting leads, wires, and other small parts in electronic circuits.', 1, 'tool', 7, 'flush-cutter.png'),

    ('Soldering Station', 'This handy soldering station has all the tools you will ever need to repair and build electronic circuits.', 1, 'tool', 24, 'soldering-station.png'),

    ('Heat Gun', 'This tool is used for applying heat to shrink tubing, remove adhesives, or activate heat-sensitive components.', 1, 'tool', 16, 'heat-gun.png'),

    ('PCB Cleaning Brush', 'This brush is specifically designed for cleaning circuit boards and components, helping to remove dust, dirt, and debris.', 1, 'tool', 3, 'pcb-brush.png'),

    ('Precision Screwdriver Set', 'This set includes various sizes and types of screwdrivers, suitable for disassembling and assembling electronic devices.', 1, 'tool', 10, 'screwdriver-set.png'),

    ('PCB Holder', 'This tool provides a stable and adjustable platform for holding and positioning circuit boards during soldering or testing.', 1, 'tool', 10, 'pcb-holder.png'),

    ('Arduino Starter Kit', 'This kit includes an Arduino board, various sensors, actuators, and other components for beginners to learn and experiment with Arduino-based projects.', 1, 'kit', 70, 'arduino-kit.png'),

    ('Raspberry Pi Kit', 'This kit includes a Raspberry Pi board, power supply, SD card, and other accessories for building projects with Raspberry Pi, a popular single-board computer.', 1, 'kit', 100, 'raspberry-pi-kit.png'),

    ('Electronics Learning Kit', 'This kit is designed for beginners to learn and experiment with electronics, providing a variety of components, a breadboard, and instructional materials for building and testing circuits.', 1, 'kit', 35, 'learning-kit.png'),

    ('DIY Synth Kit', 'This kit includes components and instructions for building a DIY synthesizer, allowing users to learn about sound synthesis and create their own electronic music.', 1, 'kit', 65, 'synth-kit.png'),

    ('Solar Power Kit', 'This kit includes components such as solar panels, charge controller, battery, and other accessories for building a solar-powered system, allowing users to learn about renewable energy and build their own solar projects.', 1, 'kit', 125, 'solar-cell.png'),

    ('Audio Amplifier Kit', 'This kit includes components for building an audio amplifier, providing an opportunity to learn about audio electronics and build their own audio projects, such as speakers or headphone amplifiers.', 1, 'kit', 35, 'amp-kit.png'),

    ('FM Radio Kit', 'This kit includes components for building an FM radio receiver, allowing users to learn about radio electronics and listen to their favorite FM stations.', 1, 'kit', 20, 'fm-radio-kit.png'),

    ('Electronic Dice Kit', 'This kit includes components for building an electronic dice, a fun and educational project that involves assembling and programming a device that simulates rolling dice.', 1, 'kit', 25, 'dice-kit.png'),

    ('DIY Oscilloscope Kit', 'This kit includes components for building a DIY oscilloscope, a commonly used tool in electronics for measuring and visualizing electrical signals, providing an opportunity to learn about oscilloscope operation and circuitry.', 1, 'kit', 100, 'oscilloscope-kit.png'),

    ('DC Motor', 'This motor is commonly used in electronic projects for various applications, such as robotics, automation, and motorized devices.', 1, 'motor', 3, 'dc-motor.jpg'),

    ('Servo Motor', 'This motor is designed for precise control of angular or linear movement and is commonly used in robotics, drones, and other applications that require accurate positioning.', 1, 'motor', 5, 'servo-motor.png'),

    ('Stepper Motor', 'This motor is used for precise control of rotation in steps or increments and is commonly used in CNC machines, 3D printers, and other applications that require precise motion control.', 1, 'motor', 20, 'stepper-motor.png'),

    ('Gear Motor', 'This motor is equipped with gears for increased torque and is commonly used in applications that require high torque and low-speed rotation, such as robotic arms and conveyor belts.', 1, 'motor', 12, 'gear-motor.png'),

    ('Vibration Motor', 'This motor is used for generating vibrations in electronic devices, such as smartphones, wearables, and haptic feedback systems.', 1, 'motor', 2, 'vibration-motor.png'),

    ('Brushless Motor', 'This motor is designed for higher efficiency and longer lifespan compared to brushed motors and is commonly used in drones, RC vehicles, and other applications that require high performance.', 1, 'motor', 17, 'brushless-motor.png'),

    ('Linear Actuator', 'This motor is used for linear motion and is commonly used in applications that require precise linear movement, such as automation, robotics, and positioning systems.', 1, 'motor', 20, 'linear-actuator.png'),

    ('Solenoid', 'This electromechanical device is used for generating linear motion by applying an electrical current and is commonly used in applications such as locks, valves, and automation systems.', 1, 'motor', 10, 'solenoid.png'),

    ('DC Motor Driver Module', 'This module is used for controlling and driving DC motors, providing features such as speed control, direction control, and protection.', 1, 'motor', 7, 'dc-motor-driver-module.png'),

    ('Stepper Motor Driver Module', 'This module is used for controlling and driving stepper motors, providing features such as microstepping, speed control, and position control.', 1, 'motor', 15, 'stepper-motor-driver-module.png')
  ;`;


  connection.query(queryString, (err) => {
    if(err) throw err;
  });
  console.log("Products Schema Populated!");
}
