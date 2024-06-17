import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Empleado = () => {
  const [data, setData] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [estadosVacuna, setEstadosVacuna] = useState([]);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    cod_Empleado: '',
    nombre: '',
    apellido: '',
    puesto_Laboral: '',
    id_Vacuna: '',
    fecha_Primer_Dosis: '',
    estado_Vacunacion: '',
  });
  const [editForm, setEditForm] = useState({
    cod_Empleado: '',
    nombre: '',
    apellido: '',
    puesto_Laboral: '',
    id_Vacuna: '',
    fecha_Primer_Dosis: '',
    estado_Vacunacion: '',
  });

  const fetchData = () => {
    axios.get('http://localhost:5211/api/Empleado/Show')
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    axios.get('http://localhost:5211/api/Vacuna/Show')
      .then(response => {
        setVacunas(response.data);
      })
      .catch(error => {
        console.error('Error fetching vacunas:', error);
      });

    axios.get('http://localhost:5211/api/EstadoVacunacion/Show')
      .then(response => {
        setEstadosVacuna(response.data);
      })
      .catch(error => {
        console.error('Error fetching estados vacunacion:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseEdit = () => setShowEdit(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingEmployee = data.find(emp => emp.cod_Empleado === parseInt(form.cod_Empleado));
    if (existingEmployee) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El código del empleado ya existe',
        showConfirmButton: true,
      });
      return;
    }

    const formData = {
      ...form,
      id_Vacuna: form.id_Vacuna === '' ? null : form.id_Vacuna,
      fecha_Primer_Dosis: form.fecha_Primer_Dosis === '' ? null : form.fecha_Primer_Dosis
    };

    axios.post('http://localhost:5211/api/Empleado/Crear', formData)
      .then(response => {
        fetchData();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Empleado creado con éxito',
          showConfirmButton: false,
          timer: 1500
        });
        setForm({
          cod_Empleado: '',
          nombre: '',
          apellido: '',
          puesto_Laboral: '',
          id_Vacuna: '',
          fecha_Primer_Dosis: '',
          estado_Vacunacion: '',
        });
      })
      .catch(error => {
        console.error('Error al crear Empleado:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data,
          showConfirmButton: true,
        });
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ...editForm,
      id_Vacuna: editForm.id_Vacuna === '' ? null : editForm.id_Vacuna,
      fecha_Primer_Dosis: editForm.fecha_Primer_Dosis === '' ? null : editForm.fecha_Primer_Dosis
    };

    axios.put('http://localhost:5211/api/Empleado/Editar', formData)
      .then(response => {
        fetchData();
        handleCloseEdit();
        Swal.fire({
          icon: 'success',
          title: 'Empleado actualizado con éxito',
          showConfirmButton: false,
          timer: 1500
        });
        setEditForm({
          cod_Empleado: '',
          nombre: '',
          apellido: '',
          puesto_Laboral: '',
          id_Vacuna: '',
          fecha_Primer_Dosis: '',
          estado_Vacunacion: '',
        });
      })
      .catch(error => {
        console.error('Error updating employee:', error);
      });
  };

  const handleEditClick = (cod_Empleado) => {
    axios.get(`http://localhost:5211/api/Empleado/Obtener/${cod_Empleado}`)
      .then(response => {
        const employee = response.data;
        if (employee.fecha_Primer_Dosis) {
          employee.fecha_Primer_Dosis = new Date(employee.fecha_Primer_Dosis).toISOString().split('T')[0];
        }
        setEditForm(employee);
        handleShowEdit();
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
  };

  const handleDeleteClick = (cod_Empleado) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5211/api/Empleado/Eliminar/${cod_Empleado}`)
          .then(response => {
            fetchData();
            Swal.fire(
              'Eliminado!',
              'El empleado ha sido eliminado.',
              'success'
            );
          })
          .catch(error => {
            console.error('Error deleting employee:', error);
          });
      }
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Codigo Empleado',
        accessor: 'cod_Empleado',
      },
      {
        Header: 'Nombre',
        accessor: 'nombre',
      },
      {
        Header: 'Apellido',
        accessor: 'apellido',
      },
      {
        Header: 'Puesto Laboral',
        accessor: 'puesto_Laboral',
      },
      {
        Header: 'Vacuna',
        accessor: 'nombre_Vacuna',
      },
      {
        Header: 'Fecha Primer Dosis',
        accessor: 'fecha_Primer_Dosis',
        Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
      },
      {
        Header: 'Estado Vacuna',
        accessor: 'estado_Vacuna',
      },
      {
        Header: 'Acciones',
        accessor: 'acciones',
        Cell: ({ row }) => (
          <div className="d-flex">
            <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditClick(row.original.cod_Empleado)}>
              <i className="fas fa-pencil-alt"></i>
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(row.original.cod_Empleado)}>
              <i className="fas fa-trash"></i>
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
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    usePagination
  );

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0">Empleado</h3>
              <button className="btn btn-primary ms-auto" onClick={handleShow} style={{ width: 'auto' }}>Crear</button>  
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Mostrar </span>
                <select
                  className="form-select w-auto"
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <table {...getTableProps()} className="table table-striped">
                <thead>
                  {headerGroups.map(headerGroup => {
                    const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                    return (
                      <tr key={key} {...headerGroupProps}>
                        {headerGroup.headers.map(column => {
                          const { key, ...headerProps } = column.getHeaderProps();
                          return (
                            <th key={key} {...headerProps}>{column.render('Header')}</th>
                          );
                        })}
                      </tr>
                    );
                  })}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map(row => {
                    prepareRow(row);
                    const { key, ...rowProps } = row.getRowProps();
                    return (
                      <tr key={key} {...rowProps}>
                        {row.cells.map(cell => {
                          const { key, ...cellProps } = cell.getCellProps();
                          return (
                            <td key={key} {...cellProps}>{cell.render('Cell')}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span>
                    Página{' '}
                    <strong>
                      {pageIndex + 1} de {pageOptions.length}
                    </strong>{' '}
                  </span>
                </div>
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
                  <button className="btn btn-outline-primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                  </button>{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Codigo Empleado</Form.Label>
              <Form.Control
                type="number"
                name="cod_Empleado"
                value={form.cod_Empleado}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Puesto Laboral</Form.Label>
              <Form.Control
                type="text"
                name="puesto_Laboral"
                value={form.puesto_Laboral}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Vacuna</Form.Label>
              <Form.Control
                as="select"
                name="id_Vacuna"
                value={form.id_Vacuna}
                onChange={handleChange}
              >
                <option value="">Seleccione una vacuna</option>
                {vacunas.map(vacuna => (
                  <option key={vacuna.id_Vacuna} value={vacuna.id_Vacuna}>
                    {vacuna.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha Primer Dosis</Form.Label>
              <Form.Control
                type="date"
                name="fecha_Primer_Dosis"
                value={form.fecha_Primer_Dosis}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado Vacuna</Form.Label>
              <Form.Control
                as="select"
                name="estado_Vacunacion"
                value={form.estado_Vacunacion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un estado</option>
                {estadosVacuna.map(estado => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group>
              <Form.Label>Codigo Empleado</Form.Label>
              <Form.Control
                type="number"
                name="cod_Empleado"
                value={editForm.cod_Empleado}
                onChange={handleEditChange}
                required
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={editForm.nombre}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={editForm.apellido}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Puesto Laboral</Form.Label>
              <Form.Control
                type="text"
                name="puesto_Laboral"
                value={editForm.puesto_Laboral}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Vacuna</Form.Label>
              <Form.Control
                as="select"
                name="id_Vacuna"
                value={editForm.id_Vacuna}
                onChange={handleEditChange}
              >
                <option value="">Seleccione una vacuna</option>
                {vacunas.map(vacuna => (
                  <option key={vacuna.id_Vacuna} value={vacuna.id_Vacuna}>
                    {vacuna.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha Primer Dosis</Form.Label>
              <Form.Control
                type="date"
                name="fecha_Primer_Dosis"
                value={editForm.fecha_Primer_Dosis}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado Vacuna</Form.Label>
              <Form.Control
                as="select"
                name="estado_Vacunacion"
                value={editForm.estado_Vacunacion}
                onChange={handleEditChange}
                required
              >
                <option value="">Seleccione un estado</option>
                {estadosVacuna.map(estado => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Actualizar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Empleado;
