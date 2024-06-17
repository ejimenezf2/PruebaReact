import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

const Vacunas = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [vacunas, setVacunas] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchVacunas();
  }, []);

  const fetchVacunas = async () => {
    try {
      const response = await axios.get('http://localhost:5211/api/Vacuna/Show');
      setVacunas(response.data);
    } catch (error) {
      console.error("Hubo un error al obtener las vacunas:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'nombre',
      },
      {
        Header: 'Acciones',
        accessor: 'acciones',
        Cell: ({ row }) => (
          <div className="d-flex">
            <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowEditModal(row.original.id_Vacuna)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.original.id_Vacuna)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: vacunas,
      initialState: { pageIndex: 0, pageSize: 5 }, // Set initial page size
    },
    usePagination
  );

  const handleShowCreateModal = () => {
    setNombre('');
    setShowCreateModal(true);
  };

  const handleShowEditModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5211/api/Vacuna/obtener/${id}`);
      const data = response.data;
      setNombre(data.nombre);
      setCurrentId(data.id_Vacuna);
      setShowEditModal(true);
    } catch (error) {
      swal('Error', 'Hubo un error al obtener la vacuna', 'error');
      console.error('Hubo un error al obtener la vacuna:', error);
    }
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5211/api/Vacuna/Crear', { nombre });
      if (response.data.isSuccess) {
        swal('Vacuna creada con éxito', '', 'success');
        fetchVacunas();
        handleClose();
      } else {
        swal('Error', 'Error al crear la vacuna', 'error');
        console.error('Error al crear la vacuna');
      }
    } catch (error) {
      swal('Error', 'Hubo un error al enviar la solicitud', 'error');
      console.error('Hubo un error al enviar la solicitud:', error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put('http://localhost:5211/api/Vacuna/Editar', { id_Vacuna: currentId, nombre });
      if (response.data.isSuccess) {
        swal('Vacuna editada con éxito', '', 'success');
        fetchVacunas();
        handleClose();
      } else {
        swal('Error', 'Error al editar la vacuna', 'error');
        console.error('Error al editar la vacuna');
      }
    } catch (error) {
      swal('Error', 'Hubo un error al enviar la solicitud', 'error');
      console.error('Hubo un error al enviar la solicitud:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5211/api/Vacuna/Eliminar/${id}`);
      if (response.data.isSuccess) {
        swal('Vacuna eliminada con éxito', '', 'success');
        fetchVacunas(); // Actualiza la tabla después de eliminar
      } else {
        swal('Error', 'Error al eliminar la vacuna', 'error');
        console.error('Error al eliminar la vacuna');
      }
    } catch (error) {
      swal('Error', 'Hubo un error al enviar la solicitud', 'error');
      console.error('Hubo un error al enviar la solicitud:', error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0">Vacunas</h3>
              <button className="btn btn-primary ms-auto" onClick={handleShowCreateModal} style={{ width: 'auto' }}>Crear</button>  
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Mostrar </span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                  }}
                  className="form-select w-auto"
                >
                  {[5, 10, 20].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="table-responsive">
                <table {...getTableProps()} className="table table-striped table-bordered">
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span>
                  Página{' '}
                  <strong>
                    {pageIndex + 1} de {pageOptions.length}
                  </strong>{' '}
                </span>
                <div className="btn-group" role="group">
                  <button className="btn btn-outline-primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                  </button>{' '}
                  <button className="btn btn-outline-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                  </button>{' '}
                  <button className="btn btn-outline-primary" onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                  </button>{' '}
                  <button className="btn btn-outline-primary" onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
                    {'>>'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales para crear y editar */}

      {showCreateModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Vacuna</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Vacuna</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vacunas;
