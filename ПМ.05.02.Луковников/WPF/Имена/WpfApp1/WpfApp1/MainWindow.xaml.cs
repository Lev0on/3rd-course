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

namespace WpfApp1
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<string> users = new List<string> { "Tom", "Ivan", "Petr" };
        List<string> users2 = new List<string> {  };

        public MainWindow()
        {
            InitializeComponent();
            UsersLB.ItemsSource = users;
            UsersLB2.ItemsSource = users2;

        }

        private void AddNewUser(object sender, RoutedEventArgs e)
        {
            var NewName = NameTB.Text;

            users.Add(NewName);

            UsersLB.ItemsSource = null;
            UsersLB.ItemsSource = users;
        }

        private void SelecteName(object sender, SelectionChangedEventArgs e)
        {
            if (UsersLB.SelectedItem != null)
            {
                SelectName.Content = "Выбранное имя: " + UsersLB.SelectedItem.ToString();
            }
        }

        private void DeleteUser(object sender, RoutedEventArgs e)
        {
            if (UsersLB.SelectedItems != null)
            {
                var selectName = UsersLB.SelectedItem.ToString();
                users.Remove(selectName);

                UsersLB.ItemsSource = null;
                UsersLB.ItemsSource = users;
            }
        }

        private void MoveSelected(object sender, RoutedEventArgs e)
        {
            if (UsersLB.SelectedItems != null)
            {
                var selectName = UsersLB.SelectedItem.ToString();
                users.Remove(selectName);

                users2.Add(selectName);

                UsersLB.ItemsSource = null;
                UsersLB.ItemsSource = users;

                UsersLB2.ItemsSource = null;
                UsersLB2.ItemsSource = users2;

            }
        }
    }
}
