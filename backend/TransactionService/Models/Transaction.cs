namespace TransactionService.Models; 

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
    public int ProductoID { get; set; }
    public int Cantidad { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal PrecioUnitario { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal PrecioTotal { get; set; }
    public string? Detalle { get; set; }
}