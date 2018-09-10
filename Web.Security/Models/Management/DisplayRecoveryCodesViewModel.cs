using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web.Security.Models.Management
{
    public class DisplayRecoveryCodesViewModel
    {
        [Required]
        public IEnumerable<string> Codes { get; set; }

    }
}
