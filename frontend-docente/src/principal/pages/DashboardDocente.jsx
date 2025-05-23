import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { logout } from '../../seguridad/slices/authSlice';
import * as XLSX from 'xlsx';

export const DashboardDocente = () => {
  const user = useSelector(state => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('gestion-alumnos');
  const [excelData, setExcelData] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    // Limpiar el estado de Redux
    dispatch(logout());
    
    // Navegar al login
    navigate('/auth/login');
    
    console.log('Sesión cerrada correctamente');
  };

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setFileName(file.name);
  
  // Verificar que sea un archivo Excel o CSV
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
    alert('Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv)');
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = e.target.result;
      let processedData = [];
      let headers = [];

      if (fileExtension === 'csv') {
        // Procesar archivo CSV
        const text = data;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
          alert('El archivo CSV está vacío');
          return;
        }

        // Extraer headers de la primera línea
        headers = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
        
        // Procesar las filas de datos (omitir la primera línea que son headers)
        const dataLines = lines.slice(1);
        
        processedData = dataLines.map(line => {
          const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
          const rowObj = {};
          
          headers.forEach((header, index) => {
            rowObj[header] = columns[index] || '';
          });
          
          return rowObj;
        });

      } else {
        // Procesar archivos Excel (.xlsx, .xls)
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Obtener la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir la hoja a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          alert('El archivo Excel está vacío');
          return;
        }
        
        // La primera fila contiene los headers
        headers = jsonData[0].map(header => String(header || '').trim());
        
        // Las siguientes filas contienen los datos
        const dataRows = jsonData.slice(1);
        
        processedData = dataRows
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== '')) // Filtrar filas vacías
          .map(row => {
            const rowObj = {};
            headers.forEach((header, index) => {
              rowObj[header] = String(row[index] || '').trim();
            });
            return rowObj;
          });
      }
      
      // Actualizar el estado con los datos procesados
      setExcelHeaders(headers);
      setExcelData(processedData);
      
      console.log(`Datos cargados: ${processedData.length} registros con ${headers.length} columnas`);
      console.log('Headers:', headers);
      console.log('Datos:', processedData);
      
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      alert('Error al procesar el archivo. Verifica que sea un archivo válido.');
    }
  };
  
  // Leer como texto para CSV o como ArrayBuffer para Excel
  if (fileExtension === 'csv') {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
  }
};

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const menuItems = [
    { id: 'gestion-alumnos', icon: '👥', label: 'Gestión de Alumnos' },
    { id: 'cargar-datos', icon: '📁', label: 'Cargar datos' },
    { id: 'creacion-cursos', icon: '📚', label: 'Creación de Cursos' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Menú Lateral */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px 0',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          padding: '0 20px',
          marginBottom: '30px',
          borderBottom: '1px solid #34495e',
          paddingBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#ecf0f1' }}>Menú</h2>
        </div>
        
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedSection(item.id)}
            style={{
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: selectedSection === item.id ? '#3498db' : 'transparent',
              borderLeft: selectedSection === item.id ? '4px solid #2980b9' : '4px solid transparent',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              if (selectedSection !== item.id) {
                e.currentTarget.style.backgroundColor = '#34495e';
              }
            }}
            onMouseOut={(e) => {
              if (selectedSection !== item.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Contenido Principal */}
      <div style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px 30px',
          borderBottom: '1px solid #bdc3c7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.8rem' }}>
            Dashboard Docente
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#7f8c8d' }}>
              👤 {user?.email || 'Docente'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido Principal Dinámico */}
        <div style={{ padding: '30px' }}>
          {selectedSection === 'gestion-alumnos' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
                Gestión de alumnos
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px'
              }}>
                {/* Panel Izquierdo - Registro */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  height: 'fit-content'
                }}>
                  <h3 style={{ 
                    color: '#3498db', 
                    textAlign: 'center',
                    marginTop: 0,
                    marginBottom: '30px',
                    fontSize: '1.3rem'
                  }}>
                    Registro individual de alumnos
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Código:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Facultad:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Programa:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Nombres:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Apellidos:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Correo:
                    </label>
                    <input
                      type="email"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'background-color 0.3s'
                  }}>
                    Registrar
                  </button>
                </div>

                {/* Panel Derecho - Información del Alumno */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  height: 'fit-content'
                }}>
                  <h3 style={{ 
                    color: '#3498db', 
                    textAlign: 'center',
                    marginTop: 0,
                    marginBottom: '30px',
                    fontSize: '1.3rem'
                  }}>
                    Alumno
                  </h3>

                  {/* Avatar del estudiante */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '30px'
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: '#e8d5f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      👤
                    </div>
                  </div>

                  {/* Información del alumno */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #ecf0f1'
                    }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Código:</span>
                      <span style={{ color: '#7f8c8d' }}>20200291</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #ecf0f1'
                    }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Facultad:</span>
                      <span style={{ color: '#7f8c8d', fontSize: '0.9rem', textAlign: 'right' }}>
                        20 - INGENIERÍA DE SISTEMAS E INFORMÁTICA
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #ecf0f1'
                    }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Programa:</span>
                      <span style={{ color: '#7f8c8d', fontSize: '0.9rem', textAlign: 'right' }}>
                        2 - E.P. de Ingeniería de Software
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #ecf0f1'
                    }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Nombres:</span>
                      <span style={{ color: '#7f8c8d' }}>Antony</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #ecf0f1'
                    }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Apellidos:</span>
                      <span style={{ color: '#7f8c8d' }}>Lujan Roldan</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0'
                    }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>Correo:</span>
                      <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                        antony.lujanroldan@unmsm.edu.pe
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'cargar-datos' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
                Cargar datos
              </h2>
              
              {/* Input oculto para archivos */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              {/* Botón Importar Excel */}
              <div style={{ marginBottom: '40px' }}>
                <button 
                  onClick={handleImportClick}
                  style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  Importar Excel
                  <span style={{
                    backgroundColor: '#27ae60',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    📊 X
                  </span>
                </button>
                
                {fileName && (
                  <p style={{ 
                    marginTop: '10px', 
                    color: '#27ae60', 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    ✅ Archivo cargado: {fileName}
                  </p>
                )}
              </div>

              {/* Vista previa */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#2c3e50', fontSize: '1.2rem', marginBottom: '20px' }}>
                  Vista previa {excelData.length > 0 && `(${excelData.length} registros)`}
                </h3>
              </div>

              {/* Tabla de datos DINÁMICA */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'auto',
                maxHeight: '500px'
              }}>
                {excelHeaders.length > 0 ? (
                  <>
                    {/* Headers dinámicos de la tabla */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${excelHeaders.length}, 1fr)`,
                      gap: '10px',
                      marginBottom: '15px',
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'white',
                      zIndex: 1
                    }}>
                      {excelHeaders.map((header, index) => (
                        <div key={index} style={{
                          backgroundColor: '#e8eef7',
                          padding: '12px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          fontWeight: '500',
                          color: '#2c3e50',
                          fontSize: '0.9rem'
                        }}>
                          {header}
                        </div>
                      ))}
                    </div>

                    {/* Datos reales del archivo */}
                    {excelData.map((row, index) => (
                      <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${excelHeaders.length}, 1fr)`,
                        gap: '10px',
                        marginBottom: '10px'
                      }}>
                        {excelHeaders.map((header, headerIndex) => (
                          <div key={headerIndex} style={{
                            backgroundColor: '#f8f9fa',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #e9ecef',
                            fontSize: '0.9rem',
                            color: '#2c3e50',
                            wordBreak: 'break-word'
                          }}>
                            {row[header] || ''}
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                ) : (
                  // Mensaje cuando no hay datos
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#6c757d',
                    fontSize: '1.1rem'
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '20px'
                    }}>
                      📊
                    </div>
                    <p style={{ margin: 0 }}>
                      No hay datos para mostrar
                    </p>
                    <p style={{ 
                      margin: '10px 0 0 0', 
                      fontSize: '0.9rem',
                      color: '#adb5bd' 
                    }}>
                      Selecciona un archivo para ver la vista previa
                    </p>
                  </div>
                )}
              </div>

              {/* Mensaje informativo */}
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: excelData.length > 0 ? '#d4edda' : '#e3f2fd',
                borderRadius: '8px',
                borderLeft: `4px solid ${excelData.length > 0 ? '#28a745' : '#2196f3'}`
              }}>
                <p style={{ 
                  margin: 0, 
                  color: excelData.length > 0 ? '#155724' : '#1976d2', 
                  fontSize: '0.9rem' 
                }}>
                  {excelData.length > 0 ? (
                    <>✅ ¡Archivo cargado exitosamente! Se encontraron {excelData.length} registros con {excelHeaders.length} columnas.</>
                  ) : (
                    <>💡 Selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv) para cargar los datos. 
                    El sistema detectará automáticamente las cabeceras y mostrará todos los registros.</>
                  )}
                </p>
              </div>

              {/* Botón para procesar datos */}
              {excelData.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                  >
                    Procesar y Guardar Datos ({excelData.length} registros)
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'creacion-cursos' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
                Creación Cursos
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px'
              }}>
                {/* Panel Izquierdo - Lista de Cursos */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  height: 'fit-content'
                }}>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    marginTop: 0,
                    marginBottom: '20px',
                    fontSize: '1.3rem'
                  }}>
                    Cursos
                  </h3>
                  
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6c757d',
                    fontSize: '1rem',
                    marginBottom: '30px'
                  }}>
                    No presenta cursos registrados
                  </div>

                  {/* Botón flotante + */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '20px'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '3px solid #3498db',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '2rem',
                      color: '#3498db',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s'
                    }}>
                      +
                    </div>
                  </div>
                </div>

                {/* Panel Derecho - Registro de Curso */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  height: 'fit-content'
                }}>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    textAlign: 'center',
                    marginTop: 0,
                    marginBottom: '30px',
                    fontSize: '1.3rem'
                  }}>
                    Registro de Curso
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Código:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Asignatura:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Sección:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Semestre:
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8eef7',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Botones */}
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center'
                  }}>
                    <button style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '12px 25px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'background-color 0.3s'
                    }}>
                      Cancelar
                    </button>
                    
                    <button style={{
                      backgroundColor: '#2c3e50',
                      color: 'white',
                      border: 'none',
                      padding: '12px 25px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'background-color 0.3s'
                    }}>
                      Generar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};