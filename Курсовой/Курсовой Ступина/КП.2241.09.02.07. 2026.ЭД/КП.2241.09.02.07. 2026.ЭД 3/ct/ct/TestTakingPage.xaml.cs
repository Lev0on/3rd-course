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
using System.Data.Entity;

namespace ct
{
    /// <summary>
    /// Логика взаимодействия для TestTakingPage.xaml
    /// </summary>

    public partial class TestTakingPage : Page
    {
        private int _testId;
        private int _userId;
        private CurTestsEntities _db;
        private Test _currentTest;
        private List<Question> _questions;
        private Dictionary<int, int> _userAnswers; // QuestionID -> номер ответа (1,2,3,4)

        public TestTakingPage(int testId, int userId, CurTestsEntities db)
        {
            InitializeComponent();
            _testId = testId;
            _userId = userId;
            _db = db;
            _userAnswers = new Dictionary<int, int>();

            LoadTest();
        }

        private void LoadTest()
        {
            try
            {
                _currentTest = _db.Tests.Find(_testId);
                if (_currentTest == null)
                {
                    MessageBox.Show("Тест не найден!");
                    NavigationService.GoBack();
                    return;
                }

                TxtTestTitle.Text = _currentTest.Theme ?? "Тест";
                TxtTestInfo.Text = $"Дисциплина: {_currentTest.Discipline} | Вопросов: {_currentTest.CountQuestion}";

                _questions = _db.Questions
                    .Where(q => q.TestID == _testId)
                    .ToList();

                DisplayQuestions();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Ошибка загрузки теста: {ex.Message}");
            }
        }

        private void DisplayQuestions()
        {
            QuestionsPanel.Children.Clear();
            _userAnswers.Clear();

            if (_questions.Count == 0)
            {
                QuestionsPanel.Children.Add(new TextBlock
                {
                    Text = "В этом тесте пока нет вопросов.",
                    FontSize = 16,
                    Foreground = Brushes.Gray,
                    Margin = new Thickness(10)
                });
                return;
            }

            int questionNumber = 1;
            foreach (var question in _questions)
            {
                var questionBlock = new Border
                {
                    BorderBrush = Brushes.LightGray,
                    BorderThickness = new Thickness(1),
                    CornerRadius = new CornerRadius(5),
                    Padding = new Thickness(15),
                    Margin = new Thickness(0, 0, 0, 15),
                    Background = Brushes.White
                };

                var stackPanel = new StackPanel();

                // Текст вопроса
                var questionText = new TextBlock
                {
                    Text = $"{questionNumber}. {question.TextQuestion}",
                    FontSize = 16,
                    FontWeight = FontWeights.Bold,
                    Margin = new Thickness(0, 0, 0, 15),
                    TextWrapping = TextWrapping.Wrap
                };
                stackPanel.Children.Add(questionText);

                // Поле для ввода номера ответа
                var answerLabel = new TextBlock
                {
                    Text = "Введите правильный ответ",
                    Margin = new Thickness(0, 0, 0, 5),
                    FontSize = 14
                };
                stackPanel.Children.Add(answerLabel);

                var answerTextBox = new TextBox
                {
                    Name = $"AnswerBox_{question.QuestionID}",
                    Height = 30,
                    Width = 50,
                    HorizontalAlignment = HorizontalAlignment.Left,
                    FontSize = 16,
                    TextAlignment = TextAlignment.Center,
                    Tag = question.QuestionID,
                    Margin = new Thickness(0, 0, 0, 10)
                };

                // Проверяем, что введено число
                answerTextBox.TextChanged += (s, e) =>
                {
                    if (int.TryParse(answerTextBox.Text, out int answerNumber))
                    {
                        _userAnswers[question.QuestionID] = answerNumber;
                    }
                };

                // Разрешаем вводить только цифры
                answerTextBox.PreviewTextInput += (s, e) =>
                {
                    e.Handled = !char.IsDigit(e.Text[0]);
                };

                stackPanel.Children.Add(answerTextBox);

                // Результат (показывается после завершения)
                var resultText = new TextBlock
                {
                    Name = $"Result_{question.QuestionID}",
                    FontWeight = FontWeights.Bold,
                    FontSize = 14,
                    Visibility = Visibility.Collapsed,
                    Margin = new Thickness(0, 10, 0, 0)
                };
                stackPanel.Children.Add(resultText);

                questionBlock.Child = stackPanel;
                QuestionsPanel.Children.Add(questionBlock);

                questionNumber++;
            }
        }

