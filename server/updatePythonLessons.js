const mongoose = require("mongoose");
const Course = require("./models/course");

// ======================================
// MONGODB CONNECTION
// ======================================

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;


// ======================================
// PYTHON COURSE ID
// ======================================

const PYTHON_COURSE_ID =
  "6ab4c0f2d3dc102dacdd4a4c";


// ======================================
// 24 PYTHON LESSONS
// ======================================

const lessons = [
  {
    title: "Introduction to Python",
    description:
      "Learn what Python is, why it is widely used, and where Python is commonly applied.",
    content: `
Python is a high-level, general-purpose programming language known for its simple and readable syntax.

It was created by Guido van Rossum and first released in 1991.

Python is designed to make programming easier to understand. Its syntax is relatively close to normal English, which makes it a good language for beginners.

Python is used in many areas of technology, including:

- Web development
- Data analysis
- Artificial intelligence and machine learning
- Automation
- Scientific computing
- Desktop applications
- Scripting
- Cybersecurity

One of the main advantages of Python is its large collection of libraries and frameworks.

Libraries provide ready-made functionality that developers can use instead of building everything from scratch.

Your first Python program:

print("Hello, World!")

The print() function displays information on the screen.

Output:

Hello, World!

You can also print other messages:

print("Welcome to Educare!")
print("I am learning Python.")

Important Points:

- Python is a high-level programming language.
- Python was created by Guido van Rossum.
- Python emphasizes readable and simple syntax.
- Python is used for web development, data analysis, AI, automation and many other areas.
- print() is commonly used to display output.

Common Mistake:

Do not forget quotation marks when printing text.

Correct:

print("Hello")

Incorrect:

print(Hello)

Practice Task:

Write a Python program that prints:

My name is [your name]
I am learning Python
Python is interesting
`,
    duration: "20 minutes",
    order: 1,
  },

  {
    title: "Setting Up Python",
    description:
      "Learn how to install Python and prepare your computer for writing and running Python programs.",
    content: `
Before writing Python programs, you need a Python interpreter installed on your computer.

The Python interpreter reads your Python code and executes it.

Python programs are commonly saved using the .py file extension.

For example:

hello.py

Checking Python installation:

Open a terminal and run:

python --version

You may see something similar to:

Python 3.x.x

This confirms that Python is installed and available from the terminal.

Creating your first Python file:

Create a file called:

hello.py

Add:

print("Hello from Python!")

Run the program from the terminal:

python hello.py

Output:

Hello from Python!

VS Code can be used to write and run Python programs.

Useful features include:

- Syntax highlighting
- Code completion
- Error detection
- Debugging
- Terminal integration
- Extensions

Important Points:

- Python programs normally use the .py extension.
- The Python interpreter executes Python code.
- python --version can be used to check the installed version.
- VS Code can be used to write and run Python programs.

Practice Task:

Create a file called about.py and print your name, age and the fact that you are learning Python.
`,
    duration: "20 minutes",
    order: 2,
  },

  {
    title: "Python Syntax and Basic Structure",
    description:
      "Learn the basic rules that determine how Python code is written and executed.",
    content: `
Syntax refers to the rules used to write valid Python programs.

Python uses indentation to define blocks of code.

For example:

age = 20

if age >= 18:
    print("You are an adult")

The indented line belongs to the if statement.

Indentation:

Correct:

if age >= 18:
    print("Adult")

Incorrect:

if age >= 18:
print("Adult")

The second example causes an indentation error.

Comments:

Comments are notes written inside the program for humans to understand the code.

A single-line comment starts with #.

Example:

# Store the student's age
age = 22

print(age)

Python ignores comments when executing the program.

Case sensitivity:

Python is case-sensitive.

For example:

name = "Uday"
Name = "Karthik"

Python treats name and Name as two different variables.

Important Points:

- Python uses indentation to organize code blocks.
- Comments begin with #.
- Python is case-sensitive.
- Correct indentation is important.
- Python statements represent instructions for the interpreter.

Practice Task:

Write a Python program containing:

1. One comment
2. One variable
3. One print() statement
4. A simple if statement
`,
    duration: "25 minutes",
    order: 3,
  },

  {
    title: "Variables in Python",
    description:
      "Learn how variables store information and how values can be assigned and changed.",
    content: `
A variable is a name that refers to a value in a Python program.

For example:

name = "Uday"
age = 22

Here, name contains a string and age contains an integer.

Python does not require you to explicitly declare the type of a variable.

For example:

age = 22

Python determines that age contains an integer.

Changing a variable:

age = 22
age = 23

print(age)

Output:

23

Multiple variables:

name = "Uday"
age = 22
city = "Bangalore"

print(name)
print(age)
print(city)

Meaningful variable names make programs easier to understand.

For example:

monthly_salary = 50000

is easier to understand than:

x = 50000

Variable naming rules:

- A variable can contain letters.
- A variable can contain numbers.
- A variable can contain underscores.
- A variable cannot start with a number.
- A variable cannot contain spaces.
- Python variable names are case-sensitive.

Important Points:

- Variables store values.
- Python determines variable types automatically.
- Variable values can be changed.
- Meaningful names make programs easier to understand.
- Python variable names are case-sensitive.

Practice Task:

Create variables for:

name
age
city
favorite_language

Then print all four values.
`,
    duration: "25 minutes",
    order: 4,
  },

  {
    title: "Data Types",
    description:
      "Learn the main Python data types used to represent different kinds of information.",
    content: `
A data type tells Python what kind of value is being stored.

Common Python data types include:

int
float
str
bool
list
tuple
set
dict

Integer:

age = 22

Integers are whole numbers.

Float:

price = 99.50

Floating-point numbers contain decimal values.

String:

name = "Uday"

Strings contain text.

Boolean:

is_logged_in = True
is_completed = False

Boolean values represent True or False.

Checking a data type:

age = 22

print(type(age))

Output:

<class 'int'>

Another example:

name = "Uday"

print(type(name))

Output:

<class 'str'>

Important Points:

- int represents whole numbers.
- float represents decimal numbers.
- str represents text.
- bool represents True or False.
- type() can be used to inspect a value's type.

Common Mistake:

Do not confuse:

25

with:

"25"

The first is an integer while the second is a string.

Practice Task:

Create variables containing:

- Your age
- Your height
- Your name
- Whether you are a student

Then use type() to display the data type of each variable.
`,
    duration: "25 minutes",
    order: 5,
  },

  {
    title: "Input and Output",
    description:
      "Learn how to display information using print() and receive information from users using input().",
    content: `
Programs often need to communicate with users.

Python provides the print() function for displaying information.

Example:

print("Welcome to Educare!")

Output:

Welcome to Educare!

Taking user input:

name = input("Enter your name: ")

print("Hello", name)

If the user enters:

Uday

The output will be:

Hello Uday

Important:

The input() function returns a string by default.

For example:

age = input("Enter your age: ")

Even if the user enters 22, Python receives it as text.

If you want a number, convert the value.

Example:

age = int(input("Enter your age: "))

print(age + 1)

If the user enters 22:

Output:

23

For decimal numbers, use float():

price = float(input("Enter the price: "))

Important Points:

- print() displays information.
- input() receives information from the user.
- input() returns a string by default.
- int() converts a value to an integer.
- float() converts a value to a floating-point number.

Common Mistake:

If you write:

x = input("Enter first number: ")
y = input("Enter second number: ")

print(x + y)

and enter 10 and 20, the result will be:

1020

because both values are strings.

Use int() when numerical calculation is required.

Practice Task:

Create a program that asks the user for:

- Name
- Age
- Python marks

Then display all three values.
`,
    duration: "25 minutes",
    order: 6,
  },

  {
    title: "Operators in Python",
    description:
      "Learn how to perform mathematical calculations, comparisons and logical operations in Python.",
    content: `
Operators are symbols or keywords used to perform operations on values.

Arithmetic operators include:

+ Addition
- Subtraction
* Multiplication
/ Division
% Remainder
** Exponent
// Floor division

Example:

a = 10
b = 3

print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a % b)
print(a ** b)
print(a // b)

Comparison operators compare values.

Examples:

==
!=
>
<
>=
<=

Example:

age = 22

print(age == 22)
print(age > 18)
print(age < 18)

Logical operators include:

and
or
not

Example:

age = 22
has_id = True

print(age >= 18 and has_id)

Important Points:

- Arithmetic operators perform calculations.
- Comparison operators produce True or False.
- Logical operators combine conditions.
- % returns the remainder.
- // performs floor division.

Common Mistake:

Do not confuse = and ==.

= assigns a value.

== compares two values.

Practice Task:

Create two numbers and calculate their:

- Sum
- Difference
- Product
- Division
- Remainder
`,
    duration: "25 minutes",
    order: 7,
  },

  {
    title: "Conditional Statements",
    description:
      "Learn how programs make decisions based on conditions.",
    content: `
Programs often need to make decisions.

For example, a program may need to determine whether a student has passed an exam.

Python uses conditional statements for this purpose.

The basic structure is:

if condition:
    code

Example:

marks = 75

if marks >= 40:
    print("You passed")

Output:

You passed

The code inside the if block runs only when the condition is true.

Another example:

age = 20

if age >= 18:
    print("You are eligible")

Indentation is important.

Correct:

if age >= 18:
    print("Adult")

A colon is required after the condition.

Important Points:

- if is used to make decisions.
- Conditions evaluate to True or False.
- A colon is required after the condition.
- Code inside the condition must be indented.

Practice Task:

Ask the user for their age.

If the age is 18 or greater, print:

You are an adult
`,
    duration: "25 minutes",
    order: 8,
  },

  {
    title: "if, elif and else",
    description:
      "Learn how to handle multiple conditions using if, elif and else.",
    content: `
Sometimes a program needs to handle multiple possible conditions.

Python provides:

if
elif
else

Example:

marks = 75

if marks >= 90:
    print("Grade A")
elif marks >= 60:
    print("Grade B")
else:
    print("Grade C")

Output:

Grade B

Python checks conditions from top to bottom.

Once it finds a true condition, it executes that block and skips the remaining conditions.

Example:

age = 15

if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")

Output:

Teenager

Condition order matters.

For example, putting a broad condition before a more specific condition may prevent the later condition from being reached.

Important Points:

- if checks the first condition.
- elif checks additional conditions.
- else handles the remaining case.
- Multiple elif blocks can be used.
- Python evaluates conditions from top to bottom.

Practice Task:

Create a grading program:

90–100 → A
75–89 → B
50–74 → C
Below 50 → Fail
`,
    duration: "25 minutes",
    order: 9,
  },

  {
    title: "Loops in Python",
    description:
      "Learn how loops are used to repeatedly execute a block of code.",
    content: `
A loop allows a program to execute the same block of code multiple times.

Python mainly provides:

- for loops
- while loops

Loops are useful for:

- Processing lists
- Printing numbers
- Reading records
- Repeating calculations
- Processing data

Example using a for loop:

for i in range(5):
    print(i)

Output:

0
1
2
3
4

Example using a while loop:

count = 1

while count <= 5:
    print(count)
    count += 1

Output:

1
2
3
4
5

Important Points:

- Loops reduce repeated code.
- for is commonly used for sequences.
- while continues while its condition is true.
- Loops should eventually reach a stopping condition.

Common Mistake:

A while loop can become infinite if the condition never becomes false.

Practice Task:

Write a program that prints numbers from 1 to 10 using a loop.
`,
    duration: "25 minutes",
    order: 10,
  },

  {
    title: "for Loop",
    description:
      "Learn how to use Python's for loop to iterate over sequences and ranges.",
    content: `
The for loop is used to repeat an operation for each item in a sequence.

Example:

names = ["Uday", "Rahul", "Priya"]

for name in names:
    print(name)

Output:

Uday
Rahul
Priya

Using range():

for number in range(5):
    print(number)

Output:

0
1
2
3
4

The ending value is not included.

Starting from another number:

for number in range(1, 6):
    print(number)

Output:

1
2
3
4
5

Using a step:

for number in range(2, 11, 2):
    print(number)

Output:

2
4
6
8
10

Looping through a string:

word = "Python"

for letter in word:
    print(letter)

Output:

P
y
t
h
o
n

Important Points:

- for is useful for iterating through sequences.
- range() can generate number sequences.
- The end value of range() is excluded.
- Strings and lists can be iterated over.

Practice Task:

Create a list containing five subject names and use a for loop to print each subject.
`,
    duration: "25 minutes",
    order: 11,
  },

  {
    title: "while Loop",
    description:
      "Learn how to repeatedly execute code while a condition remains true.",
    content: `
A while loop repeatedly executes a block of code as long as its condition is true.

Basic structure:

while condition:
    code

Example:

count = 1

while count <= 5:
    print(count)
    count += 1

Output:

1
2
3
4
5

The condition is checked before each iteration.

The loop continues until the condition becomes false.

Using while with user input:

password = ""

while password != "python123":
    password = input("Enter password: ")

print("Access granted")

The program continues asking for the password until the correct value is entered.

Be careful with infinite loops.

Example:

count = 1

while count <= 5:
    print(count)

This loop never changes count, so the condition remains true.

Important Points:

- while runs while its condition is true.
- The condition is checked before each iteration.
- The loop should normally contain something that eventually makes the condition false.
- while is useful when the number of repetitions is not known in advance.

Practice Task:

Start with count = 10 and use a while loop to print numbers from 10 down to 1.
`,
    duration: "25 minutes",
    order: 12,
  },

  {
    title: "Strings in Python",
    description:
      "Learn how to create, access, modify and work with text using Python strings.",
    content: `
A string is a sequence of characters used to represent text.

Strings can be created using single or double quotation marks.

name = "Uday"
course = "Python"

Accessing characters:

word = "Python"

print(word[0])
print(word[1])
print(word[5])

Output:

P
y
n

Python starts indexing from 0.

Negative indexing can access characters from the end.

word = "Python"

print(word[-1])

Output:

n

String slicing allows you to extract part of a string.

word = "Python"

print(word[0:3])

Output:

Pyt

Useful string methods include:

upper()
lower()
capitalize()
strip()

Example:

name = "uday"

print(name.upper())
print(name.capitalize())

Joining strings:

first_name = "Uday"
last_name = "Karthik"

full_name = first_name + " " + last_name

print(full_name)

f-strings provide another way to combine text and variables.

name = "Uday"
age = 22

print(f"My name is {name} and I am {age} years old.")

Important Points:

- Strings contain text.
- Indexing starts from 0.
- Negative indexes access characters from the end.
- Slicing extracts part of a string.
- String methods process text.
- f-strings are useful for formatted output.

Practice Task:

Create a string containing your full name.

Print:

1. First character
2. Last character
3. Uppercase version
4. Number of characters
`,
    duration: "30 minutes",
    order: 13,
  },

  {
    title: "Lists in Python",
    description:
      "Learn how to store multiple values in a list and perform common list operations.",
    content: `
A list is a collection used to store multiple values in a single variable.

Lists are created using square brackets.

fruits = ["Apple", "Banana", "Mango"]

A list can contain different data types.

data = ["Uday", 22, 85.5, True]

Lists use zero-based indexing.

print(fruits[0])
print(fruits[1])

Output:

Apple
Banana

Lists are mutable, which means their values can be changed.

fruits[1] = "Orange"

Adding items:

fruits.append("Mango")

Removing items:

fruits.remove("Banana")

Finding the number of items:

numbers = [10, 20, 30, 40]

print(len(numbers))

Output:

4

Looping through a list:

subjects = ["Python", "SQL", "Java"]

for subject in subjects:
    print(subject)

Important Points:

- Lists use square brackets.
- Lists can contain multiple values.
- List indexes start from 0.
- Lists are mutable.
- append() adds an item.
- remove() removes an item.
- len() returns the number of items.

Practice Task:

Create a list containing five programming languages.

Then:

1. Print the first language.
2. Add another language.
3. Remove one language.
4. Print the final list.
`,
    duration: "30 minutes",
    order: 14,
  },

  {
    title: "Tuples in Python",
    description:
      "Learn how tuples store multiple values and how they differ from lists.",
    content: `
A tuple is another collection type in Python.

Tuples are commonly created using parentheses.

coordinates = (10, 20)

A tuple can contain multiple values.

student = ("Uday", 22, "Python")

Tuples support indexing.

print(student[0])
print(student[1])

Output:

Uday
22

One important difference between lists and tuples is that tuples are immutable.

This means their values cannot normally be changed after creation.

For example:

student[1] = 23

would cause an error.

Tuples are useful when data should remain unchanged.

Tuple unpacking allows values to be assigned to multiple variables.

student = ("Uday", 22, "Python")

name, age, course = student

print(name)
print(age)
print(course)

Important Points:

- Tuples store multiple values.
- Tuples use parentheses.
- Tuples support indexing.
- Tuples are immutable.
- Tuple unpacking assigns values to multiple variables.

Practice Task:

Create a tuple containing:

- Your name
- Your age
- Your city
- Your course

Then unpack it into four variables.
`,
    duration: "25 minutes",
    order: 15,
  },

  {
    title: "Sets in Python",
    description:
      "Learn how sets store unique values and how to perform common set operations.",
    content: `
A set is a collection that stores unique values.

Sets are created using curly brackets.

numbers = {10, 20, 30}

Duplicate values are automatically removed.

numbers = {10, 20, 20, 30, 30}

Adding values:

numbers.add(40)

Removing values:

numbers.remove(20)

Set union combines values from two sets.

a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)

Set intersection returns values that appear in both sets.

a = {1, 2, 3}
b = {2, 3, 4}

print(a & b)

Result:

{2, 3}

Sets are useful for finding unique values and common values.

Important Points:

- Sets store unique values.
- Duplicate values are removed.
- Union combines sets.
- Intersection finds common values.
- Sets are useful for membership and mathematical set operations.

An empty set should be created using:

empty_set = set()

not:

empty_set = {}

because {} creates an empty dictionary.

Practice Task:

Create two sets containing student names.

Find:

1. Students in either set.
2. Students present in both sets.
`,
    duration: "30 minutes",
    order: 16,
  },

  {
    title: "Dictionaries in Python",
    description:
      "Learn how dictionaries store information using key-value pairs.",
    content: `
A dictionary stores information using key-value pairs.

Example:

student = {
    "name": "Uday",
    "age": 22,
    "course": "Python"
}

The left side contains the key and the right side contains the value.

Accessing a value:

print(student["name"])

Output:

Uday

Adding a value:

student["city"] = "Bangalore"

Updating a value:

student["age"] = 23

Removing a value:

student.pop("city")

Looping through a dictionary:

for key, value in student.items():
    print(key, ":", value)

Dictionaries are useful for representing structured information.

Example:

employee = {
    "name": "Uday",
    "department": "Technology",
    "experience": 1,
    "skills": ["Python", "SQL", "Power BI"]
}

Important Points:

- Dictionaries store key-value pairs.
- Keys are used to access values.
- Values can have different data types.
- Dictionaries can be updated.
- items() allows you to loop through keys and values.

The get() method can be useful when a key might not exist:

student.get("salary")

Practice Task:

Create a dictionary representing yourself with:

- name
- age
- city
- course
- skills

Print each value.
`,
    duration: "30 minutes",
    order: 17,
  },

  {
    title: "Functions in Python",
    description:
      "Learn how to create reusable blocks of code using functions.",
    content: `
A function is a reusable block of code designed to perform a particular task.

Functions make programs easier to understand, maintain and reuse.

Creating a function:

def greet():
    print("Hello from Educare!")

Calling the function:

greet()

Output:

Hello from Educare!

Function with a parameter:

def greet(name):
    print("Hello", name)

greet("Uday")

Output:

Hello Uday

Multiple parameters:

def add(a, b):
    print(a + b)

add(10, 20)

Output:

30

Returning a value:

def add(a, b):
    return a + b

result = add(10, 20)

print(result)

Output:

30

Practical example:

def calculate_average(marks):
    total = sum(marks)
    return total / len(marks)

marks = [80, 75, 90, 85]

average = calculate_average(marks)

print("Average:", average)

Output:

Average: 82.5

Important Points:

- Functions are reusable blocks of code.
- def is used to define a function.
- Parameters allow functions to receive values.
- return sends a result back.
- Functions reduce repeated code.

Practice Task:

Create a function called calculate_square() that accepts a number and returns its square.
`,
    duration: "30 minutes",
    order: 18,
  },

  {
    title: "Function Arguments and Return Values",
    description:
      "Learn how to pass different types of information into functions and return results.",
    content: `
Functions can receive information through arguments.

Example:

def greet(name):
    print("Hello", name)

greet("Uday")

Here, name is the parameter and "Uday" is the argument.

Multiple arguments:

def add(a, b):
    return a + b

result = add(10, 20)

print(result)

Output:

30

Positional arguments are assigned based on their position.

def introduce(name, age):
    print("Name:", name)
    print("Age:", age)

introduce("Uday", 22)

Keyword arguments specify the parameter names.

introduce(age=22, name="Uday")

Default arguments provide a fallback value.

def greet(name="Student"):
    print("Hello", name)

greet()
greet("Uday")

Output:

Hello Student
Hello Uday

Functions can also return multiple values.

def calculate(a, b):
    total = a + b
    difference = a - b
    return total, difference

result1, result2 = calculate(20, 5)

print(result1)
print(result2)

Output:

25
15

Important Points:

- Parameters receive values inside a function.
- Arguments are the actual values passed to a function.
- Keyword arguments specify parameter names.
- Default arguments provide fallback values.
- return sends results back to the caller.
- A function can return multiple values.

Practice Task:

Create a function called calculate_bill() that accepts price and quantity and returns the total cost.
`,
    duration: "30 minutes",
    order: 19,
  },

  {
    title: "Exception Handling",
    description:
      "Learn how to handle errors in Python programs using try, except, else and finally.",
    content: `
Errors can occur while a Python program is running.

For example, dividing by zero causes an error.

number = 10
result = number / 0

Python provides exception handling to deal with these situations.

The try block contains code that might produce an error.

The except block handles the error.

Example:

try:
    number = 10
    result = number / 0
except ZeroDivisionError:
    print("Cannot divide by zero")

Output:

Cannot divide by zero

Handling invalid input:

try:
    age = int(input("Enter your age: "))
    print("Your age is", age)
except ValueError:
    print("Please enter a valid number")

The else block runs when no exception occurs.

The finally block runs whether an exception occurs or not.

Example:

try:
    print("Processing...")
except:
    print("An error occurred")
finally:
    print("Program finished")

Important Points:

- try contains code that may cause an error.
- except handles an exception.
- else runs when no exception occurs.
- finally runs regardless of the result.
- Specific exception types are usually better than catching every error.

Practice Task:

Create a calculator that asks for two numbers and divides them.

Handle:

- Invalid number input
- Division by zero
`,
    duration: "30 minutes",
    order: 20,
  },

  {
    title: "File Handling",
    description:
      "Learn how to create, read, write and append data to files using Python.",
    content: `
Python can work with files stored on a computer.

File handling is useful when information needs to be saved and used later.

Python provides the open() function for working with files.

Common file modes include:

r = Read
w = Write
a = Append
x = Create

Reading a file:

with open("notes.txt", "r") as file:
    content = file.read()

print(content)

The with statement automatically handles closing the file.

Writing to a file:

with open("notes.txt", "w") as file:
    file.write("Welcome to Python!")

The w mode can replace existing content.

Appending:

with open("notes.txt", "a") as file:
    file.write("\\nPython is powerful.")

Reading line by line:

with open("notes.txt", "r") as file:
    for line in file:
        print(line)

Practical example:

name = "Uday"
marks = 85

with open("student.txt", "w") as file:
    file.write("Name: " + name + "\\n")
    file.write("Marks: " + str(marks))

Important Points:

- open() is used to work with files.
- r reads a file.
- w writes to a file.
- a appends information.
- with is recommended for file handling.
- w mode can replace existing content.

Practice Task:

Create a file called students.txt.

Write three student names into it and then read the file and display the names.
`,
    duration: "30 minutes",
    order: 21,
  },

  {
    title: "Modules and Packages",
    description:
      "Learn how to organize Python code into modules and use functionality provided by Python libraries.",
    content: `
As programs become larger, putting all the code in one file can become difficult to manage.

Python allows code to be organized into modules.

A module is a Python file containing reusable code.

Using a built-in module:

import math

print(math.sqrt(25))

Output:

5.0

You can also import a specific function:

from math import sqrt

print(sqrt(36))

Output:

6.0

The random module provides random values.

Example:

import random

number = random.randint(1, 10)

print(number)

Creating your own module:

Suppose calculator.py contains:

def add(a, b):
    return a + b

Another Python file can use it:

import calculator

result = calculator.add(10, 20)

print(result)

Output:

30

Packages organize related modules into a structured collection.

Python also has a large ecosystem of external packages for:

- Data analysis
- Machine learning
- Web development
- Automation
- Scientific computing

Important Points:

- Modules help organize reusable Python code.
- import is used to use modules.
- Python includes many built-in modules.
- Developers can create their own modules.
- Packages organize related modules.

Practice Task:

Use Python's math module to:

1. Calculate the square root of a number.
2. Calculate a number raised to a power.
3. Print the value of pi.
`,
    duration: "30 minutes",
    order: 22,
  },

  {
    title: "Object-Oriented Programming Basics",
    description:
      "Learn the basic concepts of classes and objects in Python.",
    content: `
Object-Oriented Programming, commonly called OOP, is a programming approach that organizes code around objects.

An object can contain data and functions that operate on that data.

In Python, classes are used to create objects.

Creating a class:

class Student:
    pass

Creating an object:

student1 = Student()

The __init__() method is commonly used to initialize object data.

Example:

class Student:

    def __init__(self, name, age):
        self.name = name
        self.age = age

Create an object:

student1 = Student("Uday", 22)

print(student1.name)
print(student1.age)

Output:

Uday
22

Methods are functions defined inside a class.

Example:

class Student:

    def __init__(self, name):
        self.name = name

    def introduce(self):
        print("My name is", self.name)

Create the object:

student1 = Student("Uday")

student1.introduce()

Output:

My name is Uday

self refers to the current object.

OOP becomes useful when applications become larger and more complex.

An education platform could contain objects such as:

Student
Course
Lesson
Quiz
Certificate

Important Points:

- A class is a blueprint for creating objects.
- An object is an instance of a class.
- __init__() is commonly used to initialize objects.
- Methods are functions defined inside classes.
- self refers to the current object.

Practice Task:

Create a Car class containing:

- brand
- model
- year

Then create one object and print its information.
`,
    duration: "35 minutes",
    order: 23,
  },

  {
    title: "Python Practice and Final Concepts",
    description:
      "Apply the Python concepts learned throughout the course by building a small practical program.",
    content: `
You have now learned the major foundations of Python.

These include:

- Variables
- Data types
- Input and output
- Operators
- Conditions
- Loops
- Strings
- Lists
- Tuples
- Sets
- Dictionaries
- Functions
- Exception handling
- File handling
- Modules
- Object-oriented programming

The best way to improve your programming ability is to combine these concepts in practical programs.

Mini Project: Student Marks Program

Example:

def calculate_average(marks):
    return sum(marks) / len(marks)


student = {
    "name": "Uday",
    "marks": [85, 72, 91, 78, 88]
}

average = calculate_average(student["marks"])

print("Student:", student["name"])
print("Marks:", student["marks"])
print("Average:", average)

if average >= 90:
    print("Grade: A")
elif average >= 75:
    print("Grade: B")
elif average >= 50:
    print("Grade: C")
else:
    print("Grade: Fail")

Possible output:

Student: Uday
Marks: [85, 72, 91, 78, 88]
Average: 82.8
Grade: B

This program combines multiple Python concepts.

Dictionary:

student = {
    "name": "Uday",
    "marks": [...]
}

List:

"marks": [85, 72, 91, 78, 88]

Function:

def calculate_average(marks):

Built-in functions:

sum()
len()

Conditional statements:

if
elif
else

Final Practice Challenge:

Build a Student Management Program that allows a user to:

1. Enter a student's name.
2. Enter marks for three subjects.
3. Calculate the total.
4. Calculate the average.
5. Determine the grade.
6. Display all the information.

Try to combine the concepts you have learned instead of writing everything as one long block.

After completing the beginner course, you can move toward advanced Python topics such as:

- List comprehensions
- Lambda functions
- Decorators
- Generators
- Advanced OOP
- APIs
- Database connectivity
- Web development
- Data analysis
- Machine learning

Practice Task:

Build the Student Management Program described above and run it using the Educare Python Compiler.
`,
    duration: "45 minutes",
    order: 24,
  },
];


// ======================================
// UPDATE DATABASE
// ======================================

async function updatePythonLessons() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully.");


    const course = await Course.findById(
      PYTHON_COURSE_ID
    );

    if (!course) {
      console.log("Python course not found.");

      await mongoose.disconnect();

      return;
    }


    course.lessonList = lessons;

    course.lessons = lessons.length;

    await course.save();


    console.log("");
    console.log("======================================");
    console.log("Python course updated successfully!");
    console.log("======================================");
    console.log("Course:", course.title);
    console.log("Lessons added:", lessons.length);
    console.log("======================================");
    console.log("");


    await mongoose.disconnect();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("");
    console.error("Failed to update Python lessons:");
    console.error(error);

    await mongoose.disconnect();
  }
}


// ======================================
// RUN
// ======================================

updatePythonLessons();