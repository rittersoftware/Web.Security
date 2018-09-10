using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Security.Data;

namespace Web.Security.Services
{
    public interface IUserService
    {
        Task<bool> ValidateCredentials(string username, string password, out User user);
        Task<bool> AddUser(string username, string password);
    }
}
