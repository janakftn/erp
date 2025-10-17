using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebProdavnica.Models;

namespace WebProdavnica.Settings
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Ime).IsRequired();
            builder.Property(x => x.Cena).IsRequired();
            builder.Property(x => x.Kolicina).IsRequired();
            builder.Property(x => x.Boja).IsRequired();
            builder.Property(x => x.Brend).IsRequired();

        }
    }
}
