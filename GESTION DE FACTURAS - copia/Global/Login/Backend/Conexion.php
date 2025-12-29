
<?php

    class Conexion{
        private $host ='localhost';
        private $nombreBDD ='sistema_facturacion';
        private $usuarioBDD ='root';
        private $contrasena = '';
        static $conex = null;


        static public function conectarse(){
            try {
                $this->conex = new PDO('mysql:host='.$this->host.'dbname='.$this->nombreBDD,
                                    $this->usuarioBDD, $this->contrasena);
                $this->conex->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
            } catch (PDOexception $e) {
                die("Conexion fallida".$e->getMessage());
            }
            
        }

    }




?>