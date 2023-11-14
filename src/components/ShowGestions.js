import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from "../functions";
import Select from "react-select";

const ShowGestions = () => {
  const url = "http://localhost:8090/gestions";
  const [gestions, setGestions] = useState([]);
  const [uuid, setUuid] = useState("");
  const [yearG, setYearG] = useState("");
  const [semesterG, setSemesterG] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getGestions();
  }, []);
  const getGestions = async () => {
    const response = await axios.get(url);
    setGestions(response.data);
  };

  const openModal = (op, uuid, yearG, semesterG) => {
    setUuid("");
    setYearG("");
    setSemesterG("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar Gestion");
    } else if (op === 2) {
      setTitle("Editar Gestion");
      setUuid(uuid);
      setYearG(yearG);
      setSemesterG(semesterG);
      setOperation(op);
    }
    window.setTimeout(function () {
      document.getElementById("year").focus();
    }, 500);
  };
  const validar = () => {
    var parametros;
    var metodo;
    if (yearG === "") {
      show_alert("Escribe el año de la gestion", "warning");
    } else if (semesterG === "") {
      show_alert("Escribe el semestre de la gestion", "warning");
    } else if (operation === 1) {
      parametros = { num: semesterG, year: yearG };
      metodo = "POST";
    } else {
      parametros = {
        uuid: uuid,
        num: semesterG,
        year: yearG,
      };
      metodo = "PUT";
    }
    enviarSolicitud(metodo, parametros);
  };
  const enviarSolicitud = async (metodo, parametros) => {
    if (metodo === "PUT") {
      await axios({ method: metodo, url: url + "/" + uuid, data: parametros })
        .then(function (response) {
          show_alert("Gestion Modificada", "success");
          document.getElementById("btnCerrar").click();
          getGestions();
        })
        .catch(function (error) {
          show_alert("Error en la solicitud", "error");
          console.log(error);
        });
    } else if (metodo === "POST") {
      await axios({ method: metodo, url: url, data: parametros })
        .then(function (response) {
          show_alert("Gestion Creada", "success");
          document.getElementById("btnCerrar").click();
          getGestions();
        })
        .catch(function (error) {
          show_alert("Error en la solicitud", "error");
          console.log(error);
        });
    } else if (metodo === "DELETE") {
      await axios({
        method: metodo,
        url: url + "/" + parametros.uuid,
        data: parametros,
      })
        .then(function (response) {
          show_alert("Gestion Eliminada", "success");
          document.getElementById("btnCerrar").click();
          getGestions();
        })
        .catch(function (error) {
          show_alert("Error en la solicitud", "error");
          console.log(error);
        });
    }
  };
  const deleteGestion = (id, name) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Seguro de eliminar la Gestion " + name + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setUuid(id);
        enviarSolicitud("DELETE", { uuid: id });
      } else {
        show_alert("La Gestion no fue Eliminada", "info");
      }
    });
  };
  const optionsSemester = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
  ];
  const optionsYears = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
  ];
  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => {
                  openModal(1);
                }}
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalGestions"
              >
                <i className="fa-solid fa-circle-plus"></i> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-2 offset-lg-12">
            <div className="table-responsive">
              <div className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Gestion</th>
                    <th>Semestre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {gestions.map((gestion, i) => (
                    <tr key={gestion.uuid}>
                      <td>{i + 1}</td>
                      <td>{gestion.year}</td>
                      <td>{gestion.num}</td>
                      <td>
                        <button
                          onClick={() => {
                            openModal(
                              2,
                              gestion.uuid,
                              gestion.year,
                              gestion.num
                            );
                          }}
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalGestions"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => {
                            deleteGestion(gestion.uuid, gestion.year);
                          }}
                          className="btn btn-danger"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modalGestions" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{title}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <Select
                  options={optionsYears}
                  id="year"
                  className="form-control"
                  onChange={(e) => setYearG(e.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <Select
                  options={optionsSemester}
                  id="semestre"
                  className="form-control"
                  onChange={(e) => setSemesterG(e.value)}
                />
              </div>

              <div className="d-grid col-6 mx-auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk">Guardar</i>
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowGestions;
