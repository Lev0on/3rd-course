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

namespace Практика_13_14
{
    /// <summary>
    /// Логика взаимодействия для AddNewTaskWindow.xaml
    /// </summary>
    public partial class AddNewTaskWindow : Window
    {
        List<Categories> categories = new List<Categories>();

        public AddNewTaskWindow()
        {
            InitializeComponent();
            categories.Add(new Categories { CategoryID = 1, CategoryName = "Дела по дому", ImageCategory = "/home.png" });
            categories.Add(new Categories { CategoryID = 2, CategoryName = "Учеба", ImageCategory = "/study.png" });
            categories.Add(new Categories { CategoryID = 3, CategoryName = "Работа", ImageCategory = "/job.png" });
            CBCategory.ItemsSource = categories;
        }

        private void SaveTask(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }

        public string NewTaskDescription
        {
            get
            {
                return new TextRange(TaskDescription.Document.ContentStart,
                                   TaskDescription.Document.ContentEnd).Text;
            }
        }

        public int SelectCategory
        {
            get { return CBCategory.SelectedIndex; }
        }
    }
}
