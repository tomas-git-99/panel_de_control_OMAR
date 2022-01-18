CREATE TABLE cliente(
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    dni_cuil INT,
    tel_cel INT,
    email VARCHAR(140),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE usuario(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    dni_cuil INT NOT NULL,
    venta VARCHAR(50),
    password VARCHAR(180),
    estado  BOOLEAN DEFAULT TRUE,
    rol VARCHAR(15),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE producto(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(350) NOT NULL,
    cantidad INT NOT NULL,
    local VARCHAR(250) NOT NULL,
    tela VARCHAR(100) NOT NULL,
    precio INT NOT NULL,
    talles VARCHAR(50),
    diseño VARCHAR(140),
    estado BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


CREATE TABLE talles(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    talle INT NOT NULL,
    cantidad INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY fk_id_producto (id_producto)
    REFERENCES producto (id)
);


CREATE TABLE orden(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente   INT NOT NULL,
    id_usuario   INT NOT NULL,
    id_direccion INT,
    fecha DATE,
    transporte VARCHAR(100),
    total INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY fk_id_cliente (id_cliente)
    REFERENCES cliente (id),

    FOREIGN KEY fk_id_usuario (id_usuario)
    REFERENCES usuario (id),

    FOREIGN KEY fk_id_direccion(id_direccion) 
    REFERENCES direccion (id)
);


CREATE TABLE orden_publico(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    total INT,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orden AUTO_INCREMENT = 100


CREATE TABLE orden_detalle(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_orden INT,
    nombre_producto VARCHAR(150),
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio INT NOT NULL,
    talle INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY fk_id_producto (id_producto)
    REFERENCES producto (id),

    FOREIGN KEY fk_id_orden (id_orden)
    REFERENCES orden (id)
);


/* OPCIONAL */

CREATE TABLE carrito(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    talle INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY fk_id_usuario (id_usuario)
    REFERENCES usuario (id),

    FOREIGN KEY fk_id_producto (id_producto)
    REFERENCES producto (id)
);


ALTER TABLE orden_detalle
ADD createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;



CREATE TABLE direccion(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    direccion VARCHAR(50),
    provincia VARCHAR(50),
    localidad VARCHAR(50),
    cp VARCHAR(10),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY fk_id_cliente (id_cliente)
    REFERENCES cliente (id)
);






CREATE TABLE producto_produccion (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_corte VARCHAR(30),
    fecha_de_corte DATE,
    nombre VARCHAR(100),
    edad VARCHAR(100),
    rollos INT,
    tela VARCHAR(100),
    total_por_talle INT,
    talles VARCHAR(100),
    total INT,

    id_taller INT,
    fecha_de_salida DATE,
    fecha_de_entrada DATE,
    fecha_de_pago DATE,
    peso_promedio DECIMAL(4,1),
    cantidad_entregada INT,
    estado BOOLEAN default false,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE taller (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(100),
    telefono INT,
    direccion VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_taller(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    id_taller INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY fk_id_producto (id_producto)
    REFERENCES producto_produccion (id),

    FOREIGN KEY fk_id_taller (id_taller)
    REFERENCES taller (id)
);


ALTER TABLE carrito 
    ADD createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;




CREATE TABLE estanpados(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_corte VARCHAR(50),
    id_estanpador INT,
    dibujo VARCHAR(255),
    fecha_de_entrada DATE,
    pagado BOOLEAN default false,
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estanpador(
    
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    telefono VARCHAR(25),
    direccion VARCHAR(100),

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE rollo(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE rollos(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_rollo INT NOT NULL,
    cantidad INT,
    estanpado VARCHAR(100),
    color VARCHAR(55),

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY fk_id_rollo (id_rollo)
    REFERENCES rollo (id)
);
