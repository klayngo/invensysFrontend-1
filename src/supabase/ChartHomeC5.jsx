import React, { useRef, useState, useCallback, useEffect } from "react";
import moment from "moment-with-locales-es6";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-loading-skeleton/dist/skeleton.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import plus from "../assets/icons/plus.svg";
import { AG_GRID_LOCALE_EN } from "../locale/locale";

import { checkboxSelection } from "../components/ChackSelection";
import { headerCheckboxSelection } from "../components/ChackSelection";
import { setPrinterFriendly } from "../components/ChackSelection";
import { ChackSelection } from "../components/ChackSelection";
import { setNormal } from "../components/ChackSelection";
import { useGetUsers } from "../hooks/context/GetUsersContext";
import { TodoFunctions } from "../apis/ApiData";
import { Link, Outlet } from "react-router-dom";
import { getBusiness, getUsersAdmin } from "../apis/ApiData";


moment.locale("es");

export const ChartHomeC5 = () => {
  const { getUsersAdmins, getCountData } = useGetUsers();
  const [loading, setLoading] = useState(true);

  const [dataVentas, setDataVentas] = useState([]);

  useEffect(() => {
    const initial = async () => {
      await getUsersAdmins();
      const response = await TodoFunctions.getComprasFv();
      setDataVentas(response.data.responseFv);
      console.log("nnnn", dataVentas, "ñññ", response.data.responseFv);
      await getCountData();
      setLoading(false);

      const bussiness = await getBusiness();
      setCompras(bussiness.data.dataPedidos);
      setVentas(bussiness.data.dataCompras);
      const users = await getUsersAdmin();
      setUsers(users.data.data)

    };

    initial();
  }, []);

      const [ventas, setVentas] = useState([]);
    const [compras, setCompras] = useState([]);
    const [users, setUsers] = useState([])
    const [ventasF, setVentasF] = useState([]);
    const [totalCompras, setTotalCompras] = useState([]);
    let fecha = moment().format("l");

    useEffect(() => {
        (async () => {

            console.log("sirve");
            const bussiness = await getBusiness();
            console.log(bussiness);
            setCompras(bussiness.data.dataPedidoProvedor);
            setVentas(bussiness.data.dataCompras);
            const users = await getUsersAdmin();
            setUsers(users.data.data)

        })();
    }, []);
    console.log("compras", compras);

  const defaultColDef = ChackSelection();
  const gridRef = useRef();

  const [stateModel, StateModel] = useState(false);
  const [ExcelModel, setExcelModel] = useState(false);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Identificador",
      field: "_id",
      rowDrag: true,
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,
      filter: "agTextColumnFilter",
    },

    {
      headerName: "Nombre",
      field: "name",
      filter: "agTextColumnFilter",
      chartDataType: "series",
    },

    {
      headerName: "Cantidad",
      field: "cantidadProductos",
      chartDataType: "category",
      filter: "agTextColumnFilter",
    },

    {
        headerName: "Total",
        field: "totalCompra",
        chartDataType: "category",
        filter: "agTextColumnFilter",
    },
    {
      headerName: "Mayores Precios",
      field: 'change',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'bar',
          fill: '#019afa',
          stroke: '#91cc75',
          highlightStyle: {
            fill: '#5994f5',
          },
          valueAxisDomain: [0, 1],
          paddingOuter: 0,
          padding: {
            top: 0,
            bottom: 0,
          },
          axis: {
            strokeWidth: 0,
          },
        },
      },
    },
    {
      headerName: "Fecha",
      field: "fecha",
      chartDataType: "category",
      filter: "agTextColumnFilter",
    },


  ]);

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onBtExportExel = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);
  const onBtPrint = useCallback(() => {
    const api = gridRef.current.api;
    setPrinterFriendly(api);
    setTimeout(function () {
      window.print();
      setNormal(api);
    }, 2000);
  }, []);
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);
  const money = new Intl.NumberFormat("en-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  });
  return (
    <>
      {dataVentas.length > 0 ? (
        <>

          <div className="panel_second_h w-[100%] mx-auto flex-col lg:flex-row flex justify-between items-center">
          <div className="buttons">
          <h1 className="font-bold text-xl">Compras</h1>
          </div>

            <div className="search bg-white mb-3 flex items-center p-2 rounded-full justify-end my-5">
              <div className="icon_search mx-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 16 16"
                >
                  <g transform="translate(16 0) scale(-1 1)">
                    <path
                      fill="#ABB2B9"
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0z"
                    />
                  </g>
                </svg>
              </div>
              <div className="input_panel">
                <input
                  type="text"
                  id="filter-text-box"
                  placeholder="Buscar..."
                  onInput={onFilterTextBoxChanged}
                  className="outline-none"
                />
              </div>
            </div>
          </div>
          <div
            className="ag-theme-alpine shadow-2xl mx-auto "
            id="myGrid"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              ref={gridRef}
              localeText={AG_GRID_LOCALE_EN}
              columnDefs={columnDefs}
              rowData={compras.map((item, i) => {
                return {
                  _id: item._id,
                  name: item.name,
                  cantidadProductos: item.cantidadProductos,
                  totalCompra: ("$ " + item.totalComprap).replace(
                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                    "$1,"
                  ),
                  change:[item.totalComprap],
                  total: ("$ " + item.totalComprap).replace(
                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                    "$1,"
                  ),
                  fecha: moment(item.createdAt)
                    .startOf(item.createdAt)
                    .fromNow(),
                };
              })}
              defaultColDef={defaultColDef}
              animateRows={true}

              rowDragManaged={true}
              enableRangeSelection={true}
              icons={true}
              pagination={true}
              paginationPageSize={10}
              paginateChildRows={true}
              suppressRowClickSelection={true}
              groupSelectsChildren={true}
              rowSelection={"multiple"}
              enableCharts={true}
              cacheQuickFilter={true}
            ></AgGridReact>
          </div>
          <Outlet />
        </>
      ) : null}
    </>
  );
};