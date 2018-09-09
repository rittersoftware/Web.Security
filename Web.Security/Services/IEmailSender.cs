using System.Threading.Tasks;

namespace Web.Security.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}