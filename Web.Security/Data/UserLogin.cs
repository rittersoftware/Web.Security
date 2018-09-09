using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Web.Security.Data
{
    public class UserLogin : IdentityUserLogin<int>
    {
        public virtual User User { get; set; }
        public string RefreshToken { get; set; }
    }
}
