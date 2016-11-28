<?php
namespace SoulHand\Academic;
use \PDOException;
use \PDO;

 class Teacher extends People{
 	public function create($data){
        if(Parent::isExist($data["dni"])){
            throw new PDOException("La persona ya existe!");
        }
        $val=Parent::create($data);
        $TEACHER=[
            "docente_cedula"=>$val["persona_cedula"],
            "docente_instruccion"=>$data["instruction"],
            "docente_interprete"=>$data["interpreter"]
        ];
        $stm=$this->database->prepare("INSERT INTO docente(
                docente_cedula,
                docente_instruccion,
                docente_interprete
            )
            VALUES(
                :docente_cedula,
                :docente_instruccion,
                :docente_interprete
            )
        ");
        $query=$stm->execute($TEACHER);
        if(!$query){
            throw new PDOException("El docente ya existe!");            
        }
        return array_merge($val,$TEACHER);
    }
    public function find($dni){
        $stm=$this->database->prepare("SELECT persona_cedula as dni, persona_nombre as firstName, persona_apellido as lastName, persona_telefono as tel, persona_fecha_nacimiento as birthdate, persona_correo as email, docente_instruccion as instruction, docente_interprete as interpreter FROM persona INNER JOIN docente on docente_cedula=persona.persona_cedula WHERE persona_cedula=?");
        $query=$stm->execute([$dni]);
        if($stm->rowCount()==0){
            throw new PDOException("No existe el docente!");
        }
        return $stm->fetch(PDO::FETCH_ASSOC);
    }
    public function getAll(){
        $stm=$this->database->query("SELECT persona_cedula as dni, persona_nombre as firstName, persona_apellido as lastName, persona_telefono as tel, persona_fecha_nacimiento as birthdate, persona_correo as email, docente_instruccion as instruction, docente_interprete as interpreter FROM persona INNER JOIN docente on docente_cedula=persona.persona_cedula");
        if($stm->rowCount()==0){
            throw new PDOException("No existe docentes!");
        }
        return $stm->fetchAll(PDO::FETCH_ASSOC);
    }
    public function delete($dni){
        $stm=$this->database->prepare("DELETE FROM docente WHERE docente_cedula=?");
        $query=$stm->execute([$dni]);
        if($stm->rowCount()==0){
            throw new PDOException("No existe el docente!");
        }
        Parent::delete($dni);
    }
    public function update($dni,$values){
        $fields=[];
        foreach ($values as $key => $value) {
            $fields[]="{$key}=:{$key}";
        }
        $fields=implode(',',$fields);
        $SQL="UPDATE docente SET {$fields} WHERE docente_cedula=:dni";      
        $stm=$this->database->prepare($SQL);
        $query=$stm->execute(array_merge($values,[
            "dni"=>$dni
        ]));
        if($stm->rowCount()==0){
            throw new PDOException("No existe la Persona!");
        }
    }
    public function search($filters){
        $fields=[];
        foreach ($filters as $key => $value) {
            $fields[]="{$key}=:{$key}";
        }
        $fields=implode(' AND ',$fields);
        $SQL="SELECT * FROM persona INNER JOIN docente on docente_cedula=persona.persona_cedula WHERE {$fields}";
        $stm=$this->database->prepare($SQL);
        $query=$stm->execute($filters);
        if($stm->rowCount()==0){
            throw new PDOException("No existe docentes con esta descripciones!");
        }
        return $stm->fetchAll(PDO::FETCH_ASSOC);
    }
 }