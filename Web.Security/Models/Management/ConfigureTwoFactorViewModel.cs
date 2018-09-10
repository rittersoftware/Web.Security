using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Web.Security.Models.Management
{
    public class ConfigureTwoFactorViewModel
    {
        public string SelectedProvider { get; set; }

        public ICollection<SelectListItem> Providers { get; set; }
    }
}
