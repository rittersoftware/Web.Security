using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Web.Security.Data
{
    public class User : IdentityUser<int>
    {
        public virtual ICollection<IdentityUserClaim<int>> Claims { get; set; }
        public virtual ICollection<IdentityUserLogin<int>> Logins { get; set; }
        public virtual ICollection<IdentityUserToken<int>> Tokens { get; set; }
        public virtual ICollection<IdentityUserRole<int>> UserRoles { get; set; }

        public virtual int Age { get; set; }
        public string Username { get; }

        public User()
        {
            
        }
        public User(string username)
        {
            Username = username;
        }
    }
}