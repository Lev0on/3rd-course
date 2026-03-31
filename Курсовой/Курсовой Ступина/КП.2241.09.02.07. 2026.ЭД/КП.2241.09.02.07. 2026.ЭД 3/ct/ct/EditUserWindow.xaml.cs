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
    /// Логика взаимодействия для EditUserWindow.xaml
    /// </summary>
    public partial class EditUserWindow : Window
    {
        private User _user;
        private bool _isNew;

        public EditUserWindow(User user, bool isNew = false)
        {
            InitializeComponent();
            _user = user;
            _isNew = isNew;

            // Заполнение полей
            TxtLogin.Text = user.login;
            TxtName.Text = user.Name;
            TxtSurname.Text = user.Surname;
            ChkTeacher.IsChecked = user.Teacher;

            if (isNew)
            {
                Title = "Добавление пользователя";
            }
        }

        private void BtnSave_Click(object sender, RoutedEventArgs e)
        {
            // Проверка заполненности полей
            if (string.IsNullOrWhiteSpace(TxtLogin.Text))
            {
                MessageBox.Show("Введите логин!");
                TxtLogin.Focus();
                return;
            }

            if (string.IsNullOrWhiteSpace(TxtName.Text))
            {
                MessageBox.Show("Введите имя!");
                TxtName.Focus();
                return;
            }

            // Обновление данных
            _user.login = TxtLogin.Text.Trim();
            _user.Name = TxtName.Text.Trim();
            _user.Surname = TxtSurname.Text.Trim();
            _user.Teacher = ChkTeacher.IsChecked ?? false;

            // Если пароль введён - он обновляется
            if (!string.IsNullOrWhiteSpace(TxtPassword.Password))
            {
                _user.password = TxtPassword.Password;
            }
            else if (_isNew)
            {
                MessageBox.Show("Для нового пользователя необходимо указать пароль!");
                TxtPassword.Focus();
                return;
            }

            DialogResult = true;
            Close();
        }

        private void BtnCancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}
