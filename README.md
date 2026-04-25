# ShiftNote

ShiftNote es una mini herramienta frontend para generar resúmenes operativos de turno de forma clara, rápida y consistente. El proyecto está pensado para simular una herramienta interna real que ayude a equipos administrativos u operativos a entregar información entre turnos.

## Qué hace

La app permite capturar:

- Área
- Turno
- Número de incidencias
- Prioridad general
- Si existen bloqueos activos
- Siguiente acción recomendada

Con esos datos, genera automáticamente:

- Estado general del turno
- Resumen listo para compartir
- Texto fácil de copiar

## Objetivo del proyecto

ShiftNote está diseñado para mostrar:

- Manejo de formularios en React
- Transformación de datos en texto útil
- Lógica de presentación basada en reglas simples
- Interfaz limpia y enfocada en productividad
- Uso de TypeScript para mantener claridad en la lógica

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Después abre la URL local que muestre Vite en la terminal, normalmente:

```bash
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Flujo de la aplicación

1. El usuario llena los datos del turno
2. La app evalúa las condiciones principales
3. Se calcula un estado general
4. Se genera un resumen listo para compartir
5. El usuario puede copiar el resultado

## Estados posibles

- `Operación estable`
- `Seguimiento recomendado`
- `Atención requerida`

## Qué muestra la interfaz

- Formulario de captura
- Estado general del turno
- Vista previa del resumen
- Botón para copiar contenido
- Botón para reiniciar el formulario


## Qué aprendí con este proyecto

ShiftNote me permitió practicar una forma sencilla pero útil de construir frontend: tomar datos estructurados, aplicar reglas ligeras y convertirlos en una salida clara que aporte valor inmediato al usuario.

## Autor

Jesus Armando Gutierrez Nery

- GitHub: https://github.com/arpwn
- LinkedIn: https://www.linkedin.com/in/armandonery34/

