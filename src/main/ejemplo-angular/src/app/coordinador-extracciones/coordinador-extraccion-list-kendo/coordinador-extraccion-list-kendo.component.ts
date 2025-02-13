import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLProvider } from '../../shared/url-provider'
import { GlobalesService } from '../../shared/globales.service';
import { CoordinadorExtraccion } from '../shared/coordinador-extraccion'
import { ConfigurarCoordinadorExtraccion } from '../shared/configurar-coordinador-extraccion'
/* import { PermisoTablaService } from '../../permiso-tablas/shared/permiso-tabla.service'; */
/* import { PermisoAtributoService } from '../../permiso-atributos/shared/permiso-atributo.service'; */
//****************************************************************************************I N I C I O    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
import {CoreService} from '../../shared/core.service';
//****************************************************************************************F I N    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
declare var $: any;
declare var kendo: any;
declare var bootbox: any;

var self = {};
var usuariologueado;

@Component({
    selector: 'app-coordinador-extraccion-list-kendo',
    templateUrl: './coordinador-extraccion-list-kendo.component.html',
    styleUrls: ['./coordinador-extraccion-list-kendo.component.css'],
    providers: [
//             PermisoTablaService,
//****************************************************************************************I N I C I O    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
                CoreService,
//****************************************************************************************F I N    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
//                PermisoAtributoService
               ]

})
export class CoordinadorExtraccionListKendoComponent implements OnInit {
    public usuariologueado;
    public crudServiceBaseUrl;
    public permisosAtributos = [];
    public permisosTabla={ "tabla": "", "permiso": 0, "etiqueta": "" };
    public coordinadorExtraccionSeleccionado: CoordinadorExtraccion = new CoordinadorExtraccion();
    public dataSource: any;
    public grid: any;
    @Input() configuracionCoordinadorExtraccion: ConfigurarCoordinadorExtraccion = new ConfigurarCoordinadorExtraccion();
    @Input() nombregrid: string = "";
    public lista;
    public rutaAgregar;
    public rutaEliminar;
    @Output("coordinadorExtraccionSeleccionado") evtCoordinadorExtraccionSeleccionado: EventEmitter<CoordinadorExtraccion> = new EventEmitter<CoordinadorExtraccion>();

    constructor(public urlprovider: URLProvider ,
//****************************************************************************************I N I C I O    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
                public coreService: CoreService,
//****************************************************************************************F I N    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
               public globalesService: GlobalesService,
//               public permisoTablaService: PermisoTablaService,
//               public permisoAtributoService: PermisoAtributoService
                 ) {
        this.crudServiceBaseUrl = this.urlprovider.serverURL + "coordinadorExtraccion";
        usuariologueado = this.usuariologueado = globalesService.dameUsuario();
        /* var discon="";
        if (this.usuariologueado){
            if (this.usuariologueado.perfil){
                discon="with perfil.id = "+this.usuariologueado.perfil.id;
                var cadena1="select pa from PermisoAtributo as pa inner join pa.perfiles as perfil "+discon+" where pa.tabla= 'coordinadorExtraccion'";
                var cadena2="select pa from PermisoTabla as pa inner join pa.perfiles as perfil "+discon+" where pa.tabla= 'coordinadorExtraccion'";
                this.permisoAtributoService.custom(cadena1, globalesService.evtAtributos, this);
                this.permisoTablaService.custom(cadena2, globalesService.evtTablas, this);
            }
        } */
    }

    actualizaTituloInicial(){
        if (this.configuracionCoordinadorExtraccion.titulo.indexOf("Catálogo")!= -1){
            this.configuracionCoordinadorExtraccion.titulo = "Catálogo "+this.permisosTabla.etiqueta;
        }
    }