        private void BtnFinishTest_Click(object sender, RoutedEventArgs e)
        {
            if (_questions.Count == 0)
            {
                MessageBox.Show("В тесте нет вопросов!");
                return;
            }

            int answeredCount = _userAnswers.Count;
            if (answeredCount < _questions.Count)
            {
                var result = MessageBox.Show(
                    $"Вы ответили на {answeredCount} из {_questions.Count} вопросов.\n" +
                    "Вы уверены, что хотите завершить тест?",
                    "Подтверждение",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);

                if (result != MessageBoxResult.Yes)
                    
                return;
            }

            SaveTestResults();
        }

        private void SaveTestResults()
        {
            try
            {
                int correctCount = 0;
                var tries = new List<Trye>();

                foreach (var question in _questions)
                {
                    // Получаем ответ пользователя (номер ответа)
                    int userAnswerNumber = _userAnswers.ContainsKey(question.QuestionID)
                        ? _userAnswers[question.QuestionID]
                        : 0; // 0 если не ответил

                    // Правильный ответ (номер из базы)
                    int correctAnswerNumber = question.Answer;

                    // Проверяем правильность
                    bool isCorrect = (userAnswerNumber == correctAnswerNumber);

                    if (isCorrect)
                        correctCount++;

                    // Создаём запись в таблице Tryes
                    var tryRecord = new Trye
                    {
                        UID = _userId,
                        TestID = _testId,
                        QuestionID = question.QuestionID,
                        Answer = question.Answer,        // Правильный ответ (номер)
                        WriteAnswer = isCorrect                     // true/false
                    };

                    tries.Add(tryRecord);
                }

                foreach (var tryItem in tries)
                {
                    _db.Tryes.Add(tryItem);
                }
                _db.SaveChanges();

                // Показываем результаты
                double percentage = (double)correctCount / _questions.Count * 100;

                MessageBox.Show(
                    $"Тест завершён!\n\n" +
                    $"Правильных ответов: {correctCount} из {_questions.Count}\n" +
                    $"Результат: {percentage:F1}%\n\n" +
                    $"Результаты сохранены.",
                    "Результаты теста",
                    MessageBoxButton.OK,
                    MessageBoxImage.Information);
                NavigationService.GoBack();
                ShowResults();

                var finishButton = FindName("BtnFinishTest") as Button;
                if (finishButton != null)
                {
                    finishButton.Content = "← Назад к тестам";
                    finishButton.Click -= BtnFinishTest_Click;
                    finishButton.Click += (s, e) => NavigationService.GoBack();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Ошибка сохранения результатов: {ex.Message}");
            }
        }

        private void ShowResults()
        {
            foreach (var question in _questions)
            {
                int userAnswerNumber = _userAnswers.ContainsKey(question.QuestionID)
                    ? _userAnswers[question.QuestionID]
                    : 0;

                int correctAnswerNumber = question.Answer;
                bool isCorrect = (userAnswerNumber == correctAnswerNumber);

                // Показываем результат
                var resultBlock = FindName($"Result_{question.QuestionID}") as TextBlock;
                if (resultBlock != null)
                {
                    if (isCorrect)
                    {
                        resultBlock.Text = $"✓ Ваш ответ: {userAnswerNumber} (ПРАВИЛЬНО)";
                        resultBlock.Foreground = Brushes.Green;
                    }
                    else
                    {
                        resultBlock.Text = $"✗ Ваш ответ: {userAnswerNumber} (НЕПРАВИЛЬНО)\n" +
                                         $"✓ Правильный ответ: {correctAnswerNumber}";
                        resultBlock.Foreground = Brushes.Red;
                    }
                    resultBlock.Visibility = Visibility.Visible;
                }
            }
        }

        private void BtnCancel_Click(object sender, RoutedEventArgs e)
        {
            var result = MessageBox.Show(
                "Вы действительно хотите выйти из теста?\nПрогресс не будет сохранён.",
                "Подтверждение",
                MessageBoxButton.YesNo,
                MessageBoxImage.Warning);

            if (result == MessageBoxResult.Yes)
            {
                NavigationService.GoBack();
            }
        }
    }
}