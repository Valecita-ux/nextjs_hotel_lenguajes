// app/admin/reportes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icons
const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const COLORS = ['#E91E63', '#F06292', '#FF4081', '#EC407A', '#F48FB1', '#FCE4EC'];

export default function AdminReportesPage() {
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState<any>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    setFechaFin(hoy.toISOString().split('T')[0]);
    setFechaInicio(haceUnMes.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarReportes();
    }
  }, [fechaInicio, fechaFin]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/reportes?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
      );
      const data = await response.json();

      if (data.success) {
        setReportes(data.reportes);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarReporte = async () => {
    if (!reportes) return;

    try {
      // Crear el contenido HTML del reporte
      const contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              color: #333; 
              background: #FFF8F0;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #7B1D26; 
              padding-bottom: 20px; 
            }
            .logo-container {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
              margin-bottom: 15px;
            }
            .logo-flower {
              width: 60px;
              height: 60px;
              fill: #7B1D26;
            }
            .header h1 { 
              color: #7B1D26; 
              margin: 0; 
              font-size: 32px; 
              font-family: 'Playfair Display', serif;
              font-weight: 700;
            }
            .header .subtitle {
              color: #895A49;
              margin: 5px 0 0 0;
              font-family: 'Cormorant Garamond', serif;
              font-style: italic;
              font-size: 16px;
            }
            .header p { 
              color: #666; 
              margin: 10px 0 0 0; 
              font-family: 'Inter', sans-serif;
            }
            .periodo { 
              background: #E4CDDD; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 30px; 
              text-align: center;
              font-family: 'Inter', sans-serif;
            }
            .metricas { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .metrica { 
              background: white; 
              padding: 20px; 
              border-radius: 8px; 
              border-left: 4px solid #7B1D26; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .metrica-titulo { 
              font-size: 12px; 
              color: #666; 
              margin-bottom: 5px; 
              font-family: 'Inter', sans-serif;
            }
            .metrica-valor { 
              font-size: 24px; 
              font-weight: bold; 
              color: #7B1D26; 
              font-family: 'Playfair Display', serif;
            }
            .seccion { margin-bottom: 30px; }
            .seccion-titulo { 
              font-size: 18px; 
              font-weight: bold; 
              color: #7B1D26; 
              margin-bottom: 15px; 
              border-bottom: 2px solid #CA99AB; 
              padding-bottom: 10px; 
              font-family: 'Playfair Display', serif;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 15px; 
              background: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            th { 
              background: #7B1D26; 
              color: white; 
              padding: 12px; 
              text-align: left; 
              font-size: 12px; 
              font-family: 'Inter', sans-serif;
            }
            td { 
              padding: 10px; 
              border-bottom: 1px solid #eee; 
              font-size: 12px; 
              font-family: 'Inter', sans-serif;
            }
            tr:hover { background: #FFF8F0; }
            .lista-item { 
              background: white; 
              padding: 12px; 
              margin-bottom: 8px; 
              border-radius: 6px; 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .numero { 
              background: linear-gradient(135deg, #7B1D26, #CA99AB); 
              color: white; 
              width: 30px; 
              height: 30px; 
              border-radius: 50%; 
              display: inline-flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: bold; 
              margin-right: 10px; 
              font-family: 'Playfair Display', serif;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              color: #999; 
              font-size: 11px; 
              border-top: 1px solid #E4CDDD; 
              padding-top: 20px; 
              font-family: 'Inter', sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <svg class="logo-flower" viewBox="0 0 24 24">
                <path d="M12 22c-1.1 0-2-.9-2-2v-2.17c-1.17-.41-2.2-1.09-3.07-1.97l-1.53.88c-.95.55-2.17.22-2.72-.73-.55-.95-.22-2.17.73-2.72l1.53-.88c-.29-.96-.46-1.96-.46-3 0-1.04.17-2.04.46-3l-1.53-.88c-.95-.55-1.28-1.77-.73-2.72.55-.95 1.77-1.28 2.72-.73l1.53.88c.87-.88 1.9-1.56 3.07-1.97V2c0-1.1.9-2 2-2s2 .9 2 2v2.17c1.17.41 2.2 1.09 3.07 1.97l1.53-.88c.95-.55 2.17-.22 2.72.73.55.95.22 2.17-.73 2.72l-1.53.88c.29.96.46 1.96.46 3 0 1.04-.17 2.04-.46 3l1.53.88c.95.55 1.28 1.77.73 2.72-.55.95-1.77 1.28-2.72.73l-1.53-.88c-.87.88-1.9 1.56-3.07 1.97V20c0 1.1-.9 2-2 2zm0-8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
              </svg>
            </div>
            <h1>The Rose Garden Hotel</h1>
            <p class="subtitle">Hotel & Spa</p>
            <p>Reporte de Gestión Hotelera</p>
          </div>

          <div class="periodo">
            <strong>Período de Análisis:</strong> ${new Date(fechaInicio).toLocaleDateString('es-AR')} - ${new Date(fechaFin).toLocaleDateString('es-AR')}
          </div>

          <div class="metricas">
            <div class="metrica">
              <div class="metrica-titulo"> INGRESOS TOTALES</div>
              <div class="metrica-valor">${reportes.metricas.ingresosTotales.toLocaleString()}</div>
            </div>
            <div class="metrica">
              <div class="metrica-titulo"> TOTAL RESERVAS</div>
              <div class="metrica-valor">${reportes.metricas.totalReservas}</div>
            </div>
            <div class="metrica">
              <div class="metrica-titulo">⏱ DURACIÓN PROMEDIO</div>
              <div class="metrica-valor">${reportes.metricas.duracionPromedio} días</div>
            </div>
            <div class="metrica">
              <div class="metrica-titulo"> TASA CANCELACIÓN</div>
              <div class="metrica-valor">${reportes.metricas.tasaCancelacion}%</div>
            </div>
          </div>

          <div class="seccion">
            <div class="seccion-titulo"> Ingresos por Método de Pago</div>
            ${reportes.ingresosPorMetodo.map((item: any) => `
              <div class="lista-item">
                <span><strong>${item.metodo.toUpperCase()}</strong> (${item.cantidad} transacciones)</span>
                <span style="color: #E91E63; font-weight: bold; font-size: 16px;">${item.ingresos.toLocaleString()}</span>
              </div>
            `).join('')}
          </div>

          <div class="seccion">
            <div class="seccion-titulo"> Reservas por Tipo de Habitación</div>
            ${reportes.reservasPorTipo.map((item: any) => `
              <div class="lista-item">
                <span><strong>${item.tipo.toUpperCase()}</strong></span>
                <span style="color: #E91E63; font-weight: bold; font-size: 16px;">${item.cantidad} reservas</span>
              </div>
            `).join('')}
          </div>

          <div class="seccion">
            <div class="seccion-titulo"> Top 10 Clientes</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Reservas</th>
                  <th>Total Gastado</th>
                </tr>
              </thead>
              <tbody>
                ${reportes.topClientes.map((cliente: any, idx: number) => `
                  <tr>
                    <td><span class="numero">${idx + 1}</span></td>
                    <td><strong>${cliente.nombre}</strong></td>
                    <td>${cliente.correo}</td>
                    <td style="color: #2196F3; font-weight: bold;">${cliente.reservas}</td>
                    <td style="color: #4CAF50; font-weight: bold;">${cliente.totalGastado.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          

          <div class="seccion">
            <div class="seccion-titulo"> Servicios Más Solicitados</div>
            ${reportes.serviciosMasSolicitados.map((servicio: any, idx: number) => `
              <div class="lista-item">
                <span><span class="numero">${idx + 1}</span> <strong>${servicio.nombre}</strong></span>
                <span style="color: #7B1D26; font-weight: bold;">${servicio.cantidad} unidades</span>
              </div>
            `).join('')}
          </div>

          <div class="seccion">
            <div class="seccion-titulo" Actividades Más Reservadas</div>
            ${reportes.actividadesMasReservadas.map((actividad: any, idx: number) => `
              <div class="lista-item">
                <span><span class="numero">${idx + 1}</span> <strong>${actividad.nombre}</strong></span>
                <span style="color: #7B1D26; font-weight: bold;">${actividad.reservas} reservas</span>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>Reporte generado el ${new Date().toLocaleString('es-AR')}</p>
            <p><strong>The Rose Garden Hotel</strong> - Sistema de Gestión Hotelera</p>
          </div>
        </body>
        </html>
      `;

      // Crear una ventana temporal para imprimir
      const ventana = window.open('', '_blank');
      if (ventana) {
        ventana.document.write(contenidoHTML);
        ventana.document.close();
        
        // Esperar a que cargue y luego imprimir
        setTimeout(() => {
          ventana.print();
        }, 500);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el reporte');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-600 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!reportes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No se pudieron cargar los reportes</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-playfair text-4xl font-bold mb-2">Reportes y Análisis</h1>
              <p className="font-inter text-lg text-white/90">
                Consultas parametrizadas y métricas de negocio
              </p>
            </div>
            <button
              onClick={exportarReporte}
              className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-white text-pink-600 rounded-xl hover:bg-pink-50 transition-colors shadow-lg font-inter font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Exportar Reporte</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selector de Fechas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              <span className="font-inter text-sm font-semibold text-gray-700">Periodo:</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <span className="text-gray-500">hasta</span>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button
              onClick={cargarReportes}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg hover:from-pink-700 hover:to-rose-600 transition-colors font-inter font-semibold"
            >
              Generar
            </button>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-inter text-sm text-gray-600 mb-1">Ingresos Totales</p>
            <p className="font-playfair text-3xl font-bold text-green-600">
              ${reportes.metricas.ingresosTotales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <p className="font-inter text-sm text-gray-600 mb-1">Total Reservas</p>
            <p className="font-playfair text-3xl font-bold text-blue-600">
              {reportes.metricas.totalReservas}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <p className="font-inter text-sm text-gray-600 mb-1">Duración Promedio</p>
            <p className="font-playfair text-3xl font-bold text-purple-600">
              {reportes.metricas.duracionPromedio} días
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="font-inter text-sm text-gray-600 mb-1">Tasa Cancelación</p>
            <p className="font-playfair text-3xl font-bold text-red-600">
              {reportes.metricas.tasaCancelacion}%
            </p>
          </div>
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ingresos por Método de Pago */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Ingresos por Método de Pago
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportes.ingresosPorMetodo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ payload, value }) => `${payload.metodo}: $${value.toLocaleString()}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="ingresos"
                >
                  {reportes.ingresosPorMetodo.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Reservas por Tipo de Habitación */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Reservas por Tipo de Habitación
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportes.reservasPorTipo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="tipo" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#E91E63" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ocupación por Mes */}
        

        {/* Top 10 Clientes */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
            Top 10 Clientes (Mayor Facturación)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-inter text-xs font-semibold text-gray-700 uppercase">
                    #
                  </th>
                  <th className="px-6 py-3 text-left font-inter text-xs font-semibold text-gray-700 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left font-inter text-xs font-semibold text-gray-700 uppercase">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left font-inter text-xs font-semibold text-gray-700 uppercase">
                    Reservas
                  </th>
                  <th className="px-6 py-3 text-left font-inter text-xs font-semibold text-gray-700 uppercase">
                    Total Gastado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportes.topClientes.map((cliente: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-rose-500 rounded-full flex items-center justify-center text-white font-bold font-playfair">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-sm font-semibold text-gray-800">
                        {cliente.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-sm text-gray-600">
                        {cliente.correo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-sm font-semibold text-blue-600">
                        {cliente.reservas}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-playfair text-lg font-bold text-green-600">
                        ${cliente.totalGastado.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Servicios y Actividades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Servicios Más Solicitados */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Servicios Más Solicitados
            </h3>
            <div className="space-y-3">
              {reportes.serviciosMasSolicitados.map((servicio: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-500 rounded-full flex items-center justify-center text-white font-bold font-playfair">
                      {index + 1}
                    </div>
                    <span className="font-inter text-sm font-semibold text-gray-800">
                      {servicio.nombre}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair text-xl font-bold text-pink-600">
                      {servicio.cantidad}
                    </p>
                    <p className="font-inter text-xs text-gray-600">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividades Más Reservadas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Actividades Más Reservadas
            </h3>
            <div className="space-y-3">
              {reportes.actividadesMasReservadas.map((actividad: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-500 rounded-full flex items-center justify-center text-white font-bold font-playfair">
                      {index + 1}
                    </div>
                    <span className="font-inter text-sm font-semibold text-gray-800">
                      {actividad.nombre}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair text-xl font-bold text-pink-600">
                      {actividad.reservas}
                    </p>
                    <p className="font-inter text-xs text-gray-600">reservas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}