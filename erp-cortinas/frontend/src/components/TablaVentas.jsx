import React from 'react';
import styles from '../styles/TablaVentas.module.css';

const TablaVentas = ({ items = [], onItemChange, onAddItem, onRemoveItem, readOnly = false }) => {
  const calcularSubtotal = (cantidad, precioUnitario) => {
    return (parseFloat(cantidad || 0) * parseFloat(precioUnitario || 0)).toFixed(2);
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      return total + parseFloat(calcularSubtotal(item.cantidad, item.precioUnitario));
    }, 0).toFixed(2);
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(valor);
  };

  const handleInputChange = (index, field, value) => {
    if (readOnly) return;
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    onItemChange && onItemChange(updatedItems);
  };

  const agregarItem = () => {
    if (readOnly) return;
    onAddItem && onAddItem();
  };

  const eliminarItem = (index) => {
    if (readOnly) return;
    onRemoveItem && onRemoveItem(index);
  };

  return (
    <div className={styles.tablaContainer}>
      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead className={styles.cabecera}>
            <tr>
              <th className={styles.columnaDescripcion}>Descripción</th>
              <th className={styles.columnaCantidad}>Cantidad</th>
              <th className={styles.columnaPrecio}>Precio Unitario</th>
              <th className={styles.columnaSubtotal}>Subtotal</th>
              {!readOnly && <th className={styles.columnaAcciones}>Acciones</th>}
            </tr>
          </thead>
          <tbody className={styles.cuerpo}>
            {items.map((item, index) => (
              <tr key={index} className={styles.fila}>
                <td className={styles.celdaDescripcion}>
                  {readOnly ? (
                    <span className={styles.textoReadonly}>{item.descripcion}</span>
                  ) : (
                    <input
                      type="text"
                      value={item.descripcion || ''}
                      onChange={(e) => handleInputChange(index, 'descripcion', e.target.value)}
                      className={styles.inputDescripcion}
                      placeholder="Descripción del producto/servicio"
                    />
                  )}
                </td>
                <td className={styles.celdaCantidad}>
                  {readOnly ? (
                    <span className={styles.textoReadonly}>{parseFloat(item.cantidad || 0).toFixed(2)}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.cantidad || ''}
                      onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)}
                      className={styles.inputNumerico}
                    />
                  )}
                </td>
                <td className={styles.celdaPrecio}>
                  {readOnly ? (
                    <span className={styles.textoReadonly}>{formatearMoneda(item.precioUnitario || 0)}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.precioUnitario || ''}
                      onChange={(e) => handleInputChange(index, 'precioUnitario', e.target.value)}
                      className={styles.inputNumerico}
                    />
                  )}
                </td>
                <td className={styles.celdaSubtotal}>
                  <span className={styles.subtotal}>
                    {formatearMoneda(calcularSubtotal(item.cantidad, item.precioUnitario))}
                  </span>
                </td>
                {!readOnly && (
                  <td className={styles.celdaAcciones}>
                    <button
                      type="button"
                      onClick={() => eliminarItem(index)}
                      className={styles.botonEliminar}
                      title="Eliminar item"
                    >
                      ×
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!readOnly && (
              <tr className={styles.filaAgregar}>
                <td colSpan={5}>
                  <button
                    type="button"
                    onClick={agregarItem}
                    className={styles.botonAgregar}
                  >
                    + Agregar Item
                  </button>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className={styles.pie}>
            <tr className={styles.filaTotal}>
              <td colSpan={readOnly ? 3 : 4} className={styles.celdaTotalLabel}>
                <strong>Total:</strong>
              </td>
              <td className={styles.celdaTotalValor}>
                <strong className={styles.total}>
                  {formatearMoneda(calcularTotal())}
                </strong>
              </td>
              {!readOnly && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TablaVentas;
