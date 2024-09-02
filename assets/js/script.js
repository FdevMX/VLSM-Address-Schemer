angular.module("vlsm", [])
.constant("POSICIONES", "primera segunda tercera cuarta quinta sexta séptima octava novena décima decimoprimera decimosegunda decimotercera decimocuarta decimoquinta".split(" "))
.constant("REGEX_IP", /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
.constant("CLASE_C", {
    maximoNumeroHosts: 254,
    potenciaMinima: 2,
    potenciaMaxima: 8,
    bitsMascara: 24,
    bitsPorOcteto: 8,
    hostsPorSubred: 126
})
.controller("MainController", ["$scope", "CLASE_C", "REGEX_IP", "POSICIONES", 
function($scope, CLASE_C, REGEX_IP, POSICIONES) {
    // Inicializar variables
    $scope.themeMode = localStorage.getItem('themeMode') || 'system';
    $scope.darkMode = false;
    $scope.dropdownOpen = false;

    // Función para cambiar el tema
    $scope.changeTheme = function(theme) {
        $scope.themeMode = theme;

        switch ($scope.themeMode) {
            case 'light':
                $scope.darkMode = false;
                break;
            case 'dark':
                $scope.darkMode = true;
                break;
            case 'system':
                $scope.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                break;
        }
        localStorage.setItem('themeMode', $scope.themeMode);
        $scope.dropdownOpen = false; // Cerrar el dropdown después de seleccionar
    };

    // Función para alternar el estado del dropdown
    $scope.toggleDropdown = function() {
        $scope.dropdownOpen = !$scope.dropdownOpen;
    };

    // Inicializar el tema al cargar la página
    $scope.changeTheme($scope.themeMode);

    // Escuchar cambios en el tema del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
        if ($scope.themeMode === 'system') {
            $scope.$apply(function() {
                $scope.darkMode = e.matches;
            });
        }
    });

    
    // $scope.limpiar = function() {
    //     $scope.hosts = '';
    //     $scope.hostNames = '';
    //     $scope.ip = '';
    //     $scope.ips = [];
    // };

    $scope.limpiar = function() {
        // Verificar si hay datos en los campos de entrada
        if (!$scope.hosts && !$scope.hostNames && !$scope.ip && (!$scope.ips || $scope.ips.length === 0)) {
            Swal.fire({
                title: 'No hay datos para limpiar',
                text: 'Por favor, asegúrese de haber ingresado los datos correctamente.',
                icon: 'info',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        // Mostrar mensaje de confirmación si hay datos
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-custom-popup',
                confirmButton: 'swal2-confirm-button',
                cancelButton: 'swal2-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.$apply(function() {
                    $scope.hosts = '';
                    $scope.hostNames = '';
                    $scope.ip = '';
                    $scope.ips = null;
                });
                Swal.fire({
                    title: '¡Limpiado!',
                    text: 'Los datos han sido eliminados.',
                    icon: 'success',
                    confirmButtonText: 'Cerrar',
                    customClass: {
                        popup: 'swal2-custom-popup',
                        confirmButton: 'swal2-custom-button'
                    }
                });
            }
        });
    };

    $scope.exportarPDF = function() {
        if (!$scope.ips || $scope.ips.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No hay datos para exportar',
                text: 'Por favor, asegúrese de haber ingresado los datos correctamente.',
                confirmButtonText: 'Cerrar',
                width: '400px', // Ajusta el ancho de la ventana de alerta
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape'); // Cambiar la orientación a horizontal
    
        // Configuración de la tabla
        const headers = [["Posición", "Cantidad de hosts", "IP (ID Red)", "Máscara", "Máscara de subred", "Rango", "1ra IP", "2da IP", "3ra IP", "Última IP", "Broadcast", "DNS"]];
        const data = $scope.ips.map(ip => [
            ip.posicion,
            ip.cantidadHosts,
            ip.ip,
            ip.mascaraDiagonal,
            ip.mascara,
            ip.rango,
            ip.primeraIP,
            ip.segundaIP,
            ip.terceraIP,
            ip.ultimaIP,
            ip.broadcast,
            ip.dns
        ]);
    
        // Agregar la tabla al PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 1 },
            columnStyles: { 0: { cellWidth: 20 } },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 }
        });
    
        // Guardar el PDF
        doc.save("vlsm_data.pdf");
    };


    $scope.exportarCSV = function() {
        if (!$scope.ips || $scope.ips.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No hay datos para exportar',
                text: 'Por favor, asegúrese de haber ingresado los datos correctamente.',
                confirmButtonText: 'Cerrar',
                width: '400px', // Ajusta el ancho de la ventana de alerta
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Posición,Cantidad de hosts,IP (ID Red),Máscara,Máscara de subred,Rango,1ra IP (Default Gateway),2da IP (DHCP),3ra IP (Start IP Address),Última IP,Broadcast,DNS\n";

        $scope.ips.forEach(function(ip) {
            let row = [
                ip.posicion,
                ip.cantidadHosts,
                ip.ip,
                ip.mascaraDiagonal,
                ip.mascara,
                ip.rango,
                ip.primeraIP,
                ip.segundaIP,
                ip.terceraIP,
                ip.ultimaIP,
                ip.broadcast,
                ip.dns
            ];
            csvContent += row.join(",") + "\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "vlsm_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    $scope.getPosition = index => POSICIONES[index];
    
    $scope.quitarTabla = () => {
        $scope.ips = null;
    };
    
    // $scope.ip = "209.17.81.0";
    // $scope.hosts = "50,20";
    // $scope.hostNames = "credito,cobranza";
    
    $scope.obtenerPotenciaSuficiente = numeroHosts => {
        if (numeroHosts > CLASE_C.maximoNumeroHosts) throw Error("¡Más hosts de los permitidos!");
        return Math.ceil(Math.log2(numeroHosts + 2));
    };
    
    $scope.parsearIp = ip => ip.split(".");
    
    $scope.obtenerNumeroDeHostQueDeberiaUsar = potencia => Math.pow(2, potencia);
    
    $scope.calcularMascara = bitsPrestados => {
        return 256 - Math.pow(2, 8 - bitsPrestados);
    };
    
    $scope.calcular = (hosts, ip) => {
        // Verificar que los campos no estén vacíos
        if (!hosts || !ip) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingrese la cantidad y nombres de los hosts y la dirección IP.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        // Verificar que la dirección IP esté en el formato correcto
        if (!REGEX_IP.test(ip)) {
            Swal.fire({
                title: 'Error',
                text: 'Parece que no pusiste una dirección IPv4 válida.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        // Verificar que los hosts estén separados por comas y sean números válidos
        if (!/^[0-9,]+$/.test(hosts)) {
            Swal.fire({
                title: 'Error',
                text: 'La cantidad de hosts debe estar separada por comas y ser números válidos.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        let arregloHosts = hosts.trim().split(",").map(Number);
        if (arregloHosts.some(isNaN) || arregloHosts.some(host => host <= 0)) {
            Swal.fire({
                title: 'Error',
                text: 'La cantidad de hosts debe estar separada por comas y ser números válidos mayores a cero.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        // Verificar que los nombres de hosts estén separados por comas y sean válidos
        let arregloNombres = $scope.hostNames ? $scope.hostNames.trim().split(",") : [];
        if ($scope.hostNames && !/^[a-zA-Z0-9,]+$/.test($scope.hostNames)) {
            Swal.fire({
                title: 'Error',
                text: 'Los nombres de hosts deben estar separados por comas y contener solo letras y números.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        if ($scope.hostNames && arregloNombres.length !== arregloHosts.length) {
            Swal.fire({
                title: 'Error',
                text: 'La cantidad de nombres de hosts debe coincidir con la cantidad de hosts y estar separados por comas.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            return;
        }
    
        let octetos = $scope.parsearIp(ip);
    
        if (arregloHosts.length === 0) return;
    
        // Validaciones
        if (arregloHosts.some(host => host > CLASE_C.hostsPorSubred)) {
            Swal.fire({
                title: 'Error',
                text: `¡No puedes tener una subred con más de ${CLASE_C.hostsPorSubred} hosts!`,
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            $scope.quitarTabla();
            return;
        }
    
        let suma = arregloHosts.reduce((a, b) => a + b, 0);
        if (suma >= CLASE_C.maximoNumeroHosts + 1) {
            Swal.fire({
                title: 'Error',
                text: `El número total de hosts (${suma}) supera al límite de hosts para la subred (${CLASE_C.maximoNumeroHosts + 1}).`,
                icon: 'error',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-custom-popup',
                    confirmButton: 'swal2-custom-button'
                }
            });
            $scope.quitarTabla();
            return;
        }
    
        arregloHosts.sort((a, b) => b - a);
    
        let contador = 0;
        let ips = [];
    
        arregloHosts.forEach((host, index) => {
            if (contador >= CLASE_C.maximoNumeroHosts) {
                Swal.fire({
                    title: 'Error',
                    text: `¡No puedes tener más de ${CLASE_C.maximoNumeroHosts} hosts en la red!`,
                    icon: 'error',
                    confirmButtonText: 'Cerrar',
                    customClass: {
                        popup: 'swal2-custom-popup',
                        confirmButton: 'swal2-custom-button'
                    }
                });
                $scope.quitarTabla();
                return;
            }
    
            let potencia = $scope.obtenerPotenciaSuficiente(host);
            let numeroHosts = $scope.obtenerNumeroDeHostQueDeberiaUsar(potencia);
            let primerosTresOctetos = `${octetos[0]}.${octetos[1]}.${octetos[2]}`;
            let bitsTomados = CLASE_C.bitsPorOcteto - potencia;
    
            let ipBase = parseInt(octetos[3]) + contador;
    
            ips.push({
                posicion: arregloNombres[index] || POSICIONES[index], // Eliminamos la numeración
                cantidadHosts: host,
                ip: `${primerosTresOctetos}.${ipBase}`,
                mascaraDiagonal: `/${CLASE_C.bitsMascara + bitsTomados}`,
                mascara: `255.255.255.${$scope.calcularMascara(bitsTomados)}`,
                rango: `${ipBase + 1} - ${ipBase + numeroHosts - 2}`,
                primeraIP: `${primerosTresOctetos}.${ipBase + 1}`,
                segundaIP: `${primerosTresOctetos}.${ipBase + 2}`,
                terceraIP: `${primerosTresOctetos}.${ipBase + 3}`,
                ultimaIP: `${primerosTresOctetos}.${ipBase + numeroHosts - 2}`,
                broadcast: `${primerosTresOctetos}.${ipBase + numeroHosts - 1}`,
                dns: `${primerosTresOctetos}.${ipBase + 2}` // Igual que segundaIP
            });
    
            contador += numeroHosts;
        });
    
        $scope.ips = ips;
    };
}]);