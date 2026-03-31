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

namespace ПР_1_Горячкина
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<string> users = new List<string> { "Tom", "Ivan", "Petr" };
        List<string> users2 = new List<string>();
        public MainWindow()
        {
            InitializeComponent();
            UsersLB.ItemsSource = users;
            UsersNE.ItemsSource = users2;
        }

        private void AddNewUser(object sender, RoutedEventArgs e)
        {
            var newName = NameТВ.Text;
            users.Add(newName);

            UsersLB.ItemsSource = null;
            UsersLB.ItemsSource = users;
        }

        private void SelectedName(object sender, SelectionChangedEventArgs e)
        {
            if (UsersLB.SelectedItem != null)
            {
                SelectName.Content = "Выбранное имя: " + UsersLB.SelectedItem.ToString();
            }
        }

        private void DeleteUser(object sender, RoutedEventArgs e)
        {
            if (UsersLB.SelectedItem != null) 
            {
                var selectName = UsersLB.SelectedItem as string;
                users.Remove(selectName);

                UsersLB.ItemsSource = null;
                UsersLB.ItemsSource = users;
            }
            else 
            {
                MessageBox.Show("Имя не выбрано!");
            }
        }

        private void TransferButton_Click(object sender, RoutedEventArgs e)
        {
            if (UsersLB.SelectedItem != null)
            {
                string selectedItem = UsersLB.SelectedItem.ToString();

                users2.Add(selectedItem);

                users.Remove(selectedItem);

                UsersLB.ItemsSource = null;
                UsersLB.ItemsSource = users;
                UsersNE.ItemsSource = null;
                UsersNE.ItemsSource = users2;
            }

        }
    }
}
