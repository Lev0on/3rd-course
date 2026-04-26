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

namespace Практика_13_14
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<Task> tasks = new List<Task>();
        List<Categories> categories = new List<Categories>();

        public MainWindow()
        {
            InitializeComponent();
            CreateData();
        }

        private void CreateData()
        {
            categories.Add(new Categories { CategoryID = 1, CategoryName = "Дела по дому", ImageCategory = "/home.png" });
            categories.Add(new Categories { CategoryID = 2, CategoryName = "Учеба", ImageCategory = "/study.png" });
            categories.Add(new Categories { CategoryID = 3, CategoryName = "Работа", ImageCategory = "/job.png" });

           tasks.Add(new Task { ID = 1, Title = "Покормить кота", Categories = categories[0] });
            tasks.Add(new Task { ID = 2, Title = "Сделать уроки", Categories = categories[1] });

            TaskLV.ItemsSource = tasks;
        }

        private void DeleteTask(object sender, RoutedEventArgs e)
        {
            var task = (sender as Button).DataContext as Task;
            tasks.Remove(task);
            TaskLV.ItemsSource = null;
            TaskLV.ItemsSource = tasks;
        }

        private void NewTask(object sender, RoutedEventArgs e)
        {
            AddNewTaskWindow addNewTaskWindow = new AddNewTaskWindow();
            var result = addNewTaskWindow.ShowDialog();
            if (result == true)
            {
                tasks.Add(new Task
                {
                    ID = tasks.Count + 1,
                    Title = addNewTaskWindow.NewTaskDescription,
                    Categories = categories[addNewTaskWindow.SelectCategory]
                });
                TaskLV.ItemsSource = null;
                TaskLV.ItemsSource = tasks;
            }
        }

        // Самостоятельное задание 1: Редактирование задач
        private void EditTask_Click(object sender, RoutedEventArgs e)
        {
            if (TaskLV.SelectedItem == null)
            {
                MessageBox.Show("Выберите задачу для редактирования!", "Внимание",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var task = TaskLV.SelectedItem as Task;
            EditTaskWindow editTaskWindow = new EditTaskWindow(task);
            var result = editTaskWindow.ShowDialog();

            if (result == true)
            {
                // Обновляем задачу
                task.Title = editTaskWindow.EditedTaskDescription;
                task.Categories = editTaskWindow.Categories[editTaskWindow.SelectedCategoryIndex];

                TaskLV.ItemsSource = null;
                TaskLV.ItemsSource = tasks;
            }
        }

        // Самостоятельное задание 2: Поиск задач
        private void SearchBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            string searchText = SearchBox.Text.ToLower();

            if (string.IsNullOrWhiteSpace(searchText))
            {
                TaskLV.ItemsSource = tasks;
            }
            else
            {
                var filteredTasks = tasks.Where(t =>
                    t.Title.ToLower().Contains(searchText) ||
                    t.Categories.CategoryName.ToLower().Contains(searchText)).ToList();
                TaskLV.ItemsSource = filteredTasks;
            }
        }

       
    }
}