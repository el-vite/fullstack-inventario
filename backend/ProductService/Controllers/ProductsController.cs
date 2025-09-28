using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        return await _context.Productos.OrderBy(p => p.Nombre).ToListAsync();
    }


    [HttpGet]
    public async Task<ActionResult<object>> GetProducts(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? nombre = null,   
        [FromQuery] string? categoria = null 
    )
    {

        var query = _context.Productos.AsQueryable();

  
        if (!string.IsNullOrEmpty(nombre))
        {
            query = query.Where(p => p.Nombre.Contains(nombre));
        }

        if (!string.IsNullOrEmpty(categoria))
        {
            query = query.Where(p => p.Categoria.Contains(categoria));
        }

     
        var totalProducts = await query.CountAsync();
        var products = await query
                            .OrderBy(p => p.ID)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();

        return Ok(new {
            TotalCount = totalProducts,
            PageSize = pageSize,
            PageNumber = pageNumber,
            Items = products
        });
    }



    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Productos.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Productos.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProducts), new { id = product.ID }, product);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduct(int id, Product product)
    {
        if (id != product.ID)
        {
            return BadRequest();
        }

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Productos.Any(e => e.ID == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent(); 
    }




    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                var product = await _context.Productos.FindAsync(id);
                if (product == null)
                {
                    return NotFound();
                }

                var relatedTransactions = await _context.Transacciones
                                                        .Where(t => t.ProductoID == id)
                                                        .ToListAsync();

                if (relatedTransactions.Any())
                {
                    _context.Transacciones.RemoveRange(relatedTransactions);

                    await _context.SaveChangesAsync(); 
                }


                _context.Productos.Remove(product);

                await _context.SaveChangesAsync();


                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Ocurrió un error al intentar eliminar el producto.");
            }
        }
    }
}