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

namespace Пр_3._5_Горячкина
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<Item> items = new List<Item>();
        Item deleteItem;
        public MainWindow()
        {
            InitializeComponent();
            items.Add(new Item { ID = 1, NameItem = "Футболка", PriceItem = 3000, PathImage = "/Images/Футболка.jpg" });;
            items.Add(new Item { ID = 1, NameItem = "Носки", PriceItem = 500, PathImage = "/Images/Носки.jpg" });;
            items.Add(new Item { ID = 1, NameItem = "Джинсы", PriceItem = 3500, PathImage = "/Images/Джинсы.jpg" });;
            ItemsLV.ItemsSource = items;
        }

        private void AddNewItemClick(object sender, RoutedEventArgs e)
        {
            Item newItem = new Item();

            newItem.ID = items.Count() + 1;
            newItem.PriceItem = Convert.ToSingle(PriceTB.Text);
            newItem.PathImage = TBPathImage.Text;
            newItem.NameItem = NameTB.Text;
            items.Add(newItem);

            ItemsLV.ItemsSource = null;
            ItemsLV.ItemsSource = items;
        }

        private void SelectItem(object sender, SelectionChangedEventArgs e)
        {
            var item = ItemsLV.SelectedItem as Item;
            if (item != null)
            {
                SelectItemForDelete.Text = "Вы выбрали: " + item.NameItem;
                deleteItem = item;

                EditNameTB.Text = item.NameItem;
                EditPriceTB.Text = (item.PriceItem).ToString();
                EditTBPathImage.Text = item.PathImage;
            }
        }

        private void DeleteItemClick(object sender, RoutedEventArgs e)
        {
            items.Remove(deleteItem);

            ItemsLV.ItemsSource = null;
            ItemsLV.ItemsSource = items;

            MessageBox.Show("Успешно удален!");
        }

        private void EditItemClick(object sender, RoutedEventArgs e)
        {
            deleteItem.NameItem = EditNameTB.Text;
            deleteItem.PriceItem = Convert.ToSingle(EditPriceTB.Text);
            deleteItem.PathImage = EditTBPathImage.Text;

            ItemsLV.ItemsSource = null;
            ItemsLV.ItemsSource = items;

            MessageBox.Show("Товар сохранен!");
        }
    }
}
