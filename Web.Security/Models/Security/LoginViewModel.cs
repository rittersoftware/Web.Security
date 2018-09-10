using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Security.Models.Security
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Please supply a Username")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Please supply a Password")]
        public string Password { get; set; }
    }
}
