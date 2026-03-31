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

namespace Пр_5_Горячкина
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<User> users = new List<User>();
        List<User> filtered = new List<User>();
        User chooseUser;
        public MainWindow()
        {
            InitializeComponent();
            users.Add(new User { ID = 1, Name = "Ivan", Age = 18, Birthday = DateTime.Today});
            users.Add(new User { ID = 2, Name = "Petr", Age = 17, Birthday = DateTime.Today });
            users.Add(new User { ID = 3, Name = "Pavel", Age = 20, Birthday = DateTime.Today });
            DgUsers.ItemsSource = users;
        }

        private void InfoUser(object sender, RoutedEventArgs e)
        {
            var item = (sender as Button).DataContext as User;
            if (item != null)
            {
                MessageBox.Show(item.Name);

                chooseUser = item;

                EditName.Text = item.Name;
                EditAge.Text = item.Age.ToString();
                EditBirthday.SelectedDate = item.Birthday;
            }
        }

        private void SearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            string SearchTextUser = SearchText.Text.ToLower();
            if (string.IsNullOrWhiteSpace(SearchTextUser))
            {
                filtered = new List<User>(users);
            }
            else
            {
                filtered = users.Where(x => x.Name.ToLower().Contains(SearchTextUser)).ToList();
            }
            DgUsers.ItemsSource = null;
            DgUsers.ItemsSource = filtered;
        }

        private void EditUserClick(object sender, RoutedEventArgs e)
        {
            if (chooseUser == null)
            {
                MessageBox.Show("Сначала выберите пользователя для редактирования!");
                return;
            }

            chooseUser.Name = EditName.Text;
            chooseUser.Age = Convert.ToInt32(EditAge.Text);
            chooseUser.Birthday = EditBirthday.SelectedDate.Value;

            DgUsers.ItemsSource = null;
            DgUsers.ItemsSource = users;
        }

        private void DeleteUser(object sender, RoutedEventArgs e)
        {
            var UserDel = (sender as Button).DataContext as User;
            users.Remove(UserDel);
            DgUsers.ItemsSource = null;
            DgUsers.ItemsSource = users;
            MessageBox.Show($"Пользователь {UserDel.Name} удален!");
        }
    }
}
