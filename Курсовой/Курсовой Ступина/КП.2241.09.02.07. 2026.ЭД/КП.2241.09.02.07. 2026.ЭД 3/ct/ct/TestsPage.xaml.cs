using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    /// Логика взаимодействия для TestsPage.xaml
    /// </summary>

    public partial class TestsPage : Page
    {
        private CurTestsEntities db = new CurTestsEntities();
        public int CurrentUserID { get; set; }

        
        public TestsPage(int userID)
        {
            InitializeComponent();
            CurrentUserID = userID;
            LoadData();
        }

        private void BtnTakeTest_Click(object sender, RoutedEventArgs e)
        {
            // ✅ Проверка авторизации
            if (CurrentUserID == 0)
            {
                MessageBox.Show("Пожалуйста, войдите в систему!");
                return;
            }

            if (sender is Button button && button.Tag is int testId)
            {
                var testTakingPage = new TestTakingPage(testId, CurrentUserID, db);
                NavigationService.Navigate(testTakingPage);
            }
        }

       

        public TestsPage()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            try
            {
                var tests = db.Tests
                    .Include("User")
                    .ToList();

                TestsDataGrid.ItemsSource = tests;
            }
            catch (System.Exception ex)
            {
                MessageBox.Show($"Ошибка загрузки данных: {ex.Message}");
            }
        }

        

       
    }
}