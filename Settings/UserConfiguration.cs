using WebProdavnica.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace WebProdavnica.Settings
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.KorisnickoIme).HasMaxLength(100).IsRequired();
            builder.HasIndex(x => x.KorisnickoIme).IsUnique();
            builder.Property(x => x.Email).HasMaxLength(100).IsRequired();
            builder.HasIndex(x => x.Email).IsUnique();
            builder.Property(x => x.Sifra).HasMaxLength(300).IsRequired();
            builder.Property(x => x.Adresa).HasMaxLength(200).IsRequired();
            builder.Property(x => x.Tip)
                   .HasConversion(new EnumToStringConverter<TipKorisnika>())
                   .IsRequired();
      

          
        }
    }
}
