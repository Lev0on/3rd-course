using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace pr3_zd3
{
    internal class Program
    {
        static void Main()
        {
            //Задаем размер массива для теста
            //Чем больше замер, тем заметнее разница в скорости м/у версиями
            int size = 100000;

            //Создаем массив вещественных чисел
            //Выделяем память под 100 000 элементов типа double

            double[] data = new double[size];

            //Генерируем случайные числа от -10 до 10
            //Создаем генератор случайных чисел
            Random rnd = new Random();

            //Цикл заполняет массив случайных значений
            for (int i = 0; i < size; i++)
                data[i] = rnd.NextDouble() * 20 - 10;

            Console.WriteLine($"Тест на массиве из {size} элементов: \n");

            long time1 = TestTwoPasses(data);
            Console.WriteLine($"Версия 1 (Два прохода): {time1} мс");

            long time2 = TestOnePass(data);
            Console.WriteLine($"Вресия 2 (один проход): {time2} мс");

            double Ускорение = (double)time1 / time2;

            Console.WriteLine($"\n Версия 2 быстрее в {Ускорение:F1} раза");

            Console.ReadKey();


        }

        static long TestTwoPasses(double[] arr)
        {
            Stopwatch timer = Stopwatch.StartNew();

            double min = 1000;

            for (int i = 0;i < arr.Length;i++)
            {
                if (arr[i] > 0 && arr[i] < min)
                    min = arr[i];

                
            }
            int count = 0;

            for (int i = 0; i < arr.Length; i++)
            {

                if (arr[i] > 0 && Math.Abs(arr[i] - min) < 1e-10)
                    count++;
            }
            timer.Stop();

            return timer.ElapsedMilliseconds;
        }

        static long TestOnePass(double[] arr)
        {
            Stopwatch timer = Stopwatch.StartNew();

            double min = double.MaxValue;

            int count = 0;

            for (int i = 0; i < arr.Length; i++) { 
                if (arr[i] > 0)
                {
                    if (arr[i] < min)
                    {
                        min = arr[i];
                        count = 1;

                    }
                    else if (Math.Abs(arr[i] - min) < 1e-10)
                    {
                        count++;
                    }
                }
            }

            timer.Stop();
            return timer.ElapsedMilliseconds;
        }
    }
}
