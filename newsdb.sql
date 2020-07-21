 DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS passresett;

 CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );


       CREATE TABLE passresett(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL ,
      checkvar VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  receiver_id INT REFERENCES users(id) NOT NULL,
  accepted BOOLEAN DEFAULT FALSE NOT NULL
);

DROP TABLE IF EXISTS msg;

CREATE TABLE msg(
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  msgs  VARCHAR NOT NULL,
  accepted BOOLEAN DEFAULT FALSE NOT NULL
);
DROP TABLE IF EXISTS imagemix;

CREATE TABLE imagemix(
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  receiver_id INT REFERENCES users(id) ,
  st_img  VARCHAR ,
  main_img  VARCHAR ,
  final_img  VARCHAR ,
  accepted BOOLEAN DEFAULT FALSE NOT NULL
);
  
      ALTER TABLE users
ADD imgurl VARCHAR ;

      ALTER TABLE users
ADD bio VARCHAR ;