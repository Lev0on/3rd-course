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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ct
{
    /// <summary>
    /// Логика взаимодействия для UsersPage.xaml
    /// </summary>
    public partial class UsersPage : Page
    {
        private CurTestsEntities db = new CurTestsEntities();

        public UsersPage()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            try
            {
                var users = db.Users
                    .Include("Tests")
                    .ToList();

                UsersDataGrid.ItemsSource = users;
            }
            catch (System.Exception ex)
            {
                MessageBox.Show($"Ошибка загрузки данных: {ex.Message}");
            }
        }

        // Кнопка редактирования
        private void BtnEditUser_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Tag is int userId)
            {
                var user = db.Users.Find(userId);
                if (user != null)
                {
                    // Открываем окно редактирования
                    var editWindow = new EditUserWindow(user);
                    if (editWindow.ShowDialog() == true)
                    {
                        // Сохраняем изменения
                        db.SaveChanges();
                        MessageBox.Show("Пользователь успешно обновлён!");
                        LoadData(); // Перезагружаем данные
                    }
                }
            }
        }

        // Кнопка добавления
        private void BtnAddUser_Click(object sender, RoutedEventArgs e)
        {
            var newUser = new User
            {
                Teacher = false // По умолчанию ученик
            };
            db.Users.Add(newUser);

            var editWindow = new EditUserWindow(newUser, isNew: true);
            if (editWindow.ShowDialog() == true)
            {
                db.SaveChanges();
                MessageBox.Show("Пользователь успешно добавлен!");
                LoadData();
            }
            else
            {
                // Если отменили - удаляем из контекста
                db.Users.Remove(newUser);
            }
        }

       
    }
}
