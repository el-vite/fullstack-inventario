namespace TransactionService.Data;

using Microsoft.EntityFrameworkCore;
using TransactionService.Models;

public class TransactionDbContext : DbContext
{
    public TransactionDbContext(DbContextOptions<TransactionDbContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transacciones { get; set; }
}