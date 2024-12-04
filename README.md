# VLSM-Address-Schemer

Una herramienta diseñada para calcular esquemas de direccionamiento **VLSM** (Variable Length Subnet Mask), optimizando la asignación de direcciones IP en redes de manera eficiente.

## Características
- **Optimización de direcciones IP**: Asegura un uso eficiente del espacio de direcciones disponibles.
- **Cálculo automático**: Genera subredes basadas en los requisitos especificados.
- **Compatibilidad**: Soporte para diferentes tamaños de subredes.
- **Interfaz intuitiva**: Fácil de usar para profesionales y estudiantes en redes.

## Requisitos
- **Navegador web**: Compatible con los navegadores más recientes (Chrome, Firefox, Edge, etc.).
- **Entorno de desarrollo web**: Un servidor local opcional para desarrollo, como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

## Instalación

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/FdevMX/VLSM-Address-Schemer.git
   cd VLSM-Address-Schemer
   ```
2. Abre el archivo `index.html` en tu navegador web o utiliza un servidor local para cargar la aplicación.

## Uso

1. Ingresa la dirección de red principal y los tamaños de las subredes requeridas en los campos correspondientes.
2. Presiona el botón de "Calcular" para generar el esquema de subredes optimizado.
3. Visualiza los resultados en la interfaz, con detalles del rango de direcciones y máscaras.

## Ejemplo de Salida
```
Red Principal: 192.168.0.0/24

Subredes generadas:
1. Subred 1:
   - Dirección: 192.168.0.0
   - Máscara: /26
   - Rango: 192.168.0.1 - 192.168.0.62

2. Subred 2:
   - Dirección: 192.168.0.64
   - Máscara: /27
   - Rango: 192.168.0.65 - 192.168.0.94

3. Subred 3:
   - Dirección: 192.168.0.96
   - Máscara: /28
   - Rango: 192.168.0.97 - 192.168.0.110
```


