export const PROGRAMMING_LANGUAGES = [
  { id: "javascript", name: "JavaScript", judge0Id: 63, fileExtension: "js" },
  { id: "python", name: "Python 3", judge0Id: 71, fileExtension: "py" },
  { id: "java", name: "Java", judge0Id: 62, fileExtension: "java" },
  { id: "cpp", name: "C++", judge0Id: 54, fileExtension: "cpp" },
  { id: "c", name: "C", judge0Id: 50, fileExtension: "c" },
  { id: "csharp", name: "C#", judge0Id: 51, fileExtension: "cs" },
  { id: "php", name: "PHP", judge0Id: 68, fileExtension: "php" },
  { id: "ruby", name: "Ruby", judge0Id: 72, fileExtension: "rb" },
  { id: "go", name: "Go", judge0Id: 60, fileExtension: "go" },
  { id: "rust", name: "Rust", judge0Id: 73, fileExtension: "rs" },
  { id: "kotlin", name: "Kotlin", judge0Id: 78, fileExtension: "kt" },
  { id: "swift", name: "Swift", judge0Id: 83, fileExtension: "swift" },
  { id: "typescript", name: "TypeScript", judge0Id: 74, fileExtension: "ts" },
  { id: "scala", name: "Scala", judge0Id: 81, fileExtension: "scala" },
  { id: "perl", name: "Perl", judge0Id: 85, fileExtension: "pl" },
  { id: "r", name: "R", judge0Id: 80, fileExtension: "r" },
  { id: "nodejs", name: "Node.js", judge0Id: 63, fileExtension: "js" },
];

export const LANGUAGE_TEMPLATES = {
  javascript: `// JavaScript Solution
console.log("Hello World");

// Read input example:
// const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
// console.log(input);`,

  python: `# Python Solution
print("Hello World")

# Read input example:
# import sys
# input_data = sys.stdin.read().strip()
# print(input_data)`,

  java: `// Java Solution
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

  cpp: `// C++ Solution
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,

  c: `// C Solution
#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`,

  csharp: `// C# Solution
using System;

public class Solution {
    public static void Main(string[] args) {
        Console.WriteLine("Hello World");
    }
}`,

  php: `<?php
echo "Hello World\\n";
?>`,

  ruby: `# Ruby Solution
puts "Hello World"`,

  go: `// Go Solution
package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}`,

  rust: `// Rust Solution
fn main() {
    println!("Hello World");
}`,

  kotlin: `// Kotlin Solution
fun main() {
    println("Hello World")
}`,

  swift: `// Swift Solution
print("Hello World")`,

  typescript: `// TypeScript Solution
console.log("Hello World");`,

  scala: `// Scala Solution
object Main {
    def main(args: Array[String]): Unit = {
        println("Hello World")
    }
}`,

  perl: `#!/usr/bin/perl
print "Hello World\\n";`,

  r: `# R Solution
cat("Hello World\\n")`,

  nodejs: `// Node.js Solution
console.log("Hello World");`,
};
