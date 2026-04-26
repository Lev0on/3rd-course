using System;
using System.Collections.Generic;

namespace Praktika3
{
    internal class Program
    {
        static void Main()
        {
            // Шаг 1: Ввод размера массива с проверкой
            Console.WriteLine("Сколько чисел сгенерировать? ");
            int n;
            while (!int.TryParse(Console.ReadLine(), out n) || n <= 0)
            {
                Console.WriteLine("Пожалуйста, введите корректное положительное целое число:");
            }

            // Создание и заполнение массива
            double[] arr = new double[n];
            Random rnd = new Random();

            for (int i = 0; i < n; i++)
            {
                arr[i] = rnd.NextDouble() * 20 - 10; // от -10 до 10
            }

            // Шаг 3: Вывод массива
            Console.WriteLine("\nМассив:");
            for (int i = 0; i < n; i++)
            {
                Console.Write($"{arr[i]:F2}  ");
                if ((i + 1) % 10 == 0) Console.WriteLine();
            }
            if (n % 10 != 0) Console.WriteLine(); 

            // Шаг 4 и 5: Один проход — поиск минимального положительного и запоминание индексов
            double min = double.MaxValue;
            List<int> minIndices = new List<int>();
            bool foundPositive = false;

            for (int i = 0; i < n; i++)
            {
                if (arr[i] > 0)
                {
                    foundPositive = true;
                    if (arr[i] < min)
                    {
                        // обновление нового минимального
                        min = arr[i];
                        minIndices.Clear();
                        minIndices.Add(i);
                    }
                    else if (Math.Abs(arr[i] - min) < 1e-10) // учёт погрешности double
                    {
                        minIndices.Add(i);
                    }
                }
            }

            // Вывод результата
            Console.WriteLine();
            if (!foundPositive)
            {
                Console.WriteLine("В массиве нет положительных чисел.");
            }
            else
            {
                Console.WriteLine($"Минимальное положительное: {min:F4}");
                Console.WriteLine("Все элементы с этим значением:");
                foreach (int index in minIndices)
                {
                    Console.WriteLine($" [{index}] = {arr[index]:F4}");
                }
            }

            Console.ReadKey();
        }
    }
}