export type PromptKind = "short" | "long" | "code";

export type LessonPrompt = {
  id: string;
  label: string;
  prompt: string;
  kind: PromptKind;
  placeholder?: string;
};

export type LessonSection = {
  heading: string;
  body: string;
};

export type LessonModule = {
  materialId: string;
  intro: string;
  sections: LessonSection[];
  prompts: LessonPrompt[];
};

export const lessonModules: Record<string, LessonModule> = {
  "l1-course-plan": {
    materialId: "l1-course-plan",
    intro:
      "L1 · Python Foundations — a 29-session year plan covering Python starter topics, number bases, ACSL prep, Big-O, and search/sort algorithms. Read the sections below for the full meeting-by-meeting outline.",
    sections: [
      {
        heading: "August — Getting started",
        body: `Meeting 1 (8/18) and Meeting 2 (8/25): First-days orientation per the full-year guide. Room separation does not matter yet.

Practice tip: have members write code on paper, then use a random name picker so everyone stays engaged.`,
      },
      {
        heading: "September — Python Starter (slides 1–65)",
        body: `Meeting 3 (9/1): Python Starter slides 1–14. Use whiteboards. Cover interpreter vs compiler. Introduce ACSL registration if time allows.

Meeting 4 (9/15): Recap slides 1–14; teach slides 15–26.

Meeting 5 (9/22): Recap slides 1–26; teach slides 27–50.

Meeting 6 (9/29): Recap slides 1–50; teach slides 51–65.`,
      },
      {
        heading: "October — Number bases & Test 1",
        body: `Meeting 7 (10/6): Number conversions (base 2, 6, 8, 10, 16). Teach int("101", 2) syntax. Review prior foundations test material if time allows.

Meeting 8 (10/20): Recap number bases. Review for Python Foundations Test 1.

Meeting 9 (10/27): Python Foundations Test 1.`,
      },
      {
        heading: "November–January — ACSL worksheets",
        body: `Meetings 10–17: ACSL intro and worksheet practice. Give back and review Test 1 at Meeting 10. Buffer/review session around pre-competition weeks if scheduled.`,
      },
      {
        heading: "February — Slides 66–74 & Test 2",
        body: `Meeting 20 (2/2): Recap Python Starter; teach slides 66–74. Review for Test 2.

Meeting 21 (2/9): Python Foundations Test 2.

Meeting 22 (2/23): Give back and review Test 2.`,
      },
      {
        heading: "March–April — Big-O, search & sort",
        body: `Meetings 24–25: Big-O notation with whiteboard examples.

Meetings 26–27: Linear search, binary search, selection sort, insertion sort — interactive activities. Connect each algorithm to its Big-O class.

Meetings 28–29: Buffer days and end-of-year wrap-up.`,
      },
    ],
    prompts: [
      {
        id: "l1-goal",
        label: "Your L1 goal",
        prompt: "What do you want to get better at in L1 this year? (One or two sentences.)",
        kind: "short",
        placeholder: "e.g. loops and ACSL number systems",
      },
      {
        id: "l1-acsl",
        label: "ACSL interest",
        prompt: "Are you planning to compete in ACSL this year? Why or why not?",
        kind: "short",
      },
      {
        id: "l1-meeting-priority",
        label: "Upcoming focus",
        prompt: "Which upcoming topic from the plan do you want extra practice on?",
        kind: "short",
      },
    ],
  },

  "l2-course-plan": {
    materialId: "l2-course-plan",
    intro:
      "L2 · Practical Programming — 29 sessions from Python review through PyGame projects (Stars, Ball Game, Tic-Tac-Toe, Pong, Snake) and a combined games menu. Full outline below.",
    sections: [
      {
        heading: "September — Review & algorithms",
        body: `Meeting 3 (9/1): Recap Python Starter slides 1–37 on whiteboards.

Meeting 4 (9/15): Slides 38–74.

Meeting 5 (9/22): Search and sort algorithms (see Search & Sort Code material).

Meeting 6 (9/29): Review Ultimate Cumulative Python Foundations Test.`,
      },
      {
        heading: "October — Cumulative test & PyGame setup",
        body: `Meeting 7 (10/6): Ultimate Cumulative Python Foundations Test.

Meeting 8 (10/20): Install VS Code/IDLE and PyGame (pip install pygame). Create APSDS L2 folder. Build minimum_code.py game loop with colors and quit handling.

Meeting 9 (10/27): PyGame basic exercises (basic_exercises.py) — circles, rects, lines.`,
      },
      {
        heading: "November — Applied shapes & Stars OOP",
        body: `Meeting 10 (11/3): applied_shapes.py — moving tiles, shrinking circle, checkerboard, bouncing balls.

Meeting 11 (11/10): stars.py — first OOP animation: falling and twinkling stars with random.choice colors.`,
      },
      {
        heading: "December–January — Events & Ball Game",
        body: `Meetings 13–14: Mouse and button events; flag-variable click patterns.

Meetings 15–17: Ball Game — paddle collects falling balls for points.`,
      },
      {
        heading: "February–March — Board & arcade games",
        body: `Meeting 19 (1/26): tic_tac_toe.py.

Meetings 20–21: pong.py.

Meeting 22: snake.py — list append/pop for the body.

Meetings 23–25: Finish Snake with minimal help.

Meeting 26: Games.py — menu linking all games as functions.`,
      },
    ],
    prompts: [
      {
        id: "l2-goal",
        label: "Your L2 goal",
        prompt: "Which PyGame project are you most excited to build this year?",
        kind: "short",
      },
      {
        id: "l2-setup",
        label: "Environment check",
        prompt: "Can you run import pygame in IDLE or your terminal without errors? If not, describe what happens.",
        kind: "short",
      },
    ],
  },

  "l3-course-plan": {
    materialId: "l3-course-plan",
    intro:
      "L3 · Advanced Track — data structures, competitive programming, and mentorship for students who completed L2 or equivalent.",
    sections: [
      {
        heading: "Overview",
        body: "L3 combines weekly algorithm workshops, contest prep, and ACSL advanced-division work. Sessions are opt-in with placement approval for contest training.",
      },
      {
        heading: "Fall — Foundations & contest rhythm",
        body: `Stacks, queues, linked lists, trees, heaps, hash maps.
Graph representations and traversal (BFS, DFS).
Recursion, backtracking, divide-and-conquer.
Weekly timed problem sets with editorial walkthroughs.
Guest workshop with an experienced competitor.`,
      },
      {
        heading: "Winter — Competitive programming",
        body: `Dynamic programming patterns.
Greedy algorithms and informal proofs.
Binary search on answer, two pointers, sliding window.
USACO Bronze/Silver prep; CALICO and regional contest walkthroughs.
Pair programming and peer code review.`,
      },
      {
        heading: "Spring — Projects & mentorship",
        body: `Optional app/web mini-project with an algorithmic core.
L3 members mentor L1/L2 on ACSL and foundations.
Mock contests and ACSL finals coordination.
Buffer sessions for individualized contest goals.`,
      },
    ],
    prompts: [
      {
        id: "l3-contests",
        label: "Contest targets",
        prompt: "Which contests or topics do you want L3 to focus on for you this year?",
        kind: "long",
        placeholder: "USACO, graphs, DP, etc.",
      },
    ],
  },

  "python-starter-slides": {
    materialId: "python-starter-slides",
    intro:
      "APSDS Python Starter — the shared intro-to-Python curriculum used in early L1 and L2 meetings. Work through each section, then answer the practice prompts in your own words or code.",
    sections: [
      {
        heading: "1 · What is Python?",
        body: `Python is a high-level programming language. You write source code in a .py file.

An interpreter reads your code line by line and runs it. A compiler translates an entire program to machine code first — Python uses an interpreter.

Run a file: python3 myfile.py (Mac/Linux) or python myfile.py (Windows).
Interactive mode: open IDLE or type python3 in Terminal.`,
      },
      {
        heading: "2 · Variables and types",
        body: `Variables store values. Use = to assign.

  name = "Alex"
  age = 14
  gpa = 3.8
  is_member = True

Common types: str (text), int (whole number), float (decimal), bool (True/False).

type(x) tells you the type. Variables can be reassigned:
  x = 5
  x = x + 1   # x is now 6`,
      },
      {
        heading: "3 · print and input",
        body: `print() displays output:

  print("Hello, APSDS!")
  print(2 + 3)

input() reads a line of text from the user (always returns a str):

  name = input("Enter your name: ")
  print("Hi,", name)

Combine with int() when you need numbers:
  age = int(input("Age? "))`,
      },
      {
        heading: "4 · Operators and strings",
        body: `Arithmetic: +  -  *  /  //  %  **
  // is integer division, % is remainder.

String concatenation uses + :
  msg = "Score: " + str(42)

Comparisons: ==  !=  <  >  <=  >=
Logical: and  or  not`,
      },
      {
        heading: "5 · if / elif / else",
        body: `Decisions use indentation (4 spaces):

  score = int(input("Score? "))
  if score >= 90:
      print("A")
  elif score >= 80:
      print("B")
  else:
      print("Keep practicing")

Only one branch runs. elif and else are optional.`,
      },
      {
        heading: "6 · while and for loops",
        body: `while repeats while a condition is True:

  n = 3
  while n > 0:
      print(n)
      n = n - 1

for loops over a sequence:

  for i in range(5):      # 0, 1, 2, 3, 4
      print(i)

  for letter in "APSDS":
      print(letter)

range(start, stop, step) generates numbers — stop is not included.`,
      },
      {
        heading: "7 · Lists",
        body: `Lists hold ordered items in square brackets:

  nums = [10, 20, 30]
  nums[0]        # 10
  nums.append(40)
  len(nums)      # 4

Loop over a list:
  for x in nums:
      print(x)

Common methods: append, pop, insert, remove, sort.`,
      },
      {
        heading: "8 · Functions",
        body: `def defines reusable code:

  def greet(name):
      return "Hello, " + name

  print(greet("Maya"))

Parameters receive arguments. return sends a value back. Functions can call other functions.`,
      },
      {
        heading: "9 · int() and number bases",
        body: `int("101", 2) converts a string in base 2 to base-10 integer → 5.

  int("FF", 16)   # 255
  int("57", 8)    # 47
  int("42")       # 42 (base 10 default)

To convert base-10 to another base, use repeated division or bin(), hex(), oct():

  bin(5)    # '0b101'
  hex(255)  # '0xff'`,
      },
    ],
    prompts: [
      {
        id: "ps-var",
        label: "Variables",
        prompt: "Create two variables: your favorite language name (str) and a year (int). Print them on one line.",
        kind: "code",
        placeholder: 'lang = "Python"\nyear = 2026\nprint(lang, year)',
      },
      {
        id: "ps-input",
        label: "Input math",
        prompt: "Write code that asks for two integers and prints their sum.",
        kind: "code",
      },
      {
        id: "ps-if",
        label: "Grade checker",
        prompt: "Write an if/elif/else that prints A for score>=90, B for >=80, C for >=70, else F.",
        kind: "code",
      },
      {
        id: "ps-while",
        label: "Countdown",
        prompt: "Write a while loop that prints 5 down to 1.",
        kind: "code",
      },
      {
        id: "ps-for",
        label: "Sum 1 to 10",
        prompt: "Use a for loop with range to compute and print the sum 1+2+...+10.",
        kind: "code",
      },
      {
        id: "ps-list",
        label: "List max",
        prompt: "Given nums = [3, 9, 1, 7], write a loop (no max()) to find the largest value.",
        kind: "code",
      },
      {
        id: "ps-func",
        label: "Square function",
        prompt: "Define square(n) that returns n*n. Print square(6).",
        kind: "code",
      },
      {
        id: "ps-base",
        label: "Binary conversion",
        prompt: "What is int('1101', 2)? Show the math or code you used.",
        kind: "short",
        placeholder: "13",
      },
    ],
  },

  "l2-teaching-pack": {
    materialId: "l2-teaching-pack",
    intro:
      "L2 Teaching Materials — PyGame setup, drawing shapes, event loops, and your first OOP animation with Stars. Follow along in an APSDS L2 folder in your editor.",
    sections: [
      {
        heading: "PyGame minimum template",
        body: `Every PyGame program needs init, a display surface, and a game loop:

  import pygame
  import random
  import time
  from pygame.locals import *

  pygame.init()
  screen = pygame.display.set_mode((640, 480))
  pygame.display.set_caption("My Game")
  clock = pygame.time.Clock()
  white = (255, 255, 255)
  black = (0, 0, 0)

  while True:
      for event in pygame.event.get():
          if event.type == QUIT:
              pygame.quit()
              exit()
      pygame.display.update()
      clock.tick(60)`,
      },
      {
        heading: "Drawing shapes",
        body: `Origin (0, 0) is top-left. x increases right; y increases down.

  pygame.draw.circle(screen, color, (x, y), radius, thickness)
  pygame.draw.rect(screen, color, (x, y, width, height), thickness)
  pygame.draw.line(screen, color, (x1, y1), (x2, y2), thickness)

Center of 640×480 screen: (320, 240). thickness 0 fills the shape.`,
      },
      {
        heading: "Events and the game loop",
        body: `Poll pygame.event.get() each frame. QUIT closes the window.

Mouse: MOUSEBUTTONDOWN gives event.pos (x, y).
Keyboard: KEYDOWN with event.key (e.g. K_LEFT).

Use a flag variable for click-to-toggle behavior:
  drawing = False
  if event.type == MOUSEBUTTONDOWN:
      drawing = not drawing`,
      },
      {
        heading: "Applied shapes — motion",
        body: `Move a shape by updating coordinates each frame:
  x += speed
  if x > width:
      x = 0

Diagonal motion: change both x and y.
Bouncing: reverse speed when hitting edges.
Encapsulate repeated drawing in functions, then call them from the loop.`,
      },
      {
        heading: "Stars — intro to OOP",
        body: `Each star has attributes: x, y, color (and maybe radius).

Start with 100 random (x, y) pairs drawn as circles.
Store Star objects in a list instead of separate variables.

Fall: increase y each frame; reset y to 0 when star passes bottom.
Twinkle: random.choice between two colors each frame or on timer.
Advanced: remove stars that leave the screen and spawn new ones — classic game pattern.`,
      },
    ],
    prompts: [
      {
        id: "l2-pack-circle",
        label: "Draw a circle",
        prompt: "Write one pygame.draw.circle call that draws a filled red circle at the center of a 640×480 screen with radius 50.",
        kind: "code",
      },
      {
        id: "l2-pack-quit",
        label: "Quit handler",
        prompt: "Write the for-event loop block that handles QUIT and exits cleanly.",
        kind: "code",
      },
      {
        id: "l2-pack-star-attr",
        label: "Star attributes",
        prompt: "In plain English, list three attributes a Star object should have and what each means.",
        kind: "short",
      },
      {
        id: "l2-pack-oop",
        label: "Why OOP for stars?",
        prompt: "Why is a list of Star objects better than 100 separate x variables when you have 100 stars?",
        kind: "long",
      },
    ],
  },

  "search-sort-code": {
    materialId: "search-sort-code",
    intro:
      "Reference implementations for linear search, binary search, bubble sort, selection sort, and insertion sort. Study the code, trace examples by hand, then answer the prompts.",
    sections: [
      {
        heading: "Linear search",
        body: `Check each element until found or end of list. O(n).

  def linear_search(arr, target):
      for i in range(len(arr)):
          if arr[i] == target:
              return i
      return -1`,
      },
      {
        heading: "Binary search",
        body: `Requires a sorted list. Repeatedly halve the search range. O(log n).

  def binary_search(arr, target):
      low = 0
      high = len(arr) - 1
      while low <= high:
          mid = (low + high) // 2
          if arr[mid] == target:
              return mid
          elif arr[mid] < target:
              low = mid + 1
          else:
              high = mid - 1
      return -1`,
      },
      {
        heading: "Bubble sort",
        body: `Compare adjacent pairs; swap if out of order; repeat until sorted. O(n²).

  def bubble_sort(arr):
      n = len(arr)
      for i in range(n):
          for j in range(0, n - i - 1):
              if arr[j] > arr[j + 1]:
                  arr[j], arr[j + 1] = arr[j + 1], arr[j]
      return arr`,
      },
      {
        heading: "Selection sort",
        body: `Find minimum of unsorted portion; swap to front. O(n²).

  def selection_sort(arr):
      n = len(arr)
      for i in range(n):
          min_idx = i
          for j in range(i + 1, n):
              if arr[j] < arr[min_idx]:
                  min_idx = j
          arr[i], arr[min_idx] = arr[min_idx], arr[i]
      return arr`,
      },
      {
        heading: "Insertion sort",
        body: `Build sorted portion by inserting each element into place. O(n²) worst case; good on nearly sorted data.

  def insertion_sort(arr):
      for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          while j >= 0 and arr[j] > key:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
      return arr`,
      },
    ],
    prompts: [
      {
        id: "ss-linear-trace",
        label: "Trace linear search",
        prompt: "Trace linear_search([4, 2, 7, 1], 7). What index is returned?",
        kind: "short",
        placeholder: "2",
      },
      {
        id: "ss-binary-pre",
        label: "Binary search prerequisite",
        prompt: "Why must the array be sorted for binary search to work?",
        kind: "short",
      },
      {
        id: "ss-bubble-swaps",
        label: "Bubble sort passes",
        prompt: "How many passes of the inner loop does bubble_sort need for [3, 1, 2] in the worst case? Show the list after pass 1.",
        kind: "long",
      },
      {
        id: "ss-compare",
        label: "Compare sorts",
        prompt: "Which sort (selection vs insertion) moves fewer elements when the input is already sorted? Explain briefly.",
        kind: "short",
      },
    ],
  },

  "big-o-worksheet": {
    materialId: "big-o-worksheet",
    intro:
      "Big-O describes how runtime or memory grows as input size n grows. Focus on the dominant term and drop constants.",
    sections: [
      {
        heading: "Common classes",
        body: `O(1) — constant: array index access.
O(log n) — logarithmic: binary search.
O(n) — linear: single loop over n items.
O(n log n) — efficient sorts like merge sort.
O(n²) — nested loops over n: bubble, selection, insertion sort.
O(2^n) — exponential: naive recursion without memoization.`,
      },
      {
        heading: "Rules of thumb",
        body: `Sequential statements: add complexities.
Nested loops: multiply (often n × n → O(n²)).
Halving each step: O(log n).
Drop lower terms: O(n² + n) → O(n²).
Constants don't matter: O(2n) → O(n).`,
      },
      {
        heading: "Examples",
        body: `  for i in range(n): print(i)           # O(n)
  for i in range(n):
      for j in range(n): pass              # O(n²)
  while n > 1:
      n = n // 2                            # O(log n)`,
      },
    ],
    prompts: [
      {
        id: "bo-1",
        label: "Snippet A",
        prompt: "What is the Big-O of: for i in range(n): for j in range(n): print(i+j) ?",
        kind: "short",
        placeholder: "O(n²)",
      },
      {
        id: "bo-2",
        label: "Snippet B",
        prompt: "What is the Big-O of: print(arr[0]) where arr has length n?",
        kind: "short",
      },
      {
        id: "bo-3",
        label: "Snippet C",
        prompt: "What is the Big-O of binary search on n elements?",
        kind: "short",
      },
      {
        id: "bo-4",
        label: "Snippet D",
        prompt: "What is the Big-O of bubble sort on n elements?",
        kind: "short",
      },
      {
        id: "bo-5",
        label: "Snippet E",
        prompt: "What is the Big-O of: for i in range(n): for j in range(i): print(j) ?",
        kind: "short",
        placeholder: "O(n²)",
      },
    ],
  },

  "acsl-worksheets": {
    materialId: "acsl-worksheets",
    intro:
      "ACSL practice topics: number systems, Boolean algebra, and basic data structures. Work these like contest problems — show your steps.",
    sections: [
      {
        heading: "Number systems",
        body: `Convert between base 2, 8, 10, and 16.
Binary addition: carry when sum ≥ 2.
Hex digits: 0–9, then A=10, B=11, … F=15.

Example: 1011₂ + 1101₂ = 11000₂.`,
      },
      {
        heading: "Boolean algebra",
        body: `AND (·): 1 only if both 1.
OR (+): 1 if either 1.
NOT ('): flip bit.
XOR (⊕): 1 if bits differ.

De Morgan: NOT(A AND B) = (NOT A) OR (NOT B).`,
      },
      {
        heading: "Data structures basics",
        body: `Stack: LIFO — push/pop at top.
Queue: FIFO — enqueue rear, dequeue front.
Tree: nodes with children; root at top.
Graph: vertices and edges; directed vs undirected.`,
      },
    ],
    prompts: [
      {
        id: "acsl-hex",
        label: "Hex to decimal",
        prompt: "Convert 2A₁₆ to base 10.",
        kind: "short",
        placeholder: "42",
      },
      {
        id: "acsl-bin-add",
        label: "Binary addition",
        prompt: "Add in binary: 10110 + 11101. Show carries.",
        kind: "short",
      },
      {
        id: "acsl-bool",
        label: "Boolean simplify",
        prompt: "Simplify: A · (A + B) using Boolean laws.",
        kind: "short",
        placeholder: "A",
      },
      {
        id: "acsl-stack",
        label: "Stack trace",
        prompt: "Start with empty stack. Push 1, Push 2, Pop, Push 3, Pop, Pop. What is popped second?",
        kind: "short",
      },
      {
        id: "acsl-queue",
        label: "Queue trace",
        prompt: "Enqueue A, B, C then dequeue twice. Who is at the front?",
        kind: "short",
        placeholder: "C",
      },
    ],
  },

  "apcsa-prep-guide": {
    materialId: "apcsa-prep-guide",
    intro:
      "AP Computer Science A prep workshops — seven core sessions plus two review days. Use this outline to track what you have covered.",
    sections: [
      {
        heading: "Session 1 — September 13",
        body: "Primitives, variables, and operators. Parent Q&A if scheduled, then student lesson through introductory slides.",
      },
      {
        heading: "Session 2 — October 4",
        body: "Control flow: conditionals and loops (if, while, for).",
      },
      {
        heading: "Session 3 — October 25",
        body: "Classes, objects, methods, Scanner, and file reading.",
      },
      {
        heading: "Session 4 — November 15",
        body: "Inheritance and polymorphism.",
      },
      {
        heading: "Session 5 — December 6",
        body: "Arrays and ArrayLists.",
      },
      {
        heading: "Session 6 — January 10",
        body: "2D arrays, String methods, and Math class.",
      },
      {
        heading: "Session 7 — January 31",
        body: "Recursion, searching, sorting, and runtime efficiency.",
      },
      {
        heading: "Review days",
        body: "Review #1 — March 14. Review #2 — May 2. Focus on FRQ practice and missed unit topics.",
      },
    ],
    prompts: [
      {
        id: "apcsa-strong",
        label: "Strongest unit",
        prompt: "Which APCSA topic do you feel strongest on right now?",
        kind: "short",
      },
      {
        id: "apcsa-weak",
        label: "Needs review",
        prompt: "Which topic do you want the next workshop to emphasize for you?",
        kind: "short",
      },
      {
        id: "apcsa-plan",
        label: "Study plan",
        prompt: "Describe one weekly habit you will use to prepare for the exam.",
        kind: "long",
      },
    ],
  },

  "python-foundations-test-1": {
    materialId: "python-foundations-test-1",
    intro:
      "Python Foundations Test 1 — answer all questions below. Staff may enable this only during the official test window.",
    sections: [
      {
        heading: "Instructions",
        body: "No calculators unless your instructor says otherwise. Show work in code or short explanations. Each question is worth equal credit.",
      },
    ],
    prompts: [
      {
        id: "pft1-q1",
        label: "Q1 · Types",
        prompt: "What is the type of the expression 3 / 2 in Python 3?",
        kind: "short",
        placeholder: "float",
      },
      {
        id: "pft1-q2",
        label: "Q2 · Output",
        prompt: "What does print(2 ** 3 + 1) output?",
        kind: "short",
      },
      {
        id: "pft1-q3",
        label: "Q3 · Loop",
        prompt: "Write a for loop that prints the numbers 0 through 4 inclusive.",
        kind: "code",
      },
      {
        id: "pft1-q4",
        label: "Q4 · if/else",
        prompt: "Write code that prints 'even' if n is even and 'odd' if n is odd.",
        kind: "code",
      },
      {
        id: "pft1-q5",
        label: "Q5 · List",
        prompt: "Given lst = [5, 1, 4], what is lst[1] after lst.append(9)?",
        kind: "short",
      },
      {
        id: "pft1-q6",
        label: "Q6 · Function",
        prompt: "Define double(x) that returns 2*x. What is double(7)?",
        kind: "code",
      },
      {
        id: "pft1-q7",
        label: "Q7 · Base conversion",
        prompt: "Evaluate int('1010', 2).",
        kind: "short",
      },
      {
        id: "pft1-q8",
        label: "Q8 · Trace",
        prompt: "Trace: x=0; for i in range(3): x += i. What is x?",
        kind: "short",
        placeholder: "3",
      },
    ],
  },

  "python-foundations-test-2": {
    materialId: "python-foundations-test-2",
    intro:
      "Python Foundations Test 2 — different questions from Test 1. Complete during the assigned window only.",
    sections: [
      {
        heading: "Instructions",
        body: "Answer every prompt. Use Python syntax unless asked for plain English.",
      },
    ],
    prompts: [
      {
        id: "pft2-q1",
        label: "Q1 · String",
        prompt: "What is len('APSDS')?",
        kind: "short",
      },
      {
        id: "pft2-q2",
        label: "Q2 · Modulo",
        prompt: "What is 17 % 5?",
        kind: "short",
      },
      {
        id: "pft2-q3",
        label: "Q3 · while loop",
        prompt: "Write a while loop that prints 1, 2, 3 then stops.",
        kind: "code",
      },
      {
        id: "pft2-q4",
        label: "Q4 · elif chain",
        prompt: "Write if/elif/else that maps 1→'one', 2→'two', anything else→'other'.",
        kind: "code",
      },
      {
        id: "pft2-q5",
        label: "Q5 · List mutation",
        prompt: "Start with a = [2, 4]. Write code to insert 3 at index 1. What is a?",
        kind: "code",
      },
      {
        id: "pft2-q6",
        label: "Q6 · Scope",
        prompt: "What prints? def f(): x=1\\nprint(x)\\nf()",
        kind: "short",
        placeholder: "NameError (x not defined globally)",
      },
      {
        id: "pft2-q7",
        label: "Q7 · Hex",
        prompt: "What is int('1F', 16)?",
        kind: "short",
      },
      {
        id: "pft2-q8",
        label: "Q8 · Nested loop count",
        prompt: "How many times does print run? for i in range(2): for j in range(3): print(i,j)",
        kind: "short",
        placeholder: "6",
      },
    ],
  },

  "ultimate-cumulative-test": {
    materialId: "ultimate-cumulative-test",
    intro:
      "Ultimate Cumulative Python Foundations Test — used early in L2 to confirm readiness for PyGame and projects.",
    sections: [
      {
        heading: "Coverage",
        body: "Variables, control flow, lists, functions, number bases, Big-O basics, and search/sort concepts from L1.",
      },
    ],
    prompts: [
      {
        id: "uct-q1",
        label: "Q1",
        prompt: "Explain the difference between = and == in Python.",
        kind: "short",
      },
      {
        id: "uct-q2",
        label: "Q2",
        prompt: "Write a function is_positive(n) returning True if n > 0.",
        kind: "code",
      },
      {
        id: "uct-q3",
        label: "Q3",
        prompt: "What is the Big-O of linear search?",
        kind: "short",
      },
      {
        id: "uct-q4",
        label: "Q4",
        prompt: "Write binary_search pseudocode or Python for a sorted list.",
        kind: "code",
      },
      {
        id: "uct-q5",
        label: "Q5",
        prompt: "Convert 47₁₀ to binary.",
        kind: "short",
      },
      {
        id: "uct-q6",
        label: "Q6",
        prompt: "What does arr.pop() return and how does the list change?",
        kind: "short",
      },
      {
        id: "uct-q7",
        label: "Q7",
        prompt: "Trace selection_sort on [3, 1, 2] — list after first outer iteration?",
        kind: "short",
      },
      {
        id: "uct-q8",
        label: "Q8",
        prompt: "Write a for loop that builds a list of squares 1, 4, 9, 16 for n=1..4.",
        kind: "code",
      },
      {
        id: "uct-q9",
        label: "Q9",
        prompt: "Simplify Boolean: A + A' · B",
        kind: "short",
        placeholder: "A + B",
      },
      {
        id: "uct-q10",
        label: "Q10",
        prompt: "Why is bubble sort O(n²) in the worst case?",
        kind: "long",
      },
    ],
  },

  "pop-quiz-slot": {
    materialId: "pop-quiz-slot",
    intro: "Pop quiz — short checks when your chapter enables this material. Answer quickly from memory.",
    sections: [
      {
        heading: "Note",
        body: "Directors enable this item only when a live pop quiz is active.",
      },
    ],
    prompts: [
      {
        id: "pq-1",
        label: "Pop Q1",
        prompt: "What keyword starts a function definition in Python?",
        kind: "short",
      },
      {
        id: "pq-2",
        label: "Pop Q2",
        prompt: "What is 2 ** 4?",
        kind: "short",
      },
      {
        id: "pq-3",
        label: "Pop Q3",
        prompt: "Name two PyGame draw functions.",
        kind: "short",
      },
      {
        id: "pq-4",
        label: "Pop Q4",
        prompt: "What does return -1 usually mean in a search function?",
        kind: "short",
      },
      {
        id: "pq-5",
        label: "Pop Q5",
        prompt: "Stack is LIFO or FIFO?",
        kind: "short",
      },
    ],
  },

  "weekly-practice": {
    materialId: "weekly-practice",
    intro: "Weekly practice between meetings — submit your work here so instructors can review.",
    sections: [
      {
        heading: "This week",
        body: "Complete all five problems. Explain your reasoning on paper-style questions; paste runnable code for programming items.",
      },
    ],
    prompts: [
      {
        id: "wp-1",
        label: "Problem 1",
        prompt: "Write a program that asks for a radius and prints the area of a circle (use 3.14159).",
        kind: "code",
      },
      {
        id: "wp-2",
        label: "Problem 2",
        prompt: "Print all multiples of 3 from 3 to 30 using a while loop.",
        kind: "code",
      },
      {
        id: "wp-3",
        label: "Problem 3",
        prompt: "Given nums = [8, 3, 11, 1], find the index of 11 without using .index().",
        kind: "code",
      },
      {
        id: "wp-4",
        label: "Problem 4",
        prompt: "Convert 100₁₀ to base 8.",
        kind: "short",
      },
      {
        id: "wp-5",
        label: "Problem 5",
        prompt: "In one sentence each, describe linear search and binary search.",
        kind: "long",
      },
    ],
  },

  "pygame-basic-exercises": {
    materialId: "pygame-basic-exercises",
    intro:
      "Assignment: create basic_exercises.py in your APSDS L2 folder. Use the minimum PyGame template, then complete each drawing task below.",
    sections: [
      {
        heading: "Setup",
        body: "640×480 window, caption 'Basic Exercises', quit handler, clock.tick(60). Comment out previous exercise before starting the next (five blank lines between).",
      },
      {
        heading: "Coordinate reminder",
        body: "(0,0) is top-left. Screen center is (320, 240). thickness 0 fills shapes.",
      },
    ],
    prompts: [
      {
        id: "pge-circle",
        label: "Exercise 1 · Circle",
        prompt: "Draw a filled blue circle radius 40 at the center of the screen.",
        kind: "code",
      },
      {
        id: "pge-rect",
        label: "Exercise 2 · Rectangle",
        prompt: "Draw a green rectangle (100, 100, 200, 80) with border thickness 3.",
        kind: "code",
      },
      {
        id: "pge-line",
        label: "Exercise 3 · Line",
        prompt: "Draw a yellow line from (0, 0) to (640, 480) with thickness 5.",
        kind: "code",
      },
      {
        id: "pge-scene",
        label: "Exercise 4 · Mini scene",
        prompt: "Draw at least three different shapes in different colors on one frame.",
        kind: "code",
      },
    ],
  },

  "stars-project": {
    materialId: "stars-project",
    intro:
      "Stars animation project (stars.py) — your first OOP PyGame build: many stars falling with twinkle and respawn.",
    sections: [
      {
        heading: "Requirements",
        body: `1. Class Star with x, y, color (and optional radius).
2. List of ~100 stars with random starting positions.
3. Each frame: move stars down; reset or respawn when they pass the bottom.
4. Twinkle: alternate colors with random.choice.
5. Advanced: delete off-screen stars and spawn new ones.`,
      },
      {
        heading: "Grading notes",
        body: "Working loop and quit handler required. OOP list of objects earns full credit; parallel lists are partial credit.",
      },
    ],
    prompts: [
      {
        id: "stars-class",
        label: "Star class",
        prompt: "Paste your Star class __init__ and one method (e.g. fall or draw).",
        kind: "code",
      },
      {
        id: "stars-twinkle",
        label: "Twinkle logic",
        prompt: "How do you implement twinkle? Describe or paste the color-update code.",
        kind: "long",
      },
      {
        id: "stars-respawn",
        label: "Respawn",
        prompt: "Paste or describe how you remove a star and create a new one at the top.",
        kind: "code",
      },
    ],
  },

  "ball-game-project": {
    materialId: "ball-game-project",
    intro:
      "Ball Game — balls fall from the sky; move a paddle with arrow keys or mouse to collect them and score points.",
    sections: [
      {
        heading: "Requirements",
        body: `Falling balls with random x and speed.
Paddle at bottom controlled by player.
Collision: ball disappears and score increases when touching paddle.
Display score on screen with pygame font or simple print to caption updates.`,
      },
    ],
    prompts: [
      {
        id: "ball-move",
        label: "Paddle movement",
        prompt: "Paste your paddle movement code (keyboard or mouse).",
        kind: "code",
      },
      {
        id: "ball-collision",
        label: "Collision",
        prompt: "How do you detect ball–paddle collision? Paste the condition.",
        kind: "code",
      },
      {
        id: "ball-score",
        label: "Scoring",
        prompt: "Describe how score updates and resets when a ball is missed (if applicable).",
        kind: "short",
      },
    ],
  },

  "tic-tac-toe-project": {
    materialId: "tic-tac-toe-project",
    intro: "Tic-Tac-Toe (tic_tac_toe.py) — two-player board game with win and draw detection.",
    sections: [
      {
        heading: "Requirements",
        body: `3×3 grid stored in a list or 2D structure.
Alternate X and O turns; reject illegal moves.
Check rows, columns, diagonals after each move.
Declare winner or draw; option to restart.`,
      },
    ],
    prompts: [
      {
        id: "ttt-board",
        label: "Board representation",
        prompt: "How do you store the board? Paste the data structure initialization.",
        kind: "code",
      },
      {
        id: "ttt-win",
        label: "Win check",
        prompt: "Paste or pseudocode your win-checking logic.",
        kind: "code",
      },
      {
        id: "ttt-ui",
        label: "Display",
        prompt: "Do you use console or PyGame graphics? Describe how a player enters a move.",
        kind: "short",
      },
    ],
  },

  "pong-project": {
    materialId: "pong-project",
    intro: "Pong (pong.py) — classic two-paddle ball game with bouncing and score.",
    sections: [
      {
        heading: "Requirements",
        body: `Ball moves with velocity (dx, dy); bounces off top/bottom and paddles.
Two paddles (keyboard controlled).
Score when ball passes a paddle off-screen.
Reset ball to center after point.`,
      },
    ],
    prompts: [
      {
        id: "pong-bounce",
        label: "Ball bounce",
        prompt: "Paste code that reverses dy when the ball hits the top or bottom wall.",
        kind: "code",
      },
      {
        id: "pong-paddle",
        label: "Paddle control",
        prompt: "Paste event or key handling for one paddle.",
        kind: "code",
      },
      {
        id: "pong-score",
        label: "Score update",
        prompt: "When does each player score? Describe edge detection.",
        kind: "short",
      },
    ],
  },

  "snake-project": {
    materialId: "snake-project",
    intro:
      "Snake (snake.py) — grow the snake by eating food; game over on wall or self collision.",
    sections: [
      {
        heading: "Requirements",
        body: `Snake body as a list of (x, y) segments — use append for new head, pop tail unless growing.
Food spawns at random grid cell.
Direction changes on arrow keys; no instant reverse into itself.
Score increases when eating food.`,
      },
    ],
    prompts: [
      {
        id: "snake-move",
        label: "Movement",
        prompt: "Paste how you update the head and tail each frame (append/pop).",
        kind: "code",
      },
      {
        id: "snake-grow",
        label: "Growing",
        prompt: "What changes when the snake eats food?",
        kind: "short",
      },
      {
        id: "snake-gameover",
        label: "Game over",
        prompt: "Paste or describe self-collision or wall collision check.",
        kind: "code",
      },
    ],
  },

  "games-menu-project": {
    materialId: "games-menu-project",
    intro:
      "Games menu (Games.py) — one program with a menu that launches Stars, Ball Game, Tic-Tac-Toe, Pong, or Snake as functions.",
    sections: [
      {
        heading: "Requirements",
        body: `Main menu screen with numbered or clickable options.
Each game implemented as a function (e.g. run_pong()).
Return to menu when a game ends.
Shared quit handling pattern across games.`,
      },
    ],
    prompts: [
      {
        id: "menu-structure",
        label: "Menu loop",
        prompt: "Paste your main menu loop (display options, read choice).",
        kind: "code",
      },
      {
        id: "menu-functions",
        label: "Game functions",
        prompt: "List the function names you defined for each game.",
        kind: "short",
      },
      {
        id: "menu-return",
        label: "Return to menu",
        prompt: "How does a game hand control back to the menu without exiting the program?",
        kind: "long",
      },
    ],
  },

  "grades-overview": {
    materialId: "grades-overview",
    intro:
      "Your Syntaxia dashboard shows scores for submitted lesson answers, tests, and assignments when staff publish them for your chapter.",
    sections: [
      {
        heading: "How grades appear",
        body: `Complete prompts on each material page and submit.
Chapter staff review submissions and enter scores visible on your member dashboard.
Tests like Foundations Test 1 may stay hidden until test day — check with your director.`,
      },
      {
        heading: "Questions",
        body: "If a score looks wrong or missing, message your chapter contact through the directory page.",
      },
    ],
    prompts: [
      {
        id: "grades-notes",
        label: "Optional notes",
        prompt: "Anything you want instructors to know about your progress this term? (Optional)",
        kind: "long",
        placeholder: "Optional — leave blank if none",
      },
    ],
  },

  "chapter-directory": {
    materialId: "chapter-directory",
    intro:
      "Chapter directory on Syntaxia — find your campus roster, staff contacts, and chapter-specific announcements.",
    sections: [
      {
        heading: "Using the directory",
        body: `Select your chapter from the members page if you belong to more than one.
Staff listed as directors or executives can adjust material visibility and grades for your chapter.
Use chapter contact info for meeting times, room changes, and ACSL registration help.`,
      },
      {
        heading: "Privacy",
        body: "Only verified members see full contact details. Do not share roster information outside the club.",
      },
    ],
    prompts: [
      {
        id: "chapter-contact-pref",
        label: "Contact preference",
        prompt: "What is the best way for your chapter staff to reach you (email, school chat, etc.)?",
        kind: "short",
      },
    ],
  },

  "club-description": {
    materialId: "club-description",
    intro:
      "APSDS (Algorithmic Problem Solving & Data Structures) — BISV's computer science club for Python foundations through competitive programming.",
    sections: [
      {
        heading: "Short description",
        body: "APSDS introduces data structures, algorithms, OOP, and problem-solving through hands-on projects. Tracks: L1 foundations, L2 practical PyGame programming, L3 advanced contests. Free APCSA workshops and ACSL registration support.",
      },
      {
        heading: "Full description",
        body: `Students learn beyond syntax — decomposition, iterative design, data structure use, and efficiency.

Focus areas: algorithmic thinking (recursion, graphs, OOP), game and app projects, ACSL and APCSA prep, and advanced contest training (USACO, CALICO, etc.) for L3.

APSDS has consistently achieved strong ACSL results at BISV.`,
      },
    ],
    prompts: [],
  },

  "flyer-v1": {
    materialId: "flyer-v1",
    intro: "Recruiting flyer v1 — print or share to invite new members to APSDS.",
    sections: [
      {
        heading: "Viewing notes",
        body: "Open the poster image on this page for the full design. Use for club fair tables, hallway boards, and social posts. Highlights meeting times and how to join Syntaxia.",
      },
    ],
    prompts: [],
  },

  "flyer-v2": {
    materialId: "flyer-v2",
    intro: "Recruiting flyer v2 — alternate layout for the same APSDS recruiting message.",
    sections: [
      {
        heading: "Viewing notes",
        body: "Compare with v1 for your chapter's preferred look. Both flyers link prospective members to sign up through Syntaxia.",
      },
    ],
    prompts: [],
  },

  "club-fest-poster": {
    materialId: "club-fest-poster",
    intro: "Club Fest poster — back-to-school festival display for APSDS.",
    sections: [
      {
        heading: "Viewing notes",
        body: "Large-format poster for festival booths. Pair with a laptop showing the Syntaxia member dashboard demo if your chapter runs a table.",
      },
    ],
    prompts: [],
  },
};

export function getLesson(materialId: string): LessonModule | null {
  return lessonModules[materialId] ?? null;
}
