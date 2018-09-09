using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Web.Security.Data;

namespace Web.Security.Controllers
{
    public class UsersController : Controller
    {
        private readonly UserManager<User> userManager;

        public UsersController(
            UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public IActionResult Index()
        {
            var viewModel = this.userManager.Users.ToList();
            return View(viewModel);
        }
    }
}
