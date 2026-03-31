using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace ct
{
    /// <summary>
    /// Логика взаимодействия для LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        private CurTestsEntities db = new CurTestsEntities();

        public LoginWindow()
        {
            InitializeComponent();
        }

        private void ShowError()
        {
            MessageBox.Show("Неверный логин или пароль", "Ошибка",
                  MessageBoxButton.OK, MessageBoxImage.Error);
        }

        private void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            string login = LoginBox.Text.Trim();
            string password = PasswordBox.Password.Trim();

            if (string.IsNullOrWhiteSpace(login) || string.IsNullOrWhiteSpace(password))
            {
                ShowError();
                return;
            }

            // Ищем пользователя
            var user = db.Users.FirstOrDefault(x => x.login == login && x.password == password);

            if (user != null)
            {
               
                var mainWindow = new MainWindow(user.UID);
                mainWindow.Show();
                this.Close();
            }
            else
            {
                ShowError();
            }
        }
    }
}