CREATE TABLE cliente(
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    dni_cuil INT NOT NULL,
    tel_cel INT NOT NULL,
    direcCion VARCHAR(50),
    provincia VARCHAR(50),
    localidad VARCHAR(50),
    cp VARCHAR(10),
    PRIMARY KEY(id)
);

CREATE TABLE usuario(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    dni_cuil INT NOT NULL,
    email VARCHAR(80),
    password VARCHAR(150)

);



CREATE TABLE producto(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(350) NOT NULL,
    cantidad INT NOT NULL,
    local VARCHAR(250) NOT NULL,
    tela VARCHAR(100) NOT NULL,
    precio INT NOT NULL
    );


CREATE TABLE talles(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    talle INT NOT NULL,
    cantidad INT,

    FOREIGN KEY fk_id_producto (id_producto)
    REFERENCES producto (id)
);


CREATE TABLE orden(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    total INT NOT NULL,
    url_pdf_cliente VARCHAR(800),
    url_pdf_venta  VARCHAR(800),


    FOREIGN KEY fk_id_cliente (id_cliente)
    REFERENCES cliente (id),

    FOREIGN KEY fk_id_usuario (id_usuario)
    REFERENCES usuario (id)
    );

ALTER TABLE orden AUTO_INCREMENT = 100


CREATE TABLE orden_detalle(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio INT NOT NULL,


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



    FOREIGN KEY fk_id_usuario (id_usuario)
    REFERENCES usuario (id),

    FOREIGN KEY fk_id_producto (id_producto)
    REFERENCES producto (id)
);


ALTER TABLE orden_detalle
ADD createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


ALTER TABLE usuario
ADD rol VARCHAR(15);


ALTER TABLE orden_detalle
ADD talle INT;

ALTER TABLE usuario
ADD estado BOOLEAN DEFAULT TRUE;

CREATE TABLE direccion(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    direccion VARCHAR(50),
    provincia VARCHAR(50),
    localidad VARCHAR(50),
    cp VARCHAR(10),

    FOREIGN KEY fk_id_cliente (id_cliente)
    REFERENCES cliente (id)
);

ALTER TABLE cliente 
    DROP COLUMN direccion ,
    DROP COLUMN provincia ,
    DROP COLUMN localidad ,
    DROP COLUMN cp;


ALTER TABLE orden
   ADD fecha DATE,
   ADD transporte VARCHAR(100);

ALTER TABLE orden
    ADD FOREIGN KEY fk_id_direccion(id_direccion) REFERENCES direccion (id);


ALTER TABLE orden ADD constraint fk_id_direccion FOREIGN KEY (id_direccion) REFERENCES direccion(id)


CREATE TABLE orden(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    id_direccion INT NOT NULL ,
    total INT NOT NULL,
    url_pdf_cliente VARCHAR(800),
    url_pdf_venta  VARCHAR(800),
    fecha DATE,
    transporte VARCHAR(100)


    FOREIGN KEY fk_id_cliente (id_cliente)
    REFERENCES cliente (id),

    FOREIGN KEY fk_id_usuario (id_usuario)
    REFERENCES usuario (id),

    FOREIGN KEY fk_id_direccion(id_direccion) 
    REFERENCES direccion (id)

    );


ALTER TABLE orden
    ADD id_direccion INT NOT NULL ,
    ADD CONSTRAINT fk_id_direccion FOREIGN KEY (id_direccion)
        REFERENCES direccion(id);