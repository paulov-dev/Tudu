using Microsoft.AspNetCore.Identity;

namespace Teste_tasks.Models
{
    public class Users : IdentityUser
    {
        public string FullName { get; set; }

        public DateTime DataNasc { get; set; }
    }
}

