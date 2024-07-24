# Grupo 2

## Final 24 julio

- 15 min, todos exponen, funcionar en vivo.
- Subir:
  - Codigo, un reporte, documentacion no tan especifica, ciertas partes del codigo

## Sistema completo

- Web o apk, login que deja ambos
- Notas, prerequisitos, semestres adecuados, no mucho adelantado, cupos, logins
- BD con lo necesario de $todo$ el salon

## Falta

- *Matricular a alguien frontend*
    - Se necesita agregar cursos matrículables a un array de JSON([2017208, 2017029]) y mandarlo al Endpoint matricular con POST
- Mostrar errores de login(mandados del server)

## Credenciales
    * Tiene cursos matriculados       
### Invictos

| CUI        | DNI      |
|------------| -------- |
| 20243472   | 79560429 |
| * 20230579 | 14795948 |

### Jalados

| CUI        | DNI      |
|------------| -------- |
| * 20233582 | 60780365 |
| * 20233597 | 77257681 |
| * 20233578 | 92325085 |

### Egresados
| CUI      | DNI      |
| -------- | -------- |
| 20190751 | 28759034 |
| 20192272 | 87815344 | 

## BD

### Operaciones

- Historial completo
- Cursos aprobados, jalados, matriculados
- Promedio, solo cuando tiene 3 notas
  - Por semestre: Se necesita saber cursos del anterior semestre(año y par/impar)
  - General: Todo menos los cursos que se llevan
- Semestre actual(mayor cantidad de cursos por semestre)
  - Contar max por semestre
  - Que pasa cuando no se esta llevando cursos, como se determina el semestre?????
  - Se determina el mayor semestre en los cursos aprobados??? O usando una mayoria los semestres de aprobados???
- Cursos que se pueden matricular
  - Asumimos cursos llevados como aprobados,

### Alumno

![alumno](assets/alumno.png)

#### ??Cambios??

- BD general ya tiene email(falso), generar uno random para autenticar???
- -Anio de ingreso a carrera(no uni)-
- Anio de estudio

### Curso

![curso](assets/curso.png)

### Docente

![docente](assets/docente.png)

### Matricula

- Notas: -1, recien lo esta llevando
- 3 tipos, aprobado, llevando y jalado
- Se matricula curso jalado, se actualiza la entrada en la tabla

![matricula](assets/matricula.png)
