<?php
namespace SoulHand\Academic;
use \PDOException;
use \PDO;

 class Student extends People{
 	public function create($data){
        if(Parent::isExist($data["dni"])){
            throw new PDOException("La persona ya existe!");
        }
        $val=Parent::create($data);
        $STUDENT=[
            "alumno_cedula"=>$val["persona_cedula"],
            "institucion_institucion_cod"=>$data["cod_institute"],
            "grado_sordera"=>$data["deafness"]
        ];
        $stm=$this->database->prepare("INSERT INTO alumno(
                alumno_cedula,
                institucion_institucion_cod,
                grado_sordera
            )
            VALUES(
                :alumno_cedula,
                :institucion_institucion_cod,
                :grado_sordera
            )
        ");
        $query=$stm->execute($STUDENT);
        if(!$query){
            throw new PDOException("El docente ya existe!");            
        }
        return array_merge($val,$STUDENT);
    }
    public function find($dni){
        $stm=$this->database->prepare("SELECT * FROM persona INNER JOIN alumno on alumno_cedula=persona.persona_cedula WHERE persona_cedula=?");
        $query=$stm->execute([$dni]);
        if($stm->rowCount()==0){
            throw new PDOException("No existe el alumno!");
        }
        return $stm->fetch(PDO::FETCH_ASSOC);
    }
    public function delete($dni){
        $stm=$this->database->prepare("DELETE FROM alumno WHERE alumno_cedula=?");
        $query=$stm->execute([$dni]);
        if($stm->rowCount()==0){
            throw new PDOException("No existe el alumno!");
        }
        Parent::delete($dni);
    }
    public function update($dni,$values){
        $fields=[];
        foreach ($values as $key => $value) {
            $fields[]="{$key}=:{$key}";
        }
        $fields=implode(',',$fields);
        $SQL="UPDATE alumno SET {$fields} WHERE alumno_cedula=:dni";      
        $stm=$this->database->prepare($SQL);
        $query=$stm->execute(array_merge($values,[
            "dni"=>$dni
        ]));
        if($stm->rowCount()==0){
            throw new PDOException("No existe el alumno!");
        }
    }
    public function search($filters){
        $fields=[];
        foreach ($filters as $key => $value) {
            $fields[]="{$key}=:{$key}";
        }
        $fields=implode(' AND ',$fields);
        $SQL="SELECT * FROM persona INNER JOIN alumno on alumno_cedula=persona.persona_cedula WHERE {$fields}";
        $stm=$this->database->prepare($SQL);
        $query=$stm->execute($filters);
        if($stm->rowCount()==0){
            throw new PDOException("No existe alumnos con esta descripciones!");
        }
        return $stm->fetchAll(PDO::FETCH_ASSOC);
    }
 }