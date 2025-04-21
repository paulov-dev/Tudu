//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using System.Threading.Tasks;
//using Teste_tasks.Data;
//using Teste_tasks.Models;

//namespace Teste_tasks.Services
//{
//    public class UserDeletionService
//    {
//        private readonly AppDbContext _context;
//        private readonly UserManager<Users> _userManager;

//        public UserDeletionService(AppDbContext context, UserManager<Users> userManager)
//        {
//            _context = context;
//            _userManager = userManager;
//        }

//        public async Task DeleteAllUsersAsync()
//        {
//            // Deleta as tabelas relacionadas primeiro, se existirem
//            _context.UserLogins.RemoveRange(_context.UserLogins);
//            _context.UserRoles.RemoveRange(_context.UserRoles);
//            _context.UserClaims.RemoveRange(_context.UserClaims);
//            _context.UserTokens.RemoveRange(_context.UserTokens);

//            // Deleta todos os usuários
//            var users = await _userManager.Users.ToListAsync();
//            foreach (var user in users)
//            {
//                await _userManager.DeleteAsync(user);
//            }

//            await _context.SaveChangesAsync();
//        }
//    }
//}
