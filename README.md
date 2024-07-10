# Grupo 2

## Final 24 julio

- 15 min, todos exponen, funcionar en vivo.
- Subir:
  - Codigo, un reporte, documentacion no tan especifica, ciertas partes del codigo

## Sistema completo

- Web o apk, login que deja ambos
- Notas, prerequisitos, semestres adecuados, no mucho adelantado, cupos, logins
- BD con lo necesario de $todo$ el salon

### (Ya no necesario??????)

- Todos los calculos posibles de notas
- Creditos, cupos, grupos(2 max), 40 personas
  - Con meritocracia

## Falta

- **Organizar todas las paginas**
- *Matricular a alguien*
- DNI como contraseña, login
- Bug al buscar un cachimbo, funcion double en el calculo del promedio
- Frontend mas estetico
    1. Primera pagina: nombre, cui, semestre, promedio general, cantidad de creditos aprobados y desaprobados, cantidad de creditos matriculados, se tiene que hacer una distincion entre alumno y egresado(hacerlo con suma de creditos totales??),
    2. Cursos matriculados: semestre, creditos, docente opcional
    3. Cursos llevados: Nombre, semestre, promedio(no notas individuales), condicion(aprobado, desaprobado), numero de matricula
    4. Cursos aptos para llevar: nombre, semestre, creditos
- \# de matricula **Random**
- Promedio semestre anterior
  - Se necesita año de matricula
- Registro final de matriculas con servidor

## DB

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
