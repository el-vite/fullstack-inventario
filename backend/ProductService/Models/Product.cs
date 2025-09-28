using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Productos")]
public class Product
{
    [Key]
    public int ID { get; set; }

    [Required]
    [StringLength(100)]
    public string Nombre { get; set; }

    [StringLength(500)]
    public string? Descripcion { get; set; }

    [StringLength(50)]
    public string? Categoria { get; set; }

    public string? Imagen { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Precio { get; set; }

    public int Stock { get; set; }
}