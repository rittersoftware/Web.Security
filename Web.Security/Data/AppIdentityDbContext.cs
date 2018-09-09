using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Web.Security.Data
{
    public class AppIdentityDbContext : IdentityDbContext<User, Role, int>
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options)
            : base(options)
        {            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            //Customize data tables
            modelBuilder.Entity<User>(b =>
            {
                b.HasKey(key => key.Id);

                // Each User can have many UserClaims
                b.HasMany(e => e.Claims)
                    .WithOne()
                    .HasForeignKey(uc => uc.UserId)
                    .IsRequired();

                // Each User can have many UserLogins
                b.HasMany(e => e.Logins)
                    .WithOne()
                    .HasForeignKey(ul => ul.UserId)
                    .IsRequired();

                // Each User can have many UserTokens
                b.HasMany(e => e.Tokens)
                    .WithOne()
                    .HasForeignKey(ut => ut.UserId)
                    .IsRequired();

                // Each User can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne()
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();

                b.ToTable(name: "User");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                //entity.HasKey(key => key.Id);

                // Each Role can have many entries in the UserRole join table
                entity.HasMany(e => e.UserRoles)
                    .WithOne(e => e.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                // Each Role can have many associated RoleClaims
                entity.HasMany(e => e.RoleClaims)
                    .WithOne(e => e.Role)
                    .HasForeignKey(rc => rc.RoleId)
                    .IsRequired();

                entity.ToTable(name: "Role");
            });

            modelBuilder.Entity<IdentityUserRole<int>>(entity =>
            {
                entity.HasKey(r => new { r.UserId, r.RoleId });
                entity.ToTable("UserRoles");
            });

            modelBuilder.Entity<IdentityUserClaim<int>>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.ToTable("UserClaims");
            });

            modelBuilder.Entity<IdentityUserLogin<int>>(entity =>
            {
                entity.HasKey(l => new { l.LoginProvider, l.ProviderKey });
                entity.ToTable("UserLogins");
            });

            modelBuilder.Entity<IdentityUserToken<int>>(entity =>
            {
                entity.HasKey(t => new {t.UserId, t.LoginProvider, t.Name});
                entity.ToTable("UserToken");
            });

            modelBuilder.Entity<IdentityRoleClaim<int>>(entity =>
            {
                entity.HasKey(rc => rc.Id);
                entity.ToTable("RoleClaim");
            });
        }
    }
}