    ngOnChanges(changes) {
        usuariologueado = this.usuariologueado = this.globalesService.dameUsuario();
        if (changes.configuracionCoordinadorExtraccion && changes.configuracionCoordinadorExtraccion.currentValue &&
            (changes.configuracionCoordinadorExtraccion.previousValue instanceof ConfigurarCoordinadorExtraccion)) {
            if (changes.configuracionCoordinadorExtraccion.currentValue.permisosAtributos)
                this.permisosAtributos=changes.configuracionCoordinadorExtraccion.currentValue.permisosAtributos;
            if (changes.configuracionCoordinadorExtraccion.currentValue.permisosTabla)
                this.permisosTabla=changes.configuracionCoordinadorExtraccion.currentValue.permisosTabla;
            if ($("#grid_coordinadorExtraccion_"+this.nombregrid)) {
                this.inicializaGrid();
                if (this.dataSource) {
                    this.grid.dataSource = this.dataSource;
                    this.dataSource.read();
                }
            }
        }
    }

    ngOnInit() {
        self["grid_coordinadorExtraccion_" + this.nombregrid] = this;
        usuariologueado = this.usuariologueado = this.globalesService.dameUsuario();
//****************************************************************************************I N I C I O    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
        var  ejecutarpermisos : boolean = true;
        if (this.configuracionCoordinadorExtraccion.permisosAtributos &&
            this.configuracionCoordinadorExtraccion.permisosTabla)
            ejecutarpermisos =false;
        if (this.usuariologueado && ejecutarpermisos){
            if (this.usuariologueado.perfil){
                  var tablas= [
                                "coordinadorExtraccion",
                               ];
                  var parametros:any ={
                      "id_usu": this.usuariologueado.id,
                      "tablas":tablas,
		      "id_exp": -1

                  };
                  this.coreService.permisos(parametros,this.evtCorePermisos,this);
//                discon="with perfil.id = "+this.usuariologueado.perfil.id;
//                var cadena1="select pa from PermisoAtributo as pa inner join pa.perfiles as perfil "+discon+" where pa.tabla= 'CoordinadorExtraccion'";
//                var cadena2="select pa from PermisoTabla as pa inner join pa.perfiles as perfil "+discon+" where pa.tabla= 'CoordinadorExtraccion'";
//                var cadena3="select pa from PermisoConjunto as pa inner join pa.perfiles as perfil "+discon+" where pa.tabla= 'CoordinadorExtraccion'";
//                this.permisoAtributoService.custom(cadena1, this.evtAtributos, this);
//                this.permisoTablaService.custom(cadena2, this.evtTablas, this);
//                this.permisoConjuntoService.custom(cadena3, this.evtConjuntos, this);
             }
        }
//****************************************************************************************F I N    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************

        if (this.configuracionCoordinadorExtraccion.permisosAtributos)
            this.permisosAtributos=this.configuracionCoordinadorExtraccion.permisosAtributos;
        if (this.configuracionCoordinadorExtraccion.permisosTabla)
            this.permisosTabla=this.configuracionCoordinadorExtraccion.permisosTabla;
        this.configuraGrid();
    }
//****************************************************************************************I N I C I O    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************
    evtCorePermisos(permisos,obj ){
        if (permisos && permisos.coordinadorExtraccion && permisos.coordinadorExtraccion.PermisoAtributo&& permisos.coordinadorExtraccion.PermisoAtributo.length>0
            && !obj.configuracionCoordinadorExtraccion.permisosAtributos){
            obj.globalesService.evtAtributos (permisos.coordinadorExtraccion.PermisoAtributo,obj);
//            obj.permisosAtributos = permisos.CoordinadorExtraccion.PermisoAtributo ;
        }
        if (permisos && permisos.coordinadorExtraccion && permisos.coordinadorExtraccion.PermisoTabla && permisos.coordinadorExtraccion.PermisoTabla.length>0
            && !obj.configuracionCoordinadorExtraccion.permisosTabla){
            obj.globalesService.evtTablas (permisos.coordinadorExtraccion.PermisoTabla,obj);

//            obj.permisosTabla = permisos.CoordinadorExtraccion.PermisoTabla[0] ;
//            obj.permisosaccionesInicio();
        }
    }
//****************************************************************************************F I N    D E    O P T I M I Z A C I O N    D E    C O D I G O *****************************


