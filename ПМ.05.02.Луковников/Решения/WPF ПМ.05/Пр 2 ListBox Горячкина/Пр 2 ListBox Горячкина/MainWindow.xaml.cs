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

namespace Пр_2_ListBox_Горячкина
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<string> users = new List<string> { "Tom", "Ivan", "Petr", "БольшоеИмяОго" };
        public MainWindow()
        {
            InitializeComponent();
            UsersLB.ItemsSource = users;
            SortByLength.ItemsSource = new string[] { "Все имена", "Имена длиной больше 5", "Имена длиной меньше 5" };
            SortByLength.SelectedIndex = 0;
        }

        private void SearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            UsersLB.ItemsSource = null;
            UsersLB.ItemsSource = users.Where(x => x.Contains(SearchText.Text));
        }

        private void SortByAlf(object sender, RoutedEventArgs e)
        {
            UsersLB.ItemsSource = users.OrderBy(x => x);
        }

        private void SortDesc(object sender, RoutedEventArgs e)
        {
            UsersLB.ItemsSource= users.OrderByDescending(x => x);
        }

        private void SortByLength_Selected(object sender, SelectionChangedEventArgs e)
        {
            switch (SortByLength.SelectedIndex)
            {
                case 1:
                    UsersLB.ItemsSource = users.Where(x => x.Length > 5);
                    break;
                case 2:
                    UsersLB.ItemsSource = users.Where(x => x.Length < 5);
                    break;
                default:
                UsersLB.ItemsSource = users;
                    break;
            }
        }
    }
}
