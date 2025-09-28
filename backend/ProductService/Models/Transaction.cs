
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Transacciones")]
public class Transaction
{
    [Key]
    public int ID { get; set; }

    public DateTime Fecha { get; set; } = DateTime.Now;

    [Required]
    public string TipoTransaccion { get; set; } = string.Empty;

    [Required]
    public int ProductoID { get; set; }

    [Required]
    public int Cantidad { get; set; }

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal PrecioUnitario { get; set; }

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal PrecioTotal { get; set; }
    
    public string? Detalle { get; set; }
}