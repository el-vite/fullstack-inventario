using Microsoft.AspNetCore.Mvc;
using TransactionService.Data;
using TransactionService.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TransactionsController : ControllerBase
{
    private readonly TransactionDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;


    public TransactionsController(TransactionDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }



    [HttpPost]
    public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
    {

        if (transaction.TipoTransaccion != "Compra" && transaction.TipoTransaccion != "Venta")
        {
            return BadRequest("El tipo de transacción debe ser 'Compra' o 'Venta'.");
        }

        var client = _httpClientFactory.CreateClient("ProductService");

        try
        {

            var productResponse = await client.GetFromJsonAsync<ProductDto>($"api/products/{transaction.ProductoID}");

            if (productResponse == null)
            {
                return BadRequest("El producto no existe.");
            }


            if (transaction.TipoTransaccion == "Venta")
            {
                if (productResponse.Stock < transaction.Cantidad)
                {
                    return BadRequest("Stock insuficiente para realizar la venta.");
                }
                productResponse.Stock -= transaction.Cantidad;
            }
            else
            {
                productResponse.Stock += transaction.Cantidad;
            }


            var updateResponse = await client.PutAsJsonAsync($"api/products/{transaction.ProductoID}", productResponse);
            updateResponse.EnsureSuccessStatusCode();


            _context.Transacciones.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransaction", new { id = transaction.ID }, transaction);
        }
        catch (HttpRequestException e)
        {

            return StatusCode(503, "El servicio de productos falló.");
        }
    }


    [HttpGet]
    public async Task<ActionResult<object>> GetTransactions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var totalTransactions = await _context.Transacciones.CountAsync();
        var transactions = await _context.Transacciones
                                        .OrderByDescending(t => t.Fecha)
                                        .Skip((pageNumber - 1) * pageSize)
                                        .Take(pageSize)
                                        .ToListAsync();

        return Ok(new
        {
            TotalCount = totalTransactions,
            PageSize = pageSize,
            PageNumber = pageNumber,
            Items = transactions
        });
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await _context.Transacciones.FindAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }
        return transaction;
    }
    

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(int id, Transaction updatedTransaction)
    {
        if (id != updatedTransaction.ID)
        {
            return BadRequest("El ID de la ruta no coincide con el ID de la transacción.");
        }

        using (var dbTransaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                var originalTransaction = await _context.Transacciones.AsNoTracking().FirstOrDefaultAsync(t => t.ID == id);
                if (originalTransaction == null)
                {
                    return NotFound("La transacción original no existe.");
                }

                var client = _httpClientFactory.CreateClient("ProductService");
                var product = await client.GetFromJsonAsync<ProductDto>($"api/products/{originalTransaction.ProductoID}");
                if (product == null)
                {
                    return BadRequest("El producto asociado ya no existe.");
                }

               
                if (originalTransaction.TipoTransaccion == "Venta")
                {
                    product.Stock += originalTransaction.Cantidad;
                }
                else 
                {
                    product.Stock -= originalTransaction.Cantidad;
                }

                
                if (updatedTransaction.TipoTransaccion == "Venta")
                {
                    if (product.Stock < updatedTransaction.Cantidad)
                    {
                        return BadRequest("Stock insuficiente para realizar la nueva venta.");
                    }
                    product.Stock -= updatedTransaction.Cantidad;
                }
                else 
                {
                    product.Stock += updatedTransaction.Cantidad;
                }

                
                var updateResponse = await client.PutAsJsonAsync($"api/products/{product.ID}", product);
                updateResponse.EnsureSuccessStatusCode();

                
                _context.Entry(updatedTransaction).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                await dbTransaction.CommitAsync();
                return NoContent();
            }
            catch (Exception e)
            {
                await dbTransaction.RollbackAsync();
                return StatusCode(503, $"Ocurrió un error: {e.Message}");
            }
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        using (var dbTransaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                var transactionToDelete = await _context.Transacciones.FindAsync(id);
                if (transactionToDelete == null)
                {
                    return NotFound();
                }

                var client = _httpClientFactory.CreateClient("ProductService");
                var product = await client.GetFromJsonAsync<ProductDto>($"api/products/{transactionToDelete.ProductoID}");
                if (product == null)
                {
                    
                }
                else
                {
                    
                    if (transactionToDelete.TipoTransaccion == "Venta")
                    {
                        product.Stock += transactionToDelete.Cantidad; 
                    }
                    else 
                    {
                        if (product.Stock < transactionToDelete.Cantidad)
                        {

                            return BadRequest("No se puede eliminar la compra, el stock resultante sería negativo.");
                        }
                        product.Stock -= transactionToDelete.Cantidad;
                    }

                    var updateResponse = await client.PutAsJsonAsync($"api/products/{product.ID}", product);
                    updateResponse.EnsureSuccessStatusCode();
                }

                _context.Transacciones.Remove(transactionToDelete);
                await _context.SaveChangesAsync();

                await dbTransaction.CommitAsync();
                return NoContent();
            }
            catch (Exception e)
            {
                await dbTransaction.RollbackAsync();
                return StatusCode(503, $"Ocurrió un error: {e.Message}");
            }
        }
    }
}

public class ProductDto
{
    public int ID { get; set; }
    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public string Categoria { get; set; } = string.Empty;


    public string Imagen { get; set; } = string.Empty;


    public decimal Precio { get; set; }

    public int Stock { get; set; }

}