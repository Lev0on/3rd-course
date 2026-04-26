using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Praktika2
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Анализ качества программного кода");
            Console.WriteLine("=".PadRight(50, '='));
            Console.WriteLine();

            //Анализ первого примера кода
            Console.WriteLine("Пример 1: монолитная функция (Плохой код)");
            Console.WriteLine("-".PadRight(50, '-'));
            string code1 = GetBadCode();
            AnalyzeCode(code1);

            Console.WriteLine();

            //Анализ второго примера кода
            Console.WriteLine("пример 2: Разделенная функция (хороший код)");
            Console.WriteLine("-".PadRight(50, '-'));
            string code2 = GetGoodCode();
            AnalyzeCode(code2);


            Console.WriteLine();
            Console.WriteLine("Выводы");
            Console.WriteLine(" - чем ниже сложность и меньше вложенность - тем легче код поддерживать");
            Console.WriteLine(" - Разбиение большой функции на маленькие улучшат все метрики");
            Console.WriteLine(" - Даже при увеличении общего объема кода - качество растет");

            Console.WriteLine("\nНажмите на любую кнопку для выхода...");
            Console.ReadKey();

        }

        static string GetBadCode()
        {
            return @"
// fkgkfksjd
public double Calculate(int type, int qty, bool vip)
{
    double price = 0;
    if (type == 1)
    {
        if(qty > 10)
        {
            if(vip)
            {
                price = qty * 100 * 0.7;
            }
            else
            {
                price = qty * 100 * 0.85;
            }
        }
        else
        {
            if (vip)
            {
                price = qty * 100 * 0.9;
            }
            else
            {
                price = qty * 100;
            }
        }
    }
    else if (type == 2)
    {
        price = qty * 150;
    }
    return price;
}
        else";
        }

        //Простой пример "Хорошего" кода - разбит на маленькие функции
        static string GetGoodCode()
        {
            return @"
public double Calculate( int type, int qty, bool vip)
{
    if ( type == 1)
        return CalculateType1(qty, vip);
    else if (type == 2)
        return CalculateType2(qty);
    return 0;
}

private double CalculateType1(int qty, bool vip)
{
    if ( qty > 10)
        return GetBulkPrice(qty, vip);
    else
        return GetRegularPrice(qty, vip);
}

private double GetBulkPrice(int qty, bool vip)
{
    return vip ? qty * 100 * 0.7 : qty * 100 * 0.85;
}

private double GetRegularPrice(int qty, bool vip)
{
    return vip ? qty * 100* 0.9 : qty:100;
}
private double CalculateType2(int qty)
{
    return qty *150
}";
        }
        // Основной метод аналиа кода
        static void AnalyzeCode(string code)
        {
            //Метрика 1: Количество строк
            int lines = code.Split('\n').Length;
            Console.WriteLine($"Строк кода (LOC): {lines}");

            //Метрика 2: цикломатическая сложность
            int complexity = CalculateComplexity(code);
            Console.WriteLine($"Цикломатическая сложность: {complexity} [{GetComplexityLevel(complexity)}]");

            //Метрика 3: Количество методов
            int methods = CountMethods(code);
            Console.WriteLine($"Количество методов {methods}");

            //Метрика 4: Максимальная вложенность
            int nesting = CalculateNesting(code);
            Console.WriteLine($"Максю вложенность: {nesting} уровня(ей) [{GetNestingLevel(nesting)}]");

            //Метрика 5: Индекс сопровождаемости
            double mi = CalculateMaintainabiliti(lines, complexity, nesting);
            Console.WriteLine($"Индекс сопровождаемости {mi:F0}% [{GetMeintanabilityLevel(mi)}]");
            
            int commentCount = CountSingleLineComments(code);
            Console.WriteLine($"Количество строк с комментариями (//): {commentCount}");


        }

        static int CalculateComplexity(string code)
        {

            int count = 1; //Базовая сложность = 1
            for (int i = 0; i < code.Length - 2; i++)
            {
                if (code.Substring(i, 2) == "if" &&
                    (i == 0 || !char.IsLetter(code[i - 1])))
                    count++;
                if (i < code.Length - 4 && code.Substring(i, 3) == "for")
                    count++;
                if (i < code.Length - 5 && code.Substring(i, 5) == "while")
                    count++;
            }
            return count;

        }

        //Подсчет количества методов (По ключевому слову "public" или "private")
        static int CountMethods(string code)
        {
            int count = 0;
            for (int i = 0; i < code.Length - 6; i++)
            {
                if (code.Substring(i, 6) == "public" ||
                    code.Substring(i, 7) == "private")
                    count++;
            }
            return count;
        }

        //Расчет максимальной вложенности ( по фигурным скобкам)

        static int CalculateNesting(string code)
        {
            int current = 0;
            int max = 0;

            foreach (char c in code)
            {
                if (c == '{') current++;
                if (c == '}') current--;
                if (current > max) max = current;
            }
            return max;
        }

        static double CalculateMaintainabiliti(int lines, int complexity, int nesting)
        {
            double score = 100.0;
            score -= complexity * 3;
            score -= nesting * 5;
            score -= lines * 0.2;

            if(score < 0) score = 0;
            if(score > 100) score = 100;
            return score;
        }

        static string GetComplexityLevel(int complexity)
        {
            if (complexity <= 5) return "Отлично";
            if (complexity <= 10) return "Хорошо";
            if (complexity <= 15) return "Удовлетворительно";
            return "Плохо (нужен рефакторинг)";
        }
        static string GetNestingLevel(int nestint)
        {
            if (nestint <= 2) return "Отлично";
            if (nestint <= 3) return "Хорошо";
            if (nestint <= 4) return "Удовлетворительно";
            return "Плохо (Слишком много вложенности";
        }

        static string GetMeintanabilityLevel(double mi)
        {
            if (mi >= 80) return "Легко сопровождать";
            if (mi >= 60) return "Умеренные усилия";
            if (mi >= 40) return "Сложно сопровождать";
            return "Очень сложно сопровождать";
        }
        public static int CountSingleLineComments(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return 0;

            string[] lines = code.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            int commentCount = 0;

            foreach (string line in lines)
            {
                string trimmed = line.TrimStart();
                // Проверяем, начинается ли строка с "//", но не с "///" (XML-комментарии можно включить или исключить — включим)
                if (trimmed.StartsWith("//"))
                {
                    commentCount++;
                }
            }

            return commentCount;
        }


    }
}
