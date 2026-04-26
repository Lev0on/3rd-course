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
    /// Логика взаимодействия для EditTaskWindow.xaml
    /// </summary>
    public partial class EditTaskWindow : Window
    {
        List<Categories> categories = new List<Categories>();
        private Task _taskToEdit;

        public EditTaskWindow(Task task)
        {
            InitializeComponent();
            _taskToEdit = task;

            categories.Add(new Categories { CategoryID = 1, CategoryName = "Дела по дому", ImageCategory = "/Images/home.png" });
            categories.Add(new Categories { CategoryID = 2, CategoryName = "Учеба", ImageCategory = "/Images/study.png" });
            categories.Add(new Categories { CategoryID = 3, CategoryName = "Работа", ImageCategory = "/Images/job.png" });
            CBCategory.ItemsSource = categories;

            // Заполняем поля текущими данными задачи
            TaskDescription.Document.Blocks.Clear();
            TaskDescription.Document.Blocks.Add(new Paragraph(new Run(task.Title)));

            // Выбираем текущую категорию
            for (int i = 0; i < categories.Count; i++)
            {
                if (categories[i].CategoryName == task.Categories.CategoryName)
                {
                    CBCategory.SelectedIndex = i;
                    break;
                }
            }
        }

        private void SaveTask(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }

        public string EditedTaskDescription
        {
            get
            {
                return new TextRange(TaskDescription.Document.ContentStart,
                                   TaskDescription.Document.ContentEnd).Text;
            }
        }

        public int SelectedCategoryIndex
        {
            get { return CBCategory.SelectedIndex; }
        }

        public List<Categories> Categories
        {
            get { return categories; }
        }
    }
}