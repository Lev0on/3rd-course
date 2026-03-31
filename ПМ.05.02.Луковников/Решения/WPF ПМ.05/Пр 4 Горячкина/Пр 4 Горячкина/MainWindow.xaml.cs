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

namespace Пр_4_Горячкина
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<Users> users = new List<Users>();
        List<Users> FiltrUsers = new List<Users>();
        Users chooseUser;
        public MainWindow()
        {
            InitializeComponent();
            users.Add(new Users { Name = "Ivan", Age = 18, Birthday = DateTime.Today });
            users.Add(new Users { Name = "Petr", Age = 17, Birthday = DateTime.Today  });
            users.Add(new Users { Name = "Pavel", Age = 20, Birthday = DateTime.Today });
            LVUsers.ItemsSource = users;

            CBAge.ItemsSource =  new List<string> { "Выбрать все", ">18", "18<"};
        }

        private void LVUsers_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var user = LVUsers.SelectedItem as Users;
            if (user != null)
            {
                SelectItemForDelete.Text = "Вы выбрали: " + user.Name;
                chooseUser = user;

                EditNameTB.Text = user.Name;
                EditAgeTB.Text = (user.Age).ToString();
                EditBirthdayTB.Text = user.Birthday.ToString();
            }
        }

        private void CBAge_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (CBAge.SelectedIndex == 0)
            {
                LVUsers.ItemsSource = users;
            }
            else if (CBAge.SelectedIndex == 1)
            {
                LVUsers.ItemsSource = users.Where(x => x.Age > 18);
            }
            else
            {
                LVUsers.ItemsSource = users.Where(x => x.Age < 18);
            }
        }

        private void AddNewUser(object sender, RoutedEventArgs e)
        {
            Users newUser = new Users();
            newUser.Name = NameTB.Text;
            newUser.Age = Convert.ToInt32(AgeTB.Text);
            newUser.Birthday = BirthdayTB.SelectedDate.Value;

            users.Add(newUser);
            LVUsers.ItemsSource = null;
            LVUsers.ItemsSource = users;
        }

        private void SearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            string SearchTextUser = SearchText.Text.ToLower();
            if (string.IsNullOrWhiteSpace(SearchTextUser))
            {
                FiltrUsers = new List<Users>(users);
            }
            else
            {
                FiltrUsers = users.Where(x => x.Name.ToLower().Contains(SearchTextUser)).ToList();
            }
            LVUsers.ItemsSource = null;
            LVUsers.ItemsSource = FiltrUsers;
        }

        private void EditItemClick(object sender, RoutedEventArgs e)
        {
            chooseUser.Age = Convert.ToInt32(EditAgeTB.Text);
            chooseUser.Birthday = EditBirthdayTB.SelectedDate.Value;
            chooseUser.Name = EditNameTB.Text;

            LVUsers.ItemsSource = null;
            LVUsers.ItemsSource = users;
        }

        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            users.Remove(chooseUser);
            LVUsers.ItemsSource = null;
            LVUsers.ItemsSource = users;

            MessageBox.Show("Успешно удален!");
        }
    }
}
