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
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
       
        public int CurrentUserID { get; set; }

        
        public MainWindow(int userID = 0)
        {
            InitializeComponent();
            CurrentUserID = userID;

            
            if (CurrentUserID > 0)
            {
                Frame.Navigate(new TestsPage(CurrentUserID));
            }
        }

        // Кнопка перехода к тестам
        private void BtnTests_Click(object sender, RoutedEventArgs e)
        {
            if (CurrentUserID > 0)
            {
                Frame.Navigate(new TestsPage(CurrentUserID));
            }
            else
            {
                MessageBox.Show("Пожалуйста, войдите в систему!");
                var loginWindow = new LoginWindow();
                loginWindow.ShowDialog();
            }
        }
        public MainWindow()
        {
            InitializeComponent();
            LoadPage("Tests"); 
        }

        private void NavButton_Click(object sender, RoutedEventArgs e)
        {
            string page = "Tests"; // значение по умолчанию

            if (sender is Button button)
            {
                if (button.Name == "BtnTests")
                    page = "Tests";
                else if (button.Name == "BtnResults")
                    page = "Results";
                else if (button.Name == "BtnUsers")
                    page = "Users";
            }

            LoadPage(page);
        }

        private void LoadPage(string pageName)
        {
            TextBlock content;

            if (pageName == "Tests")
            {
                Frame.Content = new TestsPage();
                
            }
            else if (pageName == "Results")
            {
                Frame.Content = new ResultPage();
            }
            else if (pageName == "Users")
            {
               Frame.Content = new UsersPage();
            }
            else
            {
                content = new TextBlock
                {
                    Text = "Страница не найдена",
                    Foreground = System.Windows.Media.Brushes.Red
                };
            }

            
        }

        
    }
}