    configuraGrid(){
        if ( $("#grid_coordinadorExtraccion_"+this.nombregrid).data("kendoGrid")) {
        }else{
           setTimeout(() => {
              this.inicializaGrid();
              this.configuraGrid(); }, 300);
        }
    }
    sourcegrid() {
        function completar(e) {
            (e);
        };
        if (this.permisosAtributos.length == 0 || this.permisosAtributos == null)
            return;
        if (this.permisosTabla == null || (this.permisosTabla && this.permisosTabla.permiso == 0))
            return;
        if (this.configuracionCoordinadorExtraccion.campoAgEl != null
            && this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta
            && this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta.isOk
            && !this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta.isOk())
            return;
        if (this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta) {
            if (!this.configuracionCoordinadorExtraccion.campoAgEl && this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta instanceof CoordinadorExtraccion)
                this.configuracionCoordinadorExtraccion.rutaLista = this.crudServiceBaseUrl + "/getCoordinadorExtraccionesByDto";
            this.lista = this.configuracionCoordinadorExtraccion.lecturaP(completar,this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta);
            if (this.configuracionCoordinadorExtraccion.campoAgEl) {
                this.rutaAgregar = this.configuracionCoordinadorExtraccion.agregarP(function(){}, this.configuracionCoordinadorExtraccion.campoAgEl);
                this.rutaEliminar = this.configuracionCoordinadorExtraccion.eliminarP(function(){}, this.configuracionCoordinadorExtraccion.campoAgEl);
            } else {
                this.rutaAgregar = this.configuracionCoordinadorExtraccion.agregarP(completar, this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta);
                this.rutaEliminar = this.configuracionCoordinadorExtraccion.eliminarP(completar, this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta);
            }
        } else {
            this.lista = this.configuracionCoordinadorExtraccion.lectura();
            this.rutaAgregar = this.configuracionCoordinadorExtraccion.agregar();
            this.rutaEliminar = this.configuracionCoordinadorExtraccion.eliminar();
        }
        var modelo = {};
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "id")) {
            modelo["id"] = "id";
        }

        var campos = {};
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "id")) {
            campos["id"] = { editable: false, nullable: true , type:"number" };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "idregistroExtraccion")) {
            campos["idregistroExtraccion"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "idregistroExtraccion"), nullable: true , type: "object" , defaultValue: { "id": "" , "fechaBaja": "" }  };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "nombre")) {
            campos["nombre"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "nombre"), nullable: true , type:"string" };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "primerApellido")) {
            campos["primerApellido"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "primerApellido"), nullable: true , type:"string" };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "segundoApellido")) {
            campos["segundoApellido"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "segundoApellido"), nullable: true , type:"string" };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "fechaRegistro")) {
            campos["fechaRegistro"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "fechaRegistro"), nullable: true , type:"date" };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "fechaActualizacion")) {
            campos["fechaActualizacion"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "fechaActualizacion"), nullable: true , type:"date" };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "fechaBaja")) {
            campos["fechaBaja"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "fechaBaja"), nullable: true , type:"date" };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "usuarioUltMov")) {
            campos["usuarioUltMov"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "usuarioUltMov"), nullable: true , type: "object" , defaultValue: { "id": "" , "password": "" }  };
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "status")) {
            campos["status"] = { editable: this.globalesService.aenable(this,"coordinadorExtraccion", "status"), nullable: true , type:"string", defaultValue: "1"  };
        }

        modelo["fields"] = campos;
        var slf = this;

        this.dataSource = new kendo.data.DataSource({
            transport: {
                read: this.lista,
                update: {
                    url: this.configuracionCoordinadorExtraccion.rutaActualizar,
                    contentType: "application/json",
                    type: "POST"
                },
                destroy: this.rutaEliminar,
                create: this.rutaAgregar,
                parameterMap: function(options, operation) {
                    if (options.models && operation === "read") {
                        if (typeof options.models === 'string')
                           return options.models;
                        return JSON.stringify(options.models);
                    } else
                        if (operation === "create" && options.models) {
                            if (options.models[0].status)
                                options.models[0].status = options.models[0].status.value;
                            return operacionesCompletas(options, operation, this,slf);
                        } else
                            if (operation === "update" && options.models) {
                                if (options.models[0].status)
                                    options.models[0].status = options.models[0].status.value;
                                options.models[0].usuarioUltMov = usuariologueado;
                                return JSON.stringify(options.models[0]);
                            } else
                                if (operation === "destroy" && options.models) {
                                    return operacionesCompletas(options, operation, this,slf);
                                }
                }
            },
            batch: true,
            pageSize: 10,
            schema: {
                parse: function(response) {
                    if (Object.prototype.toString.call(response) !== '[object Array]')
                        response = [response];
                    $.each(response, function(idx, elem) {
                        if (elem.fechaBaja && typeof elem.fechaBaja === "number") {
                            elem.fechaBaja = kendo.parseDate(new Date(elem.fechaBaja), "yyyy-MM-ddTHH:mm:ss.fffZ");
                        }
                        if (elem.fechaRegistro && typeof elem.fechaRegistro === "number") {
                            elem.fechaRegistro = kendo.parseDate(new Date(elem.fechaRegistro), "yyyy-MM-ddTHH:mm:ss.fffZ");
                        }
                        if (elem.fechaActualizacion && typeof elem.fechaActualizacion === "number") {
                            elem.fechaActualizacion = kendo.parseDate(new Date(elem.fechaActualizacion), "yyyy-MM-ddTHH:mm:ss.fffZ");
                        }

                    });
                   // self.grid.refresh();
                    return response;
                    },
                model: modelo ,
            },
            requestStart: function(e) {
                        ("request started");
                        },
            requestEnd: function(e) {
                        ("request started");
                        if (e.response){
                                if (e.type==='update'){
                                    bootbox.alert('El registro se ha actualizado con exito');
                                    }
                                 if (e.type==='create'){
                                    bootbox.alert('El registro se ha creado con exito');
                                    }
                                if (e.type==='destroy'){
                                    bootbox.alert('El registro se ha eliminado con exito');
                                    }
                            }
                       },
            error: function (e) {
                    bootbox.alert('Ha ocurrido una excepción en el sistema');
            }
        });
        function operacionesCompletas(options, operation, est,self) {
            options.models[0].usuarioUltMov = usuariologueado;
            if (self.configuracionCoordinadorExtraccion.campoAgEl) {
                if (self.configuracionCoordinadorExtraccion.tipocampoAgEl == "CoordinadorExtraccionCoordinadorExtraccion")
                    self.configuracionCoordinadorExtraccion.campoAgEl.coordinadorExtraccion2 = options.models[0];
                else
                    self.configuracionCoordinadorExtraccion.campoAgEl.coordinadorExtraccion = options.models[0];
                return JSON.stringify(self.configuracionCoordinadorExtraccion.campoAgEl);
            }else
            if (est.options[operation].data.models.coordinadorExtraccion) {
                est.options[operation].data.models.coordinadorExtraccion2 = options.models[0];
                return JSON.stringify(est.options[operation].data.models);
            }
            return JSON.stringify(options.models[0]);
        }
     }
    inicializaGrid() {
        if (this.permisosAtributos.length == 0 || this.permisosAtributos == null)
            return;
        if (this.permisosTabla == null || (this.permisosTabla && this.permisosTabla.permiso == 0))
            return;
        this.sourcegrid();
        var columnas = [];
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "id")) {
            columnas.push({ field: "id", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "id")  , editor: this.globalesService.txtNumero  });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "idregistroExtraccion")) {
            columnas.push({ field: "idregistroExtraccion", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "idregistroExtraccion") , editor: idregistroExtraccionDropDownEditor , template: " #if (idregistroExtraccion){#   #=idregistroExtraccion.fechaBaja# # } # "  });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "nombre")) {
            columnas.push({ field: "nombre", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "nombre") , editor: this.globalesService.txtTexto  });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "primerApellido")) {
            columnas.push({ field: "primerApellido", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "primerApellido") , editor: this.globalesService.txtTexto  });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "segundoApellido")) {
            columnas.push({ field: "segundoApellido", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "segundoApellido") , editor: this.globalesService.txtTexto  });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "fechaRegistro")) {
            columnas.push({ field: "fechaRegistro", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "fechaRegistro") , type:"date",
                  editor: this.globalesService.fechacomponente, format: "{0:MM/dd/yyyy h:mm:ss tt}" });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "fechaActualizacion")) {
            columnas.push({ field: "fechaActualizacion", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "fechaActualizacion") , type:"date",
                  editor: this.globalesService.fechacomponente, format: "{0:MM/dd/yyyy h:mm:ss tt}" });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "fechaBaja")) {
            columnas.push({ field: "fechaBaja", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "fechaBaja") , type:"date",
                  editor: this.globalesService.fechacomponente, format: "{0:MM/dd/yyyy h:mm:ss tt}" });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "usuarioUltMov")) {
            columnas.push({ field: "usuarioUltMov", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "usuarioUltMov") , editor: usuarioUltMovDropDownEditor , template: " #if (usuarioUltMov){#   #=usuarioUltMov.password# # } # "  });
        }
        if (this.globalesService.avisible(this,"coordinadorExtraccion", "status")) {
            columnas.push({ field: "status", title: this.globalesService.aetiqueta(this,"coordinadorExtraccion", "status") , editor: this.globalesService.estadoDropDownEditor,
                  template: "<img  style='width: 100%;' id='#=status#' src='assets/imagenes/png/#=status#.png'>" });
        }

        var op_agregar = [{ name: "create", text: "Agregar" }];
        if (!this.globalesService.pagregar(this,"coordinadorExtraccion")) op_agregar = [];
        var comandos = [];
        if (this.globalesService.pacutalizar(this,"coordinadorExtraccion")) {
            comandos.push({ name: "edit", text: "" });
        }
        if (this.globalesService.peliminar(this,"coordinadorExtraccion")) {
            comandos.push({ name: "destroy", text: "", template: '<a class="k-button k-button-icontext k-grid-delete" ><span class="fa fa-trash"></span></a>' });
        }
        if (this.globalesService.pbuscar(this,"coordinadorExtraccion")  && this.configuracionCoordinadorExtraccion.coordinadorExtraccionConsulta != null ) {
            comandos.push({ name: "seleccionar", text: "", click: this.showDetails, template: '<a class="k-button k-button-icontext k-grid-seleccionar" ><span class="fa fa-upload"></span></a>' });
        }
        columnas.push({
            command: comandos, title: "Acciones", width: "20%"
        });
        if (this.grid) $("#grid_coordinadorExtraccion_"+this.nombregrid).kendoGrid('destroy').empty();
        $("#grid_coordinadorExtraccion_"+this.nombregrid).kendoGrid({
            dataSource: this.dataSource,
            sortable: {
                mode: "single",
                allowUnsort: false
            },
            pageable: true,
            height: this.configuracionCoordinadorExtraccion.altoComponente,
            toolbar: op_agregar,
            columns: columnas,
            resizable: true,
            editable: {
                mode: "popup",
                window: {
                    resizable: true
                }
            }
        });
        this.grid = $("#grid_coordinadorExtraccion_"+this.nombregrid).data("kendoGrid");
        this.grid.refresh();

        var rutausuarioUltMov = this.urlprovider.serverURL + "usuario/getUsuariosActivos";
        var rutaidregistroExtraccion = this.urlprovider.serverURL + "registroExtraccion/getRegistroExtraccionesActivos";

        function usuarioUltMovDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataTextField: "username",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 5,                    dataSource: {
                        transport: {
                            read: {
                                url: rutausuarioUltMov,
                                contentType: "application/json",
                                type: "POST",
                            }
                        }
                    }
                });
        }
        function idregistroExtraccionDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataTextField: "tipoDonanteMultiorganico",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 5,                    dataSource: {
                        transport: {
                            read: {
                                url: rutaidregistroExtraccion,
                                contentType: "application/json",
                                type: "POST",
                            }
                        }
                    }
                });
        }

    }

    showDetails(e) {
        e.preventDefault();
        //        this.grid = $("#grid_coordinadorExtraccion_" + this.nombregrid).data("kendoGrid");
        var fila = $(e.currentTarget).closest("tr");
        let gridac = self[fila.closest('div[id^="grid"]').prop("id")];
        var dataItem = fila.closest('div[id^="grid"]').data("kendoGrid").dataItem(fila);
        gridac.coordinadorExtraccionSeleccionado = new CoordinadorExtraccion();
        gridac.coordinadorExtraccionSeleccionado.from(dataItem);
        gridac.evtCoordinadorExtraccionSeleccionado.emit(gridac.coordinadorExtraccionSeleccionado);
        (gridac.coordinadorExtraccionSeleccionado);
    }


}